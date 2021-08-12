import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {Track} from "../Models/SpotifyModel";
import {headerTextAtom, isDarkAtom, queueAtom} from "../Global/atoms";
import ButtonComponent from "../Components/ButtonComponent";
import Song from "../Components/Song";
import {PlaybackObject, usePlaybackModel} from "../Models/PlaybackModel";
import {useTrackModel} from "../Models/TrackModel";
import {usePlaylistModel, Playlist} from "../Models/PlaylistModel";
import PlaceholderLargeDark from "../Images/placeholder-large-dark.svg";
import PlaceholderLargeLight from "../Images/placeholder-large-light.svg";
import {firestore} from "../Global/firebase";

function PlaylistView() {
	const setHeaderText = useSetRecoilState(headerTextAtom);
	const {prepareForNewSong, shuffleObjects} = usePlaybackModel();
	const playlistModel = usePlaylistModel();
	const trackModel = useTrackModel();
	const {playlistID} = useParams();
	const isDark = useRecoilValue(isDarkAtom);
	const [songs, setSongs] = useState([]);
	const setQueue = useSetRecoilState(queueAtom);

	const [playlist, setPlaylist] = useState(new Playlist());

	async function fetchAndSetPlaylist() {
		//get the playlist
		const fetchedPlaylist = await playlistModel.getPlaylist(playlistID);
		setPlaylist(fetchedPlaylist);
		setSongs(fetchedPlaylist.firstTwentySongs);
	}

	useEffect(() => {
		setHeaderText("");

		if (!playlist.title || playlist.id !== playlistID) {
			fetchAndSetPlaylist();
		}
	}, [playlistID]);

	function getRelativeDate(date) {
		const now = new Date();
		const startOfToday = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		).getTime();
		const startOfDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		).getTime();

		const distance = startOfToday - startOfDate;
		const distanceInDays = distance / (1000 * 60 * 60 * 24);

		if (distanceInDays <= 0) {
			return "Today";
		} else if (distanceInDays === 1) {
			return "Yesterday";
		} else if (distanceInDays <= 7) {
			const weekdays = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			return weekdays[date.getDay()];
		} else {
			return `${date.getMonth() + 1}/${date.getDate()}/${
				date.getFullYear() - 2000
			}`;
		}
	}

	function getTrackFromIdsWithPositions(songIdWithPosition, firstTwentyIDs) {
		//use various sources of data (songs at the top of the file, local storage, and the firebase in that order)
		//firebase is the last resort since its the most expensive, using a variable being the first because it is the least expensive
		//this will be in the form of a promise because it might involve a network request

		//the nature of this will pretty much be in the form of an if if else else chain.
		//	if the id is in the array of keys for the playlist.songs
		//	else if the value we try to get from localstorage is nil
		//	else just get it from the playlist.collection("songs")

		return new Promise((resolve, reject) => {
			if (firstTwentyIDs.includes(songIdWithPosition.object)) {
				const track = playlist.firstTwentySongs[songIdWithPosition.position];

				resolve(track);
			} else {
				firestore
					.collection("playlists")
					.doc(playlist.id)
					.collection("songs")
					.doc(songIdWithPosition.object)
					.get()
					.then((doc) => {
						const data = doc.data();
						const track = new Track(
							data.title,
							data.artist,
							data.album,
							data.track,
							data.date,
							data.disc,
							data.id,
							data.artwork,
							data.thumbnail,
							data.duration,
							data.albumID,
							data.artistObjects
						);

						resolve(track);
					});
			}
		});
	}

	function fabricatePlaybackObjects(tracksWithPositions) {
		let playbackObjects = [];

		tracksWithPositions.forEach((trackWithPosition) => {
			let playbackObject = new PlaybackObject(
				trackWithPosition.object,
				"",
				new Date(),
				trackWithPosition.position
			);

			playbackObjects.push(playbackObject);
		});

		return playbackObjects;
	}

	function playArrayOfIDsWithPositions(songIDsWithPositions) {
		let errors = 0;

		let songIDs = [];

		songIDsWithPositions.forEach((songIDWithPosition) => {
			let songID = songIDWithPosition.object;
			songIDs.push(songID);
		});

		//call getTrackFromID for every single id

		let tracksWithPositions = [];

		function checkForFinish() {
			if (tracksWithPositions.length == songIDs.length - errors) {
				console.log("did finish the last one");

				//once you have an array of tracks, sort it using the songIDs.indexOf(first.id) - songIDs.indexOf(second.id)
				tracksWithPositions.sort(
					(firstTrackWithPosition, secondTrackWithPosition) => {
						return (
							songIDs.indexOf(firstTrackWithPosition.object.id) -
							songIDs.indexOf(secondTrackWithPosition.object.id)
						);
					}
				);

				//after assigning all of the tracks positions, get the first ten by splicing the sortedTracksWithPositionsArray.

				const firstTenTracksWithPositions = [...tracksWithPositions];
				firstTenTracksWithPositions.splice(10, tracksWithPositions.length);

				//put those first ten into trackModel.playCollection(sortedTracksWithPositionsArray)

				console.log({firstTenTracksWithPositions});
				trackModel
					.playCollection(firstTenTracksWithPositions)
					.then((unsortedFirstTenPlaybackObjects) => {
						//once you get the queue of those first ten playbackObjects, get everything after the first ten in the sortedTracksWithPositionsArray
						
						let firstTenPlaybackObjects = [...unsortedFirstTenPlaybackObjects];
						firstTenPlaybackObjects.sort((firstPlaybackObject, secondPlaybackObject) => {
							return songIDs.indexOf(firstPlaybackObject.track.id) - songIDs.indexOf(secondPlaybackObject.track.id)
						})

						console.log({firstTenPlaybackObjects});

						let remainingTracksWithPositions = [...tracksWithPositions];

						remainingTracksWithPositions.reverse();
						remainingTracksWithPositions.splice(
							tracksWithPositions.length - 10
						);
						remainingTracksWithPositions.reverse()

						//put those into fabricatePlaybackObjects(tracksWithPositions: sortedTracksWithPositionsArray)
						const fabricatedPlaybackObjects = fabricatePlaybackObjects(
							remainingTracksWithPositions
						);

						//append the fabricated playbackObjects to the end of a new array with the queue of the first ten at the beginning. set that to the queue.
						let newQueue = [
							...firstTenPlaybackObjects,
							...fabricatedPlaybackObjects,
						];

						setQueue(newQueue);
						console.log({newQueue});
					});
			}
		}

		let firstTwentyIDs = [];

		playlist.firstTwentySongs.forEach((track) => {
			firstTwentyIDs.push(track.id);
		});

		let i;
		for (i = 0; i < songIDs.length; i++) {
			const index = i;

			getTrackFromIdsWithPositions(songIDsWithPositions[index], firstTwentyIDs)
				.then((track) => {
					//give the track a position

					const trackWithPosition = {
						object: track,
						position: songIDsWithPositions[index].position,
					};

					tracksWithPositions.push(trackWithPosition);

					checkForFinish();
				})
				.catch((error) => {
					errors++;
					console.log("error getting track from id:", error);

					checkForFinish();
				});
		}
	}

	function deleteSong(track) {
		playlistModel
			.deleteFromPlaylist(playlist, track)
			.then(() => {
				fetchAndSetPlaylist();
			})
			.catch(() => {
				fetchAndSetPlaylist();
			});
	}

	if (playlist.title && playlist.id === playlistID) {
		return (
			<div id="playlist-view" className="space-y-10">
				<div className="md:flex md:space-x-6 space-y-6 md:space-y-0 md:items-center">
					<div
						alt=""
						className="w-full max-w-sm md:w-60 md:h-60 mx-auto md:mx-0 md:max-w-none">
						<PlaylistArtwork />
					</div>
					<div className="my-auto space-y-6">
						<div className="space-y-3">
							<p className="text text-xl font-semibold text-center md:text-left">
								{playlist.title}
							</p>

							<p className="text-gray-400 font-semibold text-center md:text-left">
								{playlist.description}
							</p>

							<p className="text-gray-400 font-semibold text-center md:text-left">
								{playlist.ownerName} • Last Updated{" "}
								{getRelativeDate(playlist.lastUpdatedTime)}
							</p>
						</div>

						<div className="double-button">
							<ButtonComponent
								text="Play"
								action={() => {
									prepareForNewSong();

									const songIDsWithPositions = trackModel.giveObjectsPositions(
										playlist.songIDs
									);

									playArrayOfIDsWithPositions(songIDsWithPositions);
								}}
							/>
							<p></p>
							<ButtonComponent
								text="Shuffle"
								action={() => {
									prepareForNewSong();

									const songIDsWithPositions = trackModel.giveObjectsPositions(
										playlist.songIDs
									);
									const shuffledSongIDsWithPositions =
										shuffleObjects(songIDsWithPositions);

									console.log({shuffledSongIDsWithPositions});

									playArrayOfIDsWithPositions(shuffledSongIDsWithPositions);
								}}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-8">
					{songs.map((track, key) => {
						return (
							<Song
								track={track}
								key={key}
								index={key}
								deleteFromPlaylist={() => deleteSong(track)}
							/>
						);
					})}
					<p className="text-gray-400 font-semibold text-center text-sm md:text-left">
						Created {getRelativeDate(playlist.createTime)}
					</p>
				</div>
			</div>
		);
	} else {
		return null;
	}

	function PlaylistArtwork() {
		function getRoundingFromKey(key) {
			switch (key) {
				case 0:
					return "rounded-tl-xl";
				case 1:
					return "rounded-tr-xl";
				case 2:
					return "rounded-bl-xl";
				case 3:
					return "rounded-br-xl";
				default:
					return "";
			}
		}

		const firstFourSongs = [...playlist.firstTwentySongs];
		firstFourSongs.splice(4, playlist.firstTwentySongs.length);

		if (playlist.firstTwentySongs.length > 0) {
			if (playlist.firstTwentySongs.length >= 4) {
				return (
					<div className="grid grid-cols-2 gap-0">
						{firstFourSongs.map((song, key) => {
							return (
								<img
									src={song.artwork}
									alt=""
									key={key}
									className={getRoundingFromKey(key)}
								/>
							);
						})}
					</div>
				);
			} else {
				return (
					<img
						src={playlist.firstTwentySongs[0].artwork}
						alt=""
						className="rounded-xl"
					/>
				);
			}
		} else {
			if (isDark) {
				return <img src={PlaceholderLargeDark} alt="" className="rounded-xl" />;
			} else {
				return (
					<img src={PlaceholderLargeLight} alt="" className="rounded-xl" />
				);
			}
		}
	}
}

export default PlaylistView;
