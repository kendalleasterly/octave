import { Track } from "../Models/SpotifyModel"
import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentPlaybackObjectAtom, isDarkAtom, queueAtom } from "../Global/atoms"

import { PlaybackObject, usePlaybackModel } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import ObjectRow from "./ObjectRow"
import {ReactComponent as More} from "../Images/more.svg"
import {
	NotificationObject,
	useNotificationModel,
} from "../Models/NotificationModel"
import CollectionSuccess from "../Images/collection-success.svg"
import CollectionError from "../Images/collection-error.svg"
import { useSpring } from "@react-spring/core"
import { animated } from "@react-spring/web"

function Song(props) {
	const [dropdownActive, setDropdownActive] = useState(false)
	const isDark = useRecoilValue(isDarkAtom)
	const playbackModel = usePlaybackModel()

	const {track, noImage} = props

	return (
		<ObjectRow object={track} playFunction={() => playbackModel.playSong(track)} noImage = {noImage} index = {props.index}>
			
			<button
				className="my-auto"
				// onClick={() => setDropdownActive(!dropdownActive)}
				onClick = {() => playbackModel.addToQueue(track)}
			>
				<More fill = {isDark ? "#FFFFFF" : "#3F3F46"}/>
				
			</button>

			{/* <Dropdown/> */}
		</ObjectRow>
	)

	function Dropdown() {
		const styles = useSpring({ opacity: dropdownActive ? 1 : 0 })


		return (
			<animated.div style = {styles}>
				<div
					className="absolute mt-2 px-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					<div className="py-1" role="none">
						<button onClick={() => playbackModel.addToQueue(track)}>Add to Queue</button>
					</div>
				</div>
			</animated.div>
		)
	}
}

export default Song