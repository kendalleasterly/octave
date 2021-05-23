import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
	currentPlaybackObjectAtom,
	queueAtom,
	timelineIsActiveAtom,
} from "../Global/atoms"

import PlayingIcon from "../Images/playing.svg"
import PausedIcon from "../Images/paused.svg"
import PlayingIconSmall from "../Images/playing-small.svg"
import PausedIconSmall from "../Images/paused-small.svg"
import SkipIcon from "../Images/skip-forward.svg"
import BackIcon from "../Images/skip-backward.svg"
import { ReactComponent as RepeatIcon } from "../Images/repeat.svg"
import { ReactComponent as ShuffleIcon } from "../Images/shuffle.svg"
import { ReactComponent as TimelineIcon } from "../Images/timeline.svg"
import { ReactComponent as DevicesIcon } from "../Images/devices.svg"
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

	const [playPauseIcon, setPlayPauseIcon] = useState(PausedIcon)
	const [playPauseIconSmall, setPlayPauseIconSmall] = useState(PausedIconSmall)

	function playPause() {
		if (customPlayer.paused) {
			customPlayer.play()
		} else {
			customPlayer.pause()
		}
	}

	function goToFirstSong() {
		document.title = "Octave"
		setAutoPlay(false)
		setCurrentPlaybackObject(queue[0])
		customPlayer.currentTime = 0
		
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

	function skipBack() {
		if (currentPlaybackObject.track) {
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
	}

	function handlePlaying() {
		if (currentPlaybackObject.track) {
			if (autoPlay) {
				setPlayPauseIcon(PlayingIcon)
				setPlayPauseIconSmall(PlayingIconSmall)

				const timeTotal = document.getElementById("time-total")
				const readableTime = convertSecondsToReadableTime(
					currentPlaybackObject.track.duration
				)
				timeTotal.innerHTML = readableTime

				document.title = currentPlaybackObject.track.title + " - " + currentPlaybackObject.track.artist
				//get the current time and update it
			} else {
				customPlayer.pause()
				setAutoPlay(true)
			}
		}
	}

	function handlePause() {
		setPlayPauseIcon(PausedIcon)
		setPlayPauseIconSmall(PausedIconSmall)
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

	function handleUpdate() {
		const timeProgressed = customPlayer.currentTime
		const readableTime = convertSecondsToReadableTime(
			Math.floor(timeProgressed)
		)

		document.getElementById("time-progressed").innerHTML = readableTime
	}

	return (
		<div className="player px-4 py-2 md:px-6 md:py-4 bg-secondarybg w-screen justify-between">
			<div id="song-info" className="flex space-x-4">
				<img
					src={currentPlaybackObject.track ? currentPlaybackObject.track.thumbnail : Placeholder}
					className="md:w-14 md:h-14 thumbnail rounded "
					alt=""
				/>
				<div className="space-y-1 my-auto">
					<p className="text-lg md:text-base text-white">{currentPlaybackObject.track ? currentPlaybackObject.track.title : ""}</p>
					<p className="hidden md:block md:text-sm text-gray-400">
						{currentPlaybackObject.track
							? currentPlaybackObject.track.artist
							: ""}
					</p>
				</div>
			</div>

			{/* when you get a chance make sure that when you get to the next song in the queue it's not expired. if is figure out what to do (don't keep them waiting) */}

			<div
				id="controls-tertiary"
				className="place-self-center space-y-2 md:w-full"
			>
				<div
					id="controls-secondary"
					className="flex md:space-x-12 py-1 justify-center"
				>
					<button className="medium-only">
						<RepeatIcon />
					</button>

					<div id="controls-primary" className="flex md:space-x-8">
						<button onClick={skipBack} className="medium-only">
							<img src={BackIcon} alt="" className="" />
						</button>

						<button onClick={playPause} className="">
							<img src={playPauseIcon} alt="" className="hidden md:block"/>
							<img src={playPauseIconSmall} alt = "" className=" md:hidden" />
						</button>

						<button onClick={skip} className="ml-4">
							<img src={SkipIcon} alt=""  />
						</button>
					</div>

					<button className="medium-only">
						<ShuffleIcon />
					</button>
				</div>

				<div className="hidden space-x-2 text-gray-400 text-sm md:flex px-2">
					<p id="time-progressed" className="w-9">
						0:00
					</p>
					<hr className="border-gray-700 border-2 rounded-full w-full self-center" />
					<p id="time-total" className="w-9">
						0:00
					</p>
				</div>
			</div>

			<div className="space-x-8 place-self-end hidden md:flex self-center">
				<button onClick={() => setTimelineIsActive(!timelineIsActive)}>
					<TimelineIcon fill={timelineIsActive ? "#EB634D" : "#FFFFFF"} />
				</button>

				<button >
					<DevicesIcon />
				</button>
			</div>

			<audio
				autoPlay
				src={currentPlaybackObject.url}
				id="custom-player"
				onPlaying={handlePlaying}
				onPause={handlePause}
				onEnded={handleEnded}
				onTimeUpdate={handleUpdate}
			></audio>
		</div>
	)
}

export default Player
