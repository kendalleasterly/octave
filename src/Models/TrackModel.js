import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms";
import { PlaybackObject, usePlaybackModel } from "./PlaybackModel";

export function useTrackModel() {
	const setCurrentPlaybackObject = useSetRecoilState(currentPlaybackObjectAtom);
	const [queue, setQueue] = useRecoilState(queueAtom);

	function getPlaybackObjectFromTrack(track, index) {

		return new Promise((resolve, reject) => {
			// const serverURL = "http://localhost:4000"
			const serverURL = "https://open-music.herokuapp.com";

			const SSTrack = sessionStorage.getItem(track.id);

			function fetchNewDownloadURL() {
				return new Promise((resolve, reject) => {
					const payload = JSON.stringify(track);
					axios
						.post(serverURL + "/metadata-link", payload, {
							headers: {
								"Content-Type": "application/json",
							},
						})
						.then((response) => {
							sessionStorage.setItem(track.id, JSON.stringify(response.data));

							const playbackObject = new PlaybackObject(
								track,
								response.data.url,
								response.data.expireTime,
								index
							);

							resolve(playbackObject);
						})
						.catch((err) => {
							console.log("error retrieving metadata-link:", err);
							reject("error retrieving metadata-link:", err);
						});
				});
			}

			if (SSTrack) {
				//yes

				const jsonSSTrack = JSON.parse(SSTrack);

				if (jsonSSTrack.expireTime > Date.now()) {
					//and it's not expired
					console.log("we had", track.title, "and it wasn't expired");
					const playbackObject = new PlaybackObject(
						track,
						jsonSSTrack.url,
						jsonSSTrack.expireTime,
						index
					);

					resolve(playbackObject);
				} else {
					//the url was expired
					console.log("the url was expired");

					fetchNewDownloadURL()
						.then((playbackObject) => {
							resolve(playbackObject);
						})
						.catch((err) => {
							console.log("error fetching download url:" + err);
							reject(err);
						});
				}
			} else {
				//i didn't have it
				console.log("i didn't have it");

				fetchNewDownloadURL()
					.then((playbackObject) => {
						resolve(playbackObject);
					})
					.catch((err) => {
						console.log("error fetching download url:" + err);
						reject(err);
					});
			}
		});
	}

	function playCollection(collection) {
		let playbackObjectArray = [];

		let errors = 0;

		function updatePlaybackObjectArray(playbackObject) {

			if (playbackObject) {
				playbackObjectArray.push(playbackObject);
			}

			if (playbackObjectArray.length === collection.length - errors) {
				playbackObjectArray = playbackObjectArray.sort((first, second) => {
					return first.position - second.position;
				});

				setQueue(playbackObjectArray);
				console.log({ queue });
			}
		}

		let index = 0;

		collection.forEach((track) => {
			this.getPlaybackObjectFromTrack(track, index)
				.then((playbackObject) => {
					if (playbackObject.position === 0) {
						setCurrentPlaybackObject(playbackObject);
					}

					updatePlaybackObjectArray(playbackObject);
				})
				.catch((err) => {
					console.log("error getting the plaback object from track, " + err);
					errors++;
					updatePlaybackObjectArray();
				});

			index++;
		});
	}

	return {
		getPlaybackObjectFromTrack,
		playCollection
	};
}
