import React, { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentPlaybackObjectAtom } from "../Global/atoms"

import ProgressBar from "../Components/ProgressBar"

import { ReactComponent as CloseIcon } from "../Images/close.svg"
import LargePlaceholder from "../Images/placeholder-large.svg"
import PlaybackControls from "../Components/PlaybackControls"
import { ReactComponent as DevicesIcon } from "../Images/devices.svg"
import { ReactComponent as TimelineIcon } from "../Images/timeline.svg"

function FullScreenPlayer({ toggle }) {
	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)

	return (
		<div className="w-screen h-screen bg-secondarybg px-8 py-6 space-y-8">
			<button onClick={toggle} className="text-black">
				<CloseIcon style={{ fill: "#FFFFFF", opacity: "0.7" }} />
			</button>

			<img
				src={
					currentPlaybackObject.track
						? currentPlaybackObject.track.artwork
						: LargePlaceholder
				}
				alt=""
				className="w-11/12 rounded-lg mx-auto"
			/>

			<div id="info-and-controls" className="space-y-6">
				<div id="info">
					<p className="text-white text-xl">
						{currentPlaybackObject.track
							? currentPlaybackObject.track.title
							: ""}
					</p>
					<p className="text-lg text-gray-400">
						{currentPlaybackObject.track
							? currentPlaybackObject.track.artist
							: ""}
					</p>
				</div>

				<ProgressBar />

				<div className="py-2">
					<PlaybackControls />
				</div>

				<div className="justify-between flex">
					<button>
						<DevicesIcon />
					</button>

					<button>
						<TimelineIcon fill="#FFFFFF" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default FullScreenPlayer
