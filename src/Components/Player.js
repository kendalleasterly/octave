import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
	currentPlaybackObjectAtom,
	queueAtom,
	timelineIsActiveAtom,
} from "../Global/atoms"

import PlayIcon from "../Images/play.svg"
import PauseIcon from "../Images/pause.svg"
import SkipIcon from "../Images/skip-forward.svg"
import BackIcon from "../Images/skip-backward.svg"
import { ReactComponent as TimelineIcon } from "../Images/timeline.svg"
import Placeholder from "../Images/placeholder.svg"

function Player(props) {
	const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(
		currentPlaybackObjectAtom
	)
	const customPlayer = document.getElementById("custom-player")
	const queue = useRecoilValue(queueAtom)
	const [timelineIsActive, setTimelineIsActive] =
		useRecoilState(timelineIsActiveAtom)
	const [autoPlay, setAutoPlay] = useState(true)

	const [playPauseIcon, setPlayPauseIcon] = useState(PlayIcon)

	function playPause() {
		if (customPlayer.paused) {
			customPlayer.play()
		} else {
			customPlayer.pause()
		}
	}

	function skip() {
		const nextSongIndex = queue.indexOf(currentPlaybackObject) + 1
		const nextPlaybackObject = queue[nextSongIndex]

		if (nextPlaybackObject) {
			setCurrentPlaybackObject(nextPlaybackObject)
		} else {
			setCurrentPlaybackObject(queue[0])
			setAutoPlay(false)
			console.log("said pause")
		}
	}

	function skipBack() {
		if (customPlayer.currentTime > 3) {
			customPlayer.currentTime = 0
		} else {
			const previousSongIndex = queue.indexOf(currentPlaybackObject) - 1

			const previousPlaybackObject = queue[previousSongIndex]

			if (previousPlaybackObject) {
				setCurrentPlaybackObject(previousPlaybackObject)
			} else {
                customPlayer.currentTime = 0
            }
		}
	}

	function handlePlay() {
		if (autoPlay) {
			setPlayPauseIcon(PauseIcon)
		} else {
			customPlayer.pause()
			setAutoPlay(true)
		}
	}

	function handlePause() {
		setPlayPauseIcon(PlayIcon)
	}

	function getSongTitle() {
		if (currentPlaybackObject.track) {
			return currentPlaybackObject.track.title
		} else {
			return ""
		}
	}

	function getSongThumbnail() {
		if (currentPlaybackObject.track) {
			return currentPlaybackObject.track.thumbnail
		} else {
			return Placeholder
		}
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
			document.title =
				nextPlaybackObject.track.title + " - " + nextPlaybackObject.track.artist
		} else {
			document.title = "Octave"
		}
	}

	return (
		<div className="player px-4 py-2 bg-secondaryBackground w-full space-x-4">
			<img src={getSongThumbnail()} className="md:w-14 md:h-14 thumbnail rounded " alt="" />
			<div className = "space-y-1 my-auto">
				<p className="text-white">{getSongTitle()}</p>
				<p className = "text-sm text-gray-400">{currentPlaybackObject.track.artist}</p>
			</div>
			
			{/* when you get a chance make sure that when you get to the next song in the queue it's not expired. if is figure out what to do (don't keep them waiting) */}

			<button onClick={skipBack} className="hidden md:block">
				<img src={BackIcon} alt="" className="float-right" />
			</button>

			<button onClick={playPause}>
				<img src={playPauseIcon} alt="" />
			</button>

			<button onClick={skip}>
				<img src={SkipIcon} alt="" />
			</button>

			<button onClick={() => setTimelineIsActive(!timelineIsActive)} className = "hidden md:block">
				<TimelineIcon fill={timelineIsActive ? "#EB634D" : "#FFFFFF"} />
			</button>

			<audio
				autoPlay
				src={currentPlaybackObject.url}
				id="custom-player"
				onPlay={handlePlay}
				onPause={handlePause}
				onEnded={handleEnded}
			></audio>
		</div>
	)
}

export default Player
