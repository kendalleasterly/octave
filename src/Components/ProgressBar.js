import React from "react"
import { useRecoilValue } from "recoil"
import { isDarkAtom } from "../Global/atoms"
import { usePlaybackModel } from "../Models/PlaybackModel"

function ProgressBar(props) {

	const isTranslucent = props.isTranslucent
	const isDark = useRecoilValue(isDarkAtom)

	const {getTotalTime} = usePlaybackModel()

	function getBarColor() {
		if (isTranslucent) {
			return "border-white opacity-40"
		} else {
			return isDark ? "border-gray-700" : "border-gray-300"
		}
	}

	return (
		<div className={`space-x-2 text-white opacity-80 text-sm flex`}>
			<p className="w-9 time-progressed text text-gray-400">0:00</p>
			<hr
				className={"border-2 rounded-full w-full self-center " + getBarColor()}
			/>
			<p className="w-9 time-total text text-gray-400">
				{getTotalTime()}
			</p>
		</div>
	);
}

export default ProgressBar
