import React from "react"
import { usePlaybackModel } from "../Models/PlaybackModel"

function ProgressBar() {

	const {getTotalTime} = usePlaybackModel()

	return (
		<div className="space-x-2 text-gray-400 text-sm flex md:px-2">
			<p className="w-9 time-progressed">
				0:00
			</p>
			<hr className="border-gray-700 border-2 rounded-full w-full self-center" />
			<p className="w-9 time-total">
				{getTotalTime()}
			</p>
		</div>
	)
}

export default ProgressBar
