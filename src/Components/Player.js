import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
	currentPlaybackObjectAtom,
	isPlayingAtom,
	timelineIsActiveAtom,
} from "../Global/atoms"

import { ReactComponent as TimelineIcon } from "../Images/timeline.svg"
import { ReactComponent as DevicesIcon } from "../Images/devices.svg"
import Placeholder from "../Images/placeholder.svg"
import FullScreenPlayer from "../Views/FullScreenPlayer"
import ProgressBar from "../Components/ProgressBar"
import { usePlaybackModel } from "../Models/PlaybackModel"
import { ReactComponent as SkipIcon } from "../Images/skip.svg"
import { ReactComponent as PlayingIconSmall } from "../Images/playing-small.svg"
import { ReactComponent as PausedIconSmall } from "../Images/paused-small.svg"
import PlaybackControls from "./PlaybackControls"
import Expand from "../Images/expand.svg"
import { Link } from "react-router-dom"

function Player() {
	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)
	const isPlaying = useRecoilValue(isPlayingAtom)

	const {
		handlePlaying,
		handlePause,
		handleEnded,
		handleUpdate,
		playPause,
		skip,
	} = usePlaybackModel()

	const [timelineIsActive, setTimelineIsActive] =
		useRecoilState(timelineIsActiveAtom)

	const [isFullScreen, setIsFullScreen] = useState(false)

	return (
		<div>
			<audio
				autoPlay
				src={currentPlaybackObject.url}
				id="custom-player"
				onPlaying={handlePlaying}
				onPause={handlePause}
				onEnded={handleEnded}
				onTimeUpdate={handleUpdate}></audio>

			{!isFullScreen ? (
				<div>
					<div className="player justify-between w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 border-gray-200 px-12 py-4">
						<div className="z-10 self-center">
							<div
								className="md:hidden"
								onClick={() => setIsFullScreen(!isFullScreen)}>
								<SongInfo />
							</div>

							<div className="medium-only">
								<SongInfo />
							</div>
						</div>

						<div
							id="controls-tertiary"
							className="place-self-center md:w-full z-10">
							<div className="space-x-4 md:hidden">
								<button onClick={playPause}>
									{isPlaying ? <PlayingIconSmall /> : <PausedIconSmall />}
								</button>

								<button onClick={skip}>
									<SkipIcon />
								</button>
							</div>

							<div className="medium-only md:mb-2">
								<PlaybackControls />
							</div>

							<div className="medium-only md:px-2">
								<ProgressBar />
							</div>
						</div>

						<div className="space-x-8 place-self-end hidden md:flex self-center z-10">
							<button onClick={() => setTimelineIsActive(!timelineIsActive)}>
								<TimelineIcon fill={timelineIsActive ? "#EB634D" : "#FFFFFF"} />
							</button>

							<button>
								<DevicesIcon />
							</button>

							<button onClick={() => setIsFullScreen(true)}>
								<img src={Expand} alt="" />
							</button>
						</div>

						<div
							className="bg-secondarybg w-full h-full absolute left-0 right-0 bottom-0 z-0 md:hidden"
							onClick={() => setIsFullScreen(!isFullScreen)}></div>
					</div>
				</div>
			) : (
				<FullScreenPlayer toggle={() => setIsFullScreen(false)} />
			)}
		</div>
	);

	function SongInfo() {
		return (
			<div id="song-info" className="flex space-x-4 my-auto">
				<Link to={`${currentPlaybackObject.track ? "/album/" + currentPlaybackObject.track.albumID : "#"}`} className="thumbnail">
					<img
						src={
							currentPlaybackObject.track
								? currentPlaybackObject.track.thumbnail
								: Placeholder
						}
						className="thumbnail rounded"
						alt=""
					/>
				</Link>

				<div className="space-y-1 my-auto">
					<p className="text-lg md:text-base text one-line">
						{currentPlaybackObject.track
							? currentPlaybackObject.track.title
							: ""}
					</p>
					<p className="medium-only md:text-sm text-gray-400 one-line" id="player-artist">
						{currentPlaybackObject.track
							? currentPlaybackObject.track.artist
							: ""}
					</p>
				</div>
			</div>
		)
	}
}

export default Player
