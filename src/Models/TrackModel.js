import axios from "axios"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom } from "../Global/atoms"
import { PlaybackObject } from "./PlaybackModel"

export function useTrackModel() {

	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]

	function getPlaybackObjectFromTrack(track, index) {
		return new Promise((resolve, reject) => {
			// const serverURL = "http://localhost:4000"
			const serverURL = "https://open-music.herokuapp.com"

			const SSTrack = sessionStorage.getItem(track.id)

			function fetchNewDownloadURL() {
				return new Promise((resolve, reject) => {
					const payload = JSON.stringify(track)
					axios
						.post(serverURL + "/metadata-link", payload, {
							headers: {
								"Content-Type": "application/json",
							},
						})
						.then((response) => {
							sessionStorage.setItem(track.id, JSON.stringify(response.data))

							const playbackObject = new PlaybackObject(
								track,
								response.data.url,
								response.data.expireTime,
								index
							)

							resolve(playbackObject)
						})
						.catch((err) => {
							console.log("error retrieving metadata-link:", err)
							reject("error retrieving metadata-link:", err)
						})
				})
			}

			if (SSTrack) {
				console.log("I have the id in session storage")
				//yes

				const jsonSSTrack = JSON.parse(SSTrack)

				if (jsonSSTrack.expireTime > Date.now()) {
					//and it's not expired
					console.log("and it's not expired")
					const playbackObject = new PlaybackObject(
						track,
						jsonSSTrack.url,
						jsonSSTrack.expireTime,
						index
					)

					resolve(playbackObject)
				} else {
					//the url was expired
					console.log("the url was expired")

					fetchNewDownloadURL().then((playbackObject) => {
						resolve(playbackObject)
					})
				}
			} else {
				//i didn't have it
				console.log("i didn't have it")

				fetchNewDownloadURL().then((playbackObject) => {
					resolve(playbackObject)
				})
			}
		})
	}

	function playCollection(collection) {
		console.log("play collection ran")
		let playbackObjectArray = []

		let index = 0

		collection.forEach((track) => {
			this.getPlaybackObjectFromTrack(track, index).then((playbackObject) => {
				console.log("got", playbackObject.track.title, playbackObject.position)
				if (playbackObject.position === 0) {
					console.log("and it was the first")
					setCurrentPlaybackObject(playbackObject)
				}

				playbackObjectArray.push(playbackObject)
			})

			index++
		})
	}

	return {getPlaybackObjectFromTrack, playCollection}

}
