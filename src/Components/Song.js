import axios from "axios"
import React from "react"
import { useRecoilState } from "recoil"
import { playbackObjectAtom } from "../Global/atoms"
import { PlaybackSong } from "../Models/PlaybackModel"

function Song(props) {
	const setPlaybackObject = useRecoilState(playbackObjectAtom)[1]

	// const serverURL = "http://localhost:4000"
	const serverURL = "https://open-music.herokuapp.com"

	const track = props.track

	function playSong() {
		//user selects spotify song from spotify search

		function fetchNewDownloadURL() {
			console.log(
				"The track in session storage either didn't exist or was expired"
			)

			const payload = JSON.stringify(track)

			axios
				.post(serverURL + "/metadata-link", payload, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((response) => {
					sessionStorage.setItem(track.id, JSON.stringify(response.data))

					const playbackObject = new PlaybackSong(
						track,
						response.data.url,
						response.data.expireDate
					)
					setPlaybackObject(playbackObject)
				})
		}

		//id in session storage?
		const sessionStorageTrack = sessionStorage.getItem(track.id)
		if (sessionStorageTrack) {
			console.log("I have the id in session storage")
			//yes

			const jsonSessionStorageTrack = JSON.parse(sessionStorageTrack)

			if (jsonSessionStorageTrack.expireTime > Date.now()) {
				//and it's not expired
				console.log("and it's not expired")
				
				const playbackObject = new PlaybackSong(track, jsonSessionStorageTrack.url, jsonSessionStorageTrack.expireDate)
				setPlaybackObject(playbackObject)
			} else {
				//the url was expired
				console.log("the url was expired")
				fetchNewDownloadURL()
			}
		} else {
			//i didn't have it
			console.log("i didn't have it")
			fetchNewDownloadURL()
		}
	}

	return (
		<button className = "flex space-x-4" onClick = {playSong}>
			<img className = "w-14 h-14 rounded" src={track.thumbnail} alt="" />

			<div className = "truncate text-left">
				<p className = "text-xl text-white">{track.title}</p>
				<p  className = "text-lg text-gray-400">{track.artist}</p>
			</div>
		</button>
	)
}

export default Song
