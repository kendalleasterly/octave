import React from "react"
import { useRecoilValue } from "recoil"
import { currentPlaybackObjectAtom } from "../Global/atoms"

function ObjectRow(props) {
	const { object, playFunction } = props
	const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)

	function getTextColor() {
		let color = "white"

		if (currentPlaybackObject.track) {
			if (currentPlaybackObject.track.id === object.id) {
				color = "accent-1"
			}
		}

		return color
	}

	return (
		<div className="space-x-4 px-4 flex w-full">
			<button className="space-x-4 object-row w-full" onClick={playFunction}>
				<img className="thumbnail rounded" src={object.thumbnail} alt="" />

				<div className="text-left my-auto space-y-1">
					<p className={"text-lg md:text-base text-" + getTextColor()}>
						{object.title}
					</p>
					<p className="md:text-sm text-gray-400">{object.artist}</p>
				</div>
			</button>

			{props.children}
		</div>
	)
}

export default ObjectRow
