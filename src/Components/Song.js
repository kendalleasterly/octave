import { Track } from "open-music-lib"
import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"
import { PlaybackObject } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import Placeholder from "../Images/placeholder.svg"

function Song(props) {
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
	const setQueue = useRecoilState(queueAtom)[1]
	const trackModel = useTrackModel()

	const track = props.track

	function playSong() {

		setCurrentPlaybackObject(new PlaybackObject(new Track("Loading...", "", "", "", "", 0, "", "", Placeholder)))

		trackModel.getPlaybackObjectFromTrack(track, 0)
		.then(playbackObject => {
			setCurrentPlaybackObject(playbackObject)

			document.title = playbackObject.track.title + " - " + playbackObject.track.artist

			setQueue([])
		})
		.catch(err => {
			console.log("error playing song:", err)
		})

	}

	return (
		<button className = "flex space-x-4 px-4" onClick = {playSong}>
			<img className = "thumbnail rounded" src={track.thumbnail} alt="" />

			<div className = "truncate text-left">
				<p className = "truncate text-lg text-white">{track.title}</p>
				<p  className = "truncate text-gray-400">{track.artist}</p>
			</div>
		</button>
	)
}

export default Song
