import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentPlaybackObjectAtom } from "../Global/atoms"
import FastAverageColor from "fast-average-color"

import ProgressBar from "../Components/ProgressBar"

import { ReactComponent as CloseIcon } from "../Images/close.svg"
import LargePlaceholder from "../Images/placeholder-large.svg"
import PlaybackControls from "../Components/PlaybackControls"
import { ReactComponent as DevicesIcon } from "../Images/devices.svg"
import { ReactComponent as TimelineIcon } from "../Images/timeline.svg"

function FullScreenPlayer({ toggle }) {
	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)
	const fac = new FastAverageColor()
	const [averageColor, setAverageColor] = useState()

	function setBackgroundColor() {
		if (!averageColor && currentPlaybackObject.track) {
			console.log("getting average color and setting it to the bg")

			const imageElement = document.getElementById("album-artwork")
			const color = fac.getColor(imageElement)

			console.log({ color })
			setAverageColor(color)

			const container = document.getElementById("full-screen-player-container")
			container.style.backgroundColor = color.hex
		}
	}

	return (
		<div
			id="full-screen-player-container"
			className="bg-secondarybg fixed top-0 bottom-0 left-0 right-0"
		>
			<div className="bg-black bg-opacity-5 w-full h-full px-8 py-6 fullscreen-player space-y-8">
				<button onClick={toggle} className="text-black">
					<CloseIcon style={{ fill: "#FFFFFF", opacity: "0.7" }} />
				</button>

				<div className="max-w-full">
					<img
						id="album-artwork"
						src={
							currentPlaybackObject.track
								? currentPlaybackObject.track.artwork
								: LargePlaceholder
						}
						alt=""
						className="rounded-lg shadow-lg m-auto object-contain"
						onLoad={setBackgroundColor}
						crossOrigin="anonymous"
					/>
				</div>

				<div id="info-and-controls" className="info-and-controls">
					<div id="info">
						<p className="text-white text-xl">
							{currentPlaybackObject.track
								? currentPlaybackObject.track.title
								: ""}
						</p>
						<p className="text-lg text-white opacity-70">
							{currentPlaybackObject.track
								? currentPlaybackObject.track.artist
								: ""}
						</p>
					</div>

					<div className="my-auto">
						<ProgressBar averageColor={averageColor} />
					</div>

					<div className="flex justify-between">
						<button className="medium-only">
							<DevicesIcon />
						</button>

						<PlaybackControls />

						<button className="medium-only">
							<TimelineIcon fill="#FFFFFF" />
						</button>
					</div>

					<div className="justify-between flex md:hidden">
						<button>
							<DevicesIcon />
						</button>

						<button>
							<TimelineIcon fill="#FFFFFF" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FullScreenPlayer
