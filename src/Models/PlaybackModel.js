import Placeholder from "../Images/placeholder.svg";
import {
	currentPlaybackObjectAtom,
	isPlayingAtom,
	queueAtom,
	shouldPlayAtom,
	shufflingAtom,
} from "../Global/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { Track } from "./SpotifyModel";
import { useNotificationModel, NotificationObject } from "./NotificationModel";
import { useTrackModel } from "./TrackModel";

import CollectionSuccess from "../Images/collection-success.svg";
import CollectionError from "../Images/collection-error.svg";
import { useState } from "react";

export function usePlaybackModel() {
	const [queue, setQueue] = useRecoilState(queueAtom);
	const [shouldPlay, setShouldPlay] = useRecoilState(shouldPlayAtom);
	const [shuffling, setShuffling] = useRecoilState(shufflingAtom);

	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1];
	const setIsPlaying = useRecoilState(isPlayingAtom)[1];

	const notificationModel = useNotificationModel();
	const trackModel = useTrackModel();

	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom);
	const player = document.getElementById("custom-player");

	//MARK: Event listeners

	async function handlePlaying() {
		if (currentPlaybackObject.track) {
			if (currentPlaybackObject.isExpired) {
				//get a new one
				//play it
				playSong(currentPlaybackObject.track);
			} else {
				if (shouldPlay) {
					setIsPlaying(true);

					const readableTime = convertSecondsToReadableTime(
						currentPlaybackObject.track.duration
					);

					updateElementWithClass("time-total", (element) => {
						element.innerHTML = readableTime;
					});

					document.title =
						currentPlaybackObject.track.title +
						" - " +
						currentPlaybackObject.track.artist;
					//get the current time and update it
				} else {
					player.pause();
					setShouldPlay(true);
				}
			}
		}
	}

	function handlePause() {
		setIsPlaying(false);
	}

	function handleEnded() {
		//TODO: make sure the song hasn't epired
		console.log("song did end");
		console.log({ queue });

		const nextSongIndex = currentPlaybackObject.position + 1;

		const nextPlaybackObject = queue[nextSongIndex];
		console.log({ nextPlaybackObject });
		if (nextPlaybackObject) {
			setCurrentPlaybackObject(nextPlaybackObject);
			// document.title =
			// 	nextPlaybackObject.track.title + " - " + nextPlaybackObject.track.artist
		} else {
			goToFirstSong();
		}
	}

	function handleUpdate() {
		const timeProgressed = player.currentTime;
		const readableTime = convertSecondsToReadableTime(
			Math.floor(timeProgressed)
		);

		updateElementWithClass("time-progressed", (element) => {
			element.innerHTML = readableTime;
		});
	}

	//MARK: Playback Functions

	function playPause() {
		if (player.paused) {
			player.play();
		} else {
			player.pause();
		}
	}

	function skipBack() {
		if (currentPlaybackObject.track) {
			if (player.currentTime > 3) {
				player.currentTime = 0;
			} else {
				const previousSongIndex = currentPlaybackObject.position - 1;

				const previousPlaybackObject = queue[previousSongIndex];

				if (previousPlaybackObject) {
					setCurrentPlaybackObject(previousPlaybackObject);
				} else {
					player.currentTime = 0;
				}
			}
		}
	}

	function skip() {
		if (currentPlaybackObject.track) {
			const nextSongIndex = currentPlaybackObject.position + 1;
			console.log({ currentPlaybackObject });
			const nextPlaybackObject = queue[nextSongIndex];
			console.log({ nextPlaybackObject });

			if (nextPlaybackObject) {
				setCurrentPlaybackObject(nextPlaybackObject);
			} else {
				goToFirstSong();
			}
		}
	}

	function goToFirstSong() {
		document.title = "Octave";
		setShouldPlay(false);
		console.log("go to first song ran and should play set to false");
		setCurrentPlaybackObject(queue[0]);
		player.currentTime = 0;
	}

	function addToQueue(track) {
		notificationModel.add(
			new NotificationObject(`Adding "${track.title}" to queue...`, "", "")
		);

		trackModel
			.getPlaybackObjectFromTrack(track)
			.then((playbackObject) => {
				let currentPosition = queue.length;

				queue.forEach((object) => {
					if (object.url === currentPlaybackObject.url) {
						currentPosition = object.position;
					}
				});

				console.log({ currentPosition });

				let newQueue = [...queue];
				newQueue.splice(currentPosition + 1, 0, playbackObject);

				setQueue(newQueue);
				console.log({newQueue});
				// updateQueuePositions();

				notificationModel.add(
					new NotificationObject(
						`"${track.title}" added to queue`,
						"This song will play next",
						CollectionSuccess,
						true
					)
				);
			})
			.catch((err) => {
				console.log("error adding to queue:" + err);
				notificationModel.add(
					new NotificationObject(
						`Couldn't add "${track.title}" added to queue`,
						err,
						CollectionError
					)
				);
			});
	}

	//MARK: Misc
	function prepareForNewSong() {
		console.log("prepare for new song and was set to true");
		document.tilte = "Octave";

		setQueue([]);

		player.pause();

		setShouldPlay(true);

		setCurrentPlaybackObject(
			new PlaybackObject(
				new Track("Loading...", "", "", "", "", 0, "", "", Placeholder),
				""
			)
		);
	}

	function getTotalTime() {
		if (currentPlaybackObject.track) {
			const readableTime = convertSecondsToReadableTime(
				currentPlaybackObject.track.duration
			);

			return readableTime;
		} else {
			return "0:00";
		}
	}

	//MARK: Helper functions

	function convertSecondsToReadableTime(totalSeconds) {
		if (typeof totalSeconds === "number") {
			let minutes = totalSeconds / 60;
			minutes = Math.floor(minutes);

			let seconds = totalSeconds - minutes * 60;

			if (seconds < 10) {
				return minutes + ":0" + seconds;
			} else {
				return minutes + ":" + seconds;
			}
		} else {
			return "0:00";
		}
	}

	function updateElementWithClass(className, updaterFunction) {
		const elements = document.getElementsByClassName(className);

		for (let i = 0; i < elements.length; i++) {
			updaterFunction(elements[i]);
		}
	}

	function playSong(track) {

		setShuffling(false)

		if (currentPlaybackObject.track) {
			if (currentPlaybackObject.track.id !== track.id) {
				prepareForNewSong();
				return;
			}
		} else {
			prepareForNewSong();
		}

		trackModel
			.getPlaybackObjectFromTrack(track, 0)
			.then((playbackObject) => {
				if (currentPlaybackObject.track) {
					if (currentPlaybackObject.track.id === playbackObject.track.id) {
						setShouldPlay(false);
						player.currentTime = 0;
					}
				}

				setCurrentPlaybackObject(playbackObject);

				setQueue([playbackObject]);
			})
			.catch((err) => {
				console.log("error playing song:", err);
			});
	}

	function shuffleObjects(objectsParameter) {
		let objects = [...objectsParameter];

		let lastIndex = objects.length - 1;

		while (lastIndex > 0) {
			const randomIndex = Math.floor(Math.random() * lastIndex);

			const temp = objects[lastIndex];
			objects[lastIndex] = objects[randomIndex];
			objects[randomIndex] = temp;

			lastIndex--;
		}

		return objects;
	}

	function setPositions(playbackObjects) {
		let index = 0;
		let newPlaybackObjects = [];

		console.log("og:", playbackObjects);

		playbackObjects.forEach((playbackObject) => {
			let newPlaybackObject = new PlaybackObject(
				playbackObject.track,
				playbackObject.url,
				playbackObject.expireTime,
				index
			);

			newPlaybackObjects.push(newPlaybackObject);

			index++;
		});

		return newPlaybackObjects;
	}

	function toggleShuffling() {
		console.log({queue})
		
		if (shuffling) {
			console.log("not shuffling");

			//set the value to false
			setShuffling(false)

			//sort the array using the positions of all the songs
			const sortedArray = [...queue]
			sortedArray.sort((first, second) => {
				return first.position - second.position;
			});

			//set that as the new queue
			console.log({sortedArray});
			setQueue(sortedArray)

		} else {
			//set the value to true
			setShuffling(true)
			console.log("shuffling")

			//shuffle all songs after the current one in the queue
			let songsToBeShuffled = [...queue]
			songsToBeShuffled.reverse()

			let currentPlaybackObjectReversedPosition

			let i
			for (i = 0;i < songsToBeShuffled.length;i++) {
				const playbackObject = songsToBeShuffled[i]

				if (playbackObject.url === currentPlaybackObject.url){
					currentPlaybackObjectReversedPosition = i
				}
			}

			songsToBeShuffled.splice(
				currentPlaybackObjectReversedPosition,
				queue.length
			);
			console.log({songsToBeShuffled});

			const shuffledSongs = shuffleObjects(songsToBeShuffled)
			console.log({shuffledSongs});


			//trim to all previous songs and current one
			let queueHistoryAndCurrent = [...queue]

			queueHistoryAndCurrent.splice(currentPlaybackObject.position + 1, queue.length)

			const newQueue = [...queueHistoryAndCurrent, ...shuffledSongs]

			console.log({newQueue})

			setQueue(newQueue);
		}
	}

	return {
		prepareForNewSong,
		addToQueue,
		handlePlaying,
		skip,
		skipBack,
		playPause,
		handleUpdate,
		handleEnded,
		handlePause,
		getTotalTime,
		playSong,
		shuffleObjects,
		toggleShuffling,
	};
}

export class PlaybackObject {
	constructor(track, url, expireTime, position) {
		this.track = track;
		this.url = url;
		this.expireTime = expireTime;
		this.position = position;
		this.isExpired = Date.now() >= this.expireTime;
	}

	//add a function that caluculates wheter or not the song will expire by the end of playback
}
