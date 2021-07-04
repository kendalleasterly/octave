import React from "react"
import { useRecoilValue } from "recoil"
import { currentPlaybackObjectAtom } from "../Global/atoms"
import { useTrackModel } from "../Models/TrackModel"

function ObjectRow(props) {
	const { object, playFunction, noImage, index } = props
	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)
	const {convertSecondsToReadableTime} = useTrackModel()

	function getTextColor() {
		let color = "text"

		if (currentPlaybackObject.track) {

			if (currentPlaybackObject.track.id === object.id) {
				color = "text-accent80"
			}
		}

		return color
	}

	function decideSongsInfo() {
		if (object.totalTracks === 1) {
			return "1 song"
		} else {
			return `${object.totalTracks} songs`;
		}
	}

	return (
		<div className="flex w-full space-x-4">
			<button className="object-row w-full space-x-4" onClick={playFunction}>
				<p className="w-6 text-center text-gray-400 font-semibold text-lg my-auto">
					{index + 1}
				</p>

				{noImage ? (
					<p />
				) : (
					<img className="thumbnail rounded-md" src={object.thumbnail} alt="" />
				)}

				<div className="text-left h-full space-y-0.5">
					<p className={"one-line font-semibold " + getTextColor()}>
						{object.title}
					</p>
					<p className="text-gray-400 one-line font-semibold text-sm">
						{object.artist}
					</p>
				</div>
			</button>

			<p className="my-auto font-semibold text-gray-400 whitespace-nowrap">
				{object.duration
					? convertSecondsToReadableTime(object.duration)
					: decideSongsInfo()}
			</p>

			{props.children}
		</div>
	);
}

export default ObjectRow