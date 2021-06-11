import Placeholder from "../Images/placeholder.svg"
import { currentPlaybackObjectAtom, isPlayingAtom, queueAtom } from "../Global/atoms"
import { useRecoilState, useRecoilValue } from "recoil"
import { Track } from "../Models/Spotify"
import { useNotificationModel, NotificationObject } from "./NotificationModel"
import { useTrackModel } from "./TrackModel"

import CollectionSuccess from "../Images/collection-success.svg"
import CollectionError from "../Images/collection-error.svg"
import { useState } from "react"

export function usePlaybackModel() {
	const [queue, setQueue] = useRecoilState(queueAtom)
	const [autoPlay, setAutoPlay] = useState(true)

    const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
	const setIsPlaying = useRecoilState(isPlayingAtom)[1]

	const notificationModel = useNotificationModel()
    const trackModel = useTrackModel()

	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)
    const player = document.getElementById("custom-player")
    
	//MARK: Event listeners

	function handlePlaying() {
		if (currentPlaybackObject.track) {
			if (autoPlay) {
				setIsPlaying(true)

				console.log("updating total time")

				const readableTime = convertSecondsToReadableTime(
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
				setAutoPlay(true)
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

		const nextSongIndex = queue.indexOf(currentPlaybackObject) + 1

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
		const readableTime = convertSecondsToReadableTime(
			Math.floor(timeProgressed)
		)

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
				const previousSongIndex = queue.indexOf(currentPlaybackObject) - 1

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
			const nextSongIndex = queue.indexOf(currentPlaybackObject) + 1
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
		setAutoPlay(false)
		setCurrentPlaybackObject(queue[0])
		player.currentTime = 0
	}

    function addToQueue(track) {
		notificationModel.add(
			new NotificationObject(`Adding "${track.title}" to queue...`, "", "")
		)

		trackModel
			.getPlaybackObjectFromTrack(track)
			.then((playbackObject) => {
				const currentIndex = queue.indexOf(currentPlaybackObject)

				const newQueue = [...queue]
				newQueue.splice(currentIndex + 1, 0, playbackObject)

				setQueue(newQueue)

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

	//MARK: Misc
	function prepareForNewSong() {

        document.tilte = "Octave"

        setQueue([])

        player.pause()

        setCurrentPlaybackObject(
			new PlaybackObject(
				new Track("Loading...", "", "", "", "", 0, "", "", Placeholder)
			)
		)
    }

	function getTotalTime() {
		
		if (currentPlaybackObject.track) {
			const readableTime = convertSecondsToReadableTime(
				currentPlaybackObject.track.duration
			)

			return readableTime
		} else {
			return "0:00"
		}
		
	}

	//MARK: Helper functions

	function convertSecondsToReadableTime(totalSeconds) {
		let minutes = totalSeconds / 60
		minutes = Math.floor(minutes)

		let seconds = totalSeconds - minutes * 60

		if (seconds < 10) {
			return minutes + ":0" + seconds
		} else {
			return minutes + ":" + seconds
		}
	}

	function updateElementWithClass(className, updaterFunction) {

		const elements = document.getElementsByClassName(className)

		for(let i = 0; i < elements.length; i++) {
			updaterFunction(elements[i])
		}

	}

    return {prepareForNewSong, addToQueue, handlePlaying, skip, skipBack, playPause, handleUpdate, handleEnded, handlePause, getTotalTime}

}

export class PlaybackObject {

    constructor(track, url, expireTime, position) {
        this.track = track
        this.url = url
        this.expireTime = expireTime
        this.position = position
    }

    isExpired() {
        return Date.now() >= this.expireTime
    }

    //add a function that caluculates wheter or not the song will expire by the end of playback

}