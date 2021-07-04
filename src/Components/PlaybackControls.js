import {ReactComponent as SkipIcon} from "../Images/skip-forward.svg"
import {ReactComponent as BackIcon} from "../Images/skip-backward.svg"
import { ReactComponent as RepeatIcon } from "../Images/repeat.svg"
import { ReactComponent as ShuffleIcon } from "../Images/shuffle.svg"
import {ReactComponent as PlayingIcon} from "../Images/playing.svg"
import {ReactComponent as PausedIcon} from "../Images/paused.svg"

import { usePlaybackModel } from "../Models/PlaybackModel"
import { useRecoilState, useRecoilValue } from "recoil"
import { isDarkAtom, isPlayingAtom, shufflingAtom } from "../Global/atoms"

function PlaybackControls() {
	const isPlaying = useRecoilValue(isPlayingAtom)
	const shuffling = useRecoilValue(shufflingAtom)
	const isDark = useRecoilValue(isDarkAtom)
	const buttonColor = isDark ? "#FFFFFF" : "#3F3F46";

	const { skipBack, playPause, skip, toggleShuffling } = usePlaybackModel()

	return (
		<div
			id="controls-secondary"
			className="flex md:space-x-12 py-1 justify-between md:justify-center w-full">
			<button>
				<RepeatIcon fill={buttonColor} />
			</button>

			<div id="controls-primary" className="flex md:space-x-8 space-x-10">
				<button onClick={skipBack}>
					<BackIcon fill={buttonColor} />
				</button>

				<button onClick={playPause} className="">
					{isPlaying ? (
						<PlayingIcon fill={buttonColor} />
					) : (
						<PausedIcon fill={buttonColor} />
					)}
				</button>

				<button onClick={skip} className="ml-4">
					<SkipIcon fill={buttonColor} />
				</button>
			</div>

			<button onClick={toggleShuffling}>
				<ShuffleIcon fill = {shuffling ? "#F08A79" : buttonColor} stroke = {shuffling ? "#F08A79" : buttonColor}/>
			</button>
		</div>
	);
}

export default PlaybackControls
