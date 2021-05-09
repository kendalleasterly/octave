import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"
import { useTrackModel } from "../Models/TrackModel"

function Song(props) {
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
	const setQueue = useRecoilState(queueAtom)[1]
	const trackModel = useTrackModel()

	const track = props.track

	function playSong() {

		trackModel.getPlaybackObjectFromTrack(track, 0)
		.then(playbackObject => {
			setCurrentPlaybackObject(playbackObject)

			setQueue([])
		})
		.catch(err => {
			console.log("error playing song:", err)
		})

	}

	return (
		<button className = "flex space-x-4" onClick = {playSong}>
			<img className = "w-12 h-12 rounded" src={track.thumbnail} alt="" />

			<div className = "truncate text-left">
				<p className = "truncate text-lg text-white">{track.title}</p>
				<p  className = "truncate text-gray-400">{track.artist}</p>
			</div>
		</button>
	)
}

export default Song
