import {ReactComponent as SkipIcon} from "../Images/skip-forward.svg"
import {ReactComponent as BackIcon} from "../Images/skip-backward.svg"
import { ReactComponent as RepeatIcon } from "../Images/repeat.svg"
import { ReactComponent as ShuffleIcon } from "../Images/shuffle.svg"
import {ReactComponent as PlayingIcon} from "../Images/playing.svg"
import {ReactComponent as PausedIcon} from "../Images/paused.svg"

import { usePlaybackModel } from "../Models/PlaybackModel"
import { useRecoilValue } from "recoil"
import { isPlayingAtom } from "../Global/atoms"

function PlaybackControls() {
	const isPlaying = useRecoilValue(isPlayingAtom)

	const { skipBack, playPause, skip } = usePlaybackModel()

	return (
		<div
			id="controls-secondary"
			className="flex md:space-x-12 py-1 justify-between md:justify-center w-full"
		>
			<button>
				<RepeatIcon />
			</button>

			<div id="controls-primary" className="flex md:space-x-8 space-x-10">
				<button onClick={skipBack}>
					<BackIcon/>
				</button>

				<button onClick={playPause} className="">
					{isPlaying ? <PlayingIcon/> : <PausedIcon/>}
				</button>

				<button onClick={skip} className="ml-4">
					<SkipIcon/>
				</button>
			</div>

			<button>
				<ShuffleIcon />
			</button>
		</div>
	)
}

export default PlaybackControls
