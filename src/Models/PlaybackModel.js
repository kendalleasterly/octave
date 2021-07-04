import Placeholder from "../Images/placeholder.svg"
import {
	currentPlaybackObjectAtom,
	isPlayingAtom,
	queueAtom,
	shouldPlayAtom,
	shufflingAtom,
} from "../Global/atoms"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Track } from "./SpotifyModel"
import { useNotificationModel, NotificationObject } from "./NotificationModel"
import { useTrackModel } from "./TrackModel"

import CollectionSuccess from "../Images/collection-success.svg"
import CollectionError from "../Images/collection-error.svg"
import { useState } from "react"

export function usePlaybackModel() {
	const [queue, setQueue] = useRecoilState(queueAtom)
	const [shouldPlay, setShouldPlay] = useRecoilState(shouldPlayAtom)
	const [shuffling, setShuffling] = useRecoilState(shufflingAtom)

	const setCurrentPlaybackObject = useSetRecoilState(currentPlaybackObjectAtom)
	const setIsPlaying = useSetRecoilState(isPlayingAtom)

	const notificationModel = useNotificationModel()
	const trackModel = useTrackModel()

	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)
	const player = document.getElementById("custom-player")

	//MARK: Event listeners

	async function handlePlaying() {
		if (currentPlaybackObject.track) {
			if (currentPlaybackObject.isExpired) {
				//get a new one
				//play it
				playSong(currentPlaybackObject.track)
			} else {
				if (shouldPlay) {
					setIsPlaying(true)

					const readableTime = trackModel.convertSecondsToReadableTime(
						currentPlaybackObject.track.duration
					)

					updateElementWithClass("time-total", (element) => {
						element.innerHTML = readableTime
					})

					document.title =
						currentPlaybackObject.track.title +
						" - " +
						currentPlaybackObject.track.artist
					//get the current time and update it
				} else {
					player.pause()
					setShouldPlay(true)
				}
			}
		}
	}

	function handlePause() {
		setIsPlaying(false)
	}

	function handleEnded() {
		//TODO: make sure the song hasn't epired
		console.log("song did end")
		console.log({ queue })

		const nextSongIndex = getNatrualCurrentPosition() + 1

		const nextPlaybackObject = queue[nextSongIndex]
		console.log({ nextPlaybackObject })
		if (nextPlaybackObject) {
			setCurrentPlaybackObject(nextPlaybackObject)
			// document.title =
			// 	nextPlaybackObject.track.title + " - " + nextPlaybackObject.track.artist
		} else {
			goToFirstSong()
		}
	}

	function handleUpdate() {
		const timeProgressed = player.currentTime
		const readableTime = trackModel.convertSecondsToReadableTime(
			Math.floor(timeProgressed)
		);

		updateElementWithClass("time-progressed", (element) => {
			element.innerHTML = readableTime
		})
	}

	//MARK: Playback Functions

	function playPause() {
		if (player.paused) {
			player.play()
		} else {
			player.pause()
		}
	}

	function skipBack() {
		if (currentPlaybackObject.track) {
			if (player.currentTime > 3) {
				player.currentTime = 0
			} else {
				const previousSongIndex = getNatrualCurrentPosition() - 1

				const previousPlaybackObject = queue[previousSongIndex]

				if (previousPlaybackObject) {
					setCurrentPlaybackObject(previousPlaybackObject)
				} else {
					player.currentTime = 0
				}
			}
		}
	}

	function skip() {
		if (currentPlaybackObject.track) {
			const nextSongIndex = getNatrualCurrentPosition() + 1

			const nextPlaybackObject = queue[nextSongIndex]

			if (nextPlaybackObject) {
				setCurrentPlaybackObject(nextPlaybackObject)
			} else {
				goToFirstSong()
			}
		}
	}

	function goToFirstSong() {
		document.title = "Octave"
		setShouldPlay(false)
		console.log("go to first song ran and should play set to false")
		setCurrentPlaybackObject(queue[0])
		player.currentTime = 0
	}

	function addToQueue(track) {
		notificationModel.add(
			new NotificationObject(`Adding "${track.title}" to queue...`, "", "")
		)

		trackModel
			.getPlaybackObjectFromTrack(track) //has no position
			.then((playbackObject) => {
				let newQueue = [...queue]
				newQueue.splice(getNatrualCurrentPosition() + 1, 0, playbackObject)

				setQueue(newQueue)
				console.log({ newQueue })

				notificationModel.add(
					new NotificationObject(
						`"${track.title}" added to queue`,
						"This song will play next",
						CollectionSuccess,
						true
					)
				)
			})
			.catch((err) => {
				console.log("error adding to queue:" + err)
				notificationModel.add(
					new NotificationObject(
						`Couldn't add "${track.title}" added to queue`,
						err,
						CollectionError
					)
				)
			})
	}

	function toggleShuffling() {
		console.log({ queue })

		if (shuffling) {
			console.log("not shuffling")

			//sort the array using the positions of all the songs

			let sortedArray = [...queue]

			let upNext = []

			let i
			for (i = 0; i < queue.length; i++) {
				const playbackObject = queue[i]

				if (playbackObject.position === undefined) {
					upNext.push(playbackObject)

					sortedArray.splice(i, 1)
					console.log("removed", playbackObject.track.title)
				}
			}

			sortedArray.sort((first, second) => {
				return first.position - second.position
			})

			let currentPosition
			for (currentPosition = 0; currentPosition < sortedArray.length; currentPosition++) {
				const playbackObject = sortedArray[currentPosition]

				console.log({playbackObject})

				if (playbackObject.url === currentPlaybackObject.url) {
					break
				}
			}

			sortedArray.splice(currentPosition + 1, 0, ...upNext)

			sortedArray = setPositions(sortedArray)

			console.log({sortedArray})

			setQueue(sortedArray)
			setShuffling(false)
		} else {
			console.log("shuffling")

			//shuffle all songs after the current one in the queue
			let songsToBeShuffled = [...queue]
			songsToBeShuffled.reverse()

			let currentPlaybackObjectReversedPosition

			let i
			for (i = 0; i < songsToBeShuffled.length; i++) {
				const playbackObject = songsToBeShuffled[i]

				if (playbackObject.url === currentPlaybackObject.url) {
					currentPlaybackObjectReversedPosition = i
				}
			}

			songsToBeShuffled.splice(
				currentPlaybackObjectReversedPosition,
				queue.length
			)

			const shuffledSongs = shuffleObjects(songsToBeShuffled)

			//trim to all previous songs and current one
			let queueHistoryAndCurrent = [...queue]

			queueHistoryAndCurrent.splice(
				getNatrualCurrentPosition() + 1,
				queue.length
			)

			const newQueue = [...queueHistoryAndCurrent, ...shuffledSongs]

			console.log({ newQueue })

			setQueue(newQueue)
			setShuffling(true)
		}
	}

	//MARK: Misc

	function getNatrualCurrentPosition() {
		let i
		for (i = 0; i < queue.length; i++) {
			const playbackObject = queue[i]

			if (playbackObject.url === currentPlaybackObject.url) {
				return i
			}
		}
	}

	function prepareForNewSong() {
		console.log("prepare for new song and was set to true")
		document.tilte = "Octave"

		setQueue([])

		player.pause()

		setShouldPlay(true)

		setCurrentPlaybackObject(
			new PlaybackObject(
				new Track("Loading...", "", "", "", "", 0, "", "", Placeholder),
				""
			)
		)
	}

	function getTotalTime() {
		if (currentPlaybackObject.track) {
			const readableTime = trackModel.convertSecondsToReadableTime(
				currentPlaybackObject.track.duration
			);

			return readableTime
		} else {
			return "0:00"
		}
	}

	//MARK: Helper functions

	function updateElementWithClass(className, updaterFunction) {
		const elements = document.getElementsByClassName(className)

		for (let i = 0; i < elements.length; i++) {
			updaterFunction(elements[i])
		}
	}

	function playSong(track) {
		setShuffling(false)

		if (currentPlaybackObject.track) {
			if (currentPlaybackObject.track.id !== track.id) {
				prepareForNewSong()
			}
		} else {
			prepareForNewSong()
		}

		trackModel
			.getPlaybackObjectFromTrack(track, 0)
			.then((playbackObject) => {
				if (currentPlaybackObject.track) {
					if (currentPlaybackObject.track.id === playbackObject.track.id) {
						setShouldPlay(false)
						player.currentTime = 0
					}
				}

				setCurrentPlaybackObject(playbackObject)

				setQueue([playbackObject])
			})
			.catch((err) => {
				console.log("error playing song:", err)
			})
	}

	function shuffleObjects(objectsParameter) {
		let objects = [...objectsParameter]

		let lastIndex = objects.length - 1

		while (lastIndex > 0) {
			const randomIndex = Math.floor(Math.random() * lastIndex)

			const temp = objects[lastIndex]
			objects[lastIndex] = objects[randomIndex]
			objects[randomIndex] = temp

			lastIndex--
		}

		return objects
	}

	function setPositions(playbackObjects) {
		let index = 0
		let newPlaybackObjects = []

		playbackObjects.forEach((playbackObject) => {
			let newPlaybackObject = new PlaybackObject(
				playbackObject.track,
				playbackObject.url,
				playbackObject.expireTime,
				index
			)

			newPlaybackObjects.push(newPlaybackObject)

			index++
		})

		return newPlaybackObjects
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
		getNatrualCurrentPosition,
		setPositions
	}
}

export class PlaybackObject {
	constructor(track, url, expireTime, position) {
		this.track = track
		this.url = url
		this.expireTime = expireTime
		this.position = position
		this.isExpired = Date.now() >= this.expireTime
	}

	//add a function that caluculates wheter or not the song will expire by the end of playback
}
