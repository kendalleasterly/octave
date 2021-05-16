import { Track } from "open-music-lib"
import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"
import { PlaybackObject } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import Placeholder from "../Images/placeholder.svg"
import ObjectRow from "./ObjectRow"

function Song(props) {
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
	const setQueue = useRecoilState(queueAtom)[1]
	const trackModel = useTrackModel()

	const track = props.track

	function playSong() {
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

				setQueue([])
			})
			.catch((err) => {
				console.log("error playing song:", err)
			})
	}

	return (
	<ObjectRow object={track} playFunction={playSong}>
		
	</ObjectRow>
	)
}

export default Song
