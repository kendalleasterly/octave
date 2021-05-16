import { Track } from "open-music-lib"
import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"

import { PlaybackObject, usePlaybackModel } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import ObjectRow from "./ObjectRow"
import Placeholder from "../Images/placeholder.svg"
import More from "../Images/more.svg"

function Song(props) {
	const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(
		currentPlaybackObjectAtom
	)
	const [queue, setQueue] = useRecoilState(queueAtom)
	const trackModel = useTrackModel()
	const playbackModel = usePlaybackModel()

	const track = props.track

	function playSong() {
		playbackModel.pause()

		setCurrentPlaybackObject(
			new PlaybackObject(
				new Track("Loading...", "", "", "", "", 0, "", "", Placeholder)
			)
		)

		trackModel
			.getPlaybackObjectFromTrack(track, 0)
			.then((playbackObject) => {
				setCurrentPlaybackObject(playbackObject)

				document.title =
					playbackObject.track.title + " - " + playbackObject.track.artist

				setQueue([playbackObject])
			})
			.catch((err) => {
				console.log("error playing song:", err)
			})
	}

	function addToQueue() {
		trackModel.getPlaybackObjectFromTrack(track)
		.then((playbackObject) => {

			const currentIndex = queue.indexOf(currentPlaybackObject)

			const newQueue = [...queue]
			newQueue.splice(currentIndex + 1, 0, playbackObject)

			setQueue(newQueue)

		})
		.catch(err => {
			console.log("error adding to queue:" + err)
		})
	}

	return (
		<ObjectRow object={track} playFunction={playSong}>
			<button className="my-auto" onClick={addToQueue}>
				<img src={More} alt="" />
			</button>
		</ObjectRow>
	)
}

export default Song
