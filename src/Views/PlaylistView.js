import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { SpotifyModel, Album } from "../Models/SpotifyModel"
import { headerTextAtom, isDarkAtom } from "../Global/atoms"
import ButtonComponent from "../Components/ButtonComponent"
import Song from "../Components/Song"
import { usePlaybackModel } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import { usePlaylistModel, Playlist } from "../Models/PlaylistModel"
import PlaceholderLargeDark from "../Images/placeholder-large-dark.svg"
import PlaceholderLargeLight from "../Images/placeholder-large-light.svg"

function PlaylistView() {
	const setHeaderText = useSetRecoilState(headerTextAtom)
	const { prepareForNewSong, shuffleObjects } = usePlaybackModel()
	const spotifyModel = new SpotifyModel()
	const playlistModel = usePlaylistModel()
	const trackModel = useTrackModel()
	const { playlistID } = useParams()
	const isDark = useRecoilValue(isDarkAtom)

	const [playlist, setPlaylist] = useState(new Playlist())

	useEffect(() => {
		setHeaderText("")

		async function fetchAndSetPlaylist() {
			//get the playlist
			const fetchedPlaylist = await playlistModel.getPlaylist(playlistID)
			setPlaylist(fetchedPlaylist)
		}

		if (!playlist.title || playlist.id !== playlistID) {
			fetchAndSetPlaylist()
		}
	}, [playlistID])

	function getRelativeDate(date) {
		const now = new Date()
		const startOfToday = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		).getTime()
		const startOfDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		).getTime()

		const distance = startOfToday - startOfDate
		const distanceInDays = distance / (1000 * 60 * 60 * 24)

		if (distanceInDays <= 0) {
			return "Today"
		} else if (distanceInDays === 1) {
			return "Yesterday"
		} else if (distanceInDays <= 7) {
			const weekdays = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			]

			return weekdays[date.getDay()]
		} else {
			return `${date.getMonth() + 1}/${date.getDate()}/${
				date.getFullYear() - 2000
			}`
		}
	}

	async function shuffleAlbum() {
		prepareForNewSong()

		const shuffledTracks = shuffleObjects(playlist.songs)
		console.log({ shuffledTracks })

		trackModel.playCollection(shuffledTracks)
	}

	if (playlist.title && playlist.id === playlistID) {
		return (
			<div id="playlist-view" className="space-y-10">
				<div className="md:flex md:space-x-6 space-y-6 md:space-y-0 md:items-center">
					<div
						alt=""
						className="w-full max-w-sm md:w-60 md:h-60 mx-auto md:mx-0 md:max-w-none"
					>
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
									prepareForNewSong()

									spotifyModel.getAlbumTracks(playlist.id).then((tracks) => {
										trackModel.playCollection(tracks)
									})
								}}
							/>
							<p></p>
							<ButtonComponent text="Shuffle" action={shuffleAlbum} />
						</div>
					</div>
				</div>

				<div className="space-y-8">
					{playlist.songs.map((track, key) => {
						return <Song track={track} key={key} index={key} />
					})}
					<p className="text-gray-400 font-semibold text-center text-sm md:text-left">
						Created {getRelativeDate(playlist.createTime)}
					</p>
				</div>
			</div>
		)
	} else {
		return null
	}

	function PlaylistArtwork() {
		function getRoundingFromKey(key) {
			switch (key) {
				case 0:
					return "rounded-tl-xl"
				case 1:
					return "rounded-tr-xl"
				case 2:
					return "rounded-bl-xl"
				case 3:
					return "rounded-br-xl"
				default:
					return ""
			}
		}

		const firstFourSongs = [...playlist.songs]
		firstFourSongs.splice(4, playlist.songs.length)

		if (playlist.songs.length > 0) {
			if (playlist.songs.length >= 4) {
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
							)
						})}
					</div>
				)
			} else {
				return (
					<img src={playlist.songs[0].artwork} alt="" className="rounded-xl" />
				)
			}
		} else {
			if (isDark) {
				return <img src={PlaceholderLargeDark} alt="" className="rounded-xl" />
			} else {
				return <img src={PlaceholderLargeLight} alt="" className="rounded-xl" />
			}
		}
	}
}

export default PlaylistView
