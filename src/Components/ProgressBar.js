import React from "react"
import { usePlaybackModel } from "../Models/PlaybackModel"

function ProgressBar({averageColor}) {

	const {getTotalTime} = usePlaybackModel()

	return (
		<div className={`space-x-2 text-white opacity-80 text-sm flex`}>
			<p className="w-9 time-progressed">
				0:00
			</p>
			<hr className="text-white opacity-40 border-2 rounded-full w-full self-center" />
			<p className="w-9 time-total">
				{getTotalTime()}
			</p>
		</div>
	)
}

export default ProgressBar
