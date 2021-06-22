import { Track } from "../Models/SpotifyModel"
import React, { useState } from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"

import { PlaybackObject, usePlaybackModel } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import ObjectRow from "./ObjectRow"
import More from "../Images/more.svg"
import {
	NotificationObject,
	useNotificationModel,
} from "../Models/NotificationModel"
import CollectionSuccess from "../Images/collection-success.svg"
import CollectionError from "../Images/collection-error.svg"
import { useSpring } from "@react-spring/core"
import { animated } from "@react-spring/web"

function Song(props) {
	const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(
		currentPlaybackObjectAtom
	)
	const [queue, setQueue] = useRecoilState(queueAtom)
	const [dropdownActive, setDropdownActive] = useState(false)
	const trackModel = useTrackModel()
	const playbackModel = usePlaybackModel()

	const {track, noImage} = props

	function playSong() {
		playbackModel.prepareForNewSong()

		trackModel
			.getPlaybackObjectFromTrack(track, 0)
			.then((playbackObject) => {
				setCurrentPlaybackObject(playbackObject)

				setQueue([playbackObject])
			})
			.catch((err) => {
				console.log("error playing song:", err)
			})
	}

	return (
		<ObjectRow object={track} playFunction={playSong} noImage = {noImage}>
			
			<button
				className="my-auto"
				// onClick={() => setDropdownActive(!dropdownActive)}
				onClick = {() => playbackModel.addToQueue(track)}
			>
				<img src={More} alt=""/>
				
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