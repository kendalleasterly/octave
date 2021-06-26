import axios from "axios";
import { useRecoilState } from "recoil";
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms";
import { PlaybackObject, usePlaybackModel } from "./PlaybackModel";

export function useTrackModel() {
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1];
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
				console.log("I have the id in session storage");
				//yes

				const jsonSSTrack = JSON.parse(SSTrack);

				if (jsonSSTrack.expireTime > Date.now()) {
					//and it's not expired
					console.log("and it's not expired");
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
			console.log({ playbackObjectArray, errors });

			if (playbackObject) {
				playbackObjectArray.push(playbackObject);
			}

			if (playbackObjectArray.length === collection.length - errors) {
				playbackObjectArray = playbackObjectArray.sort((first, second) => {
					return first.position - second.position;
				});

				const newPlaybackObjectWithPositions =
					setPositions(playbackObjectArray);

				setQueue(newPlaybackObjectWithPositions);
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

	function getPlaybackObjectsForCollection(collection, shouldPlayFirstObject) {
		return new Promise((resolve, reject) => {
			let playbackObjectArray = [];

			let errors = 0;

			function updatePlaybackObjectArray(playbackObject) {
				console.log({ playbackObjectArray, errors });

				if (playbackObject) {
					playbackObjectArray.push(playbackObject);
				} //this is in an if statmement because it is also called in the catch block, where there isn't a playback object.

				if (playbackObjectArray.length === collection.length - errors) {
					console.log({ playbackObjectArray });

					resolve(playbackObjectArray);
				}
			}

			collection.forEach((track) => {
				this.getPlaybackObjectFromTrack(track)
					.then((playbackObject) => {
						console.log("got update from", track.title);

						if (shouldPlayFirstObject && playbackObjectArray.length === 0) {
							console.log(track.title, "was first");
							setCurrentPlaybackObject(playbackObject);
						}

						updatePlaybackObjectArray(playbackObject);
					})
					.catch((err) => {
						console.log("error getting the plaback object from track, " + err);
						errors++;
						updatePlaybackObjectArray();
					});
			});
		});
	}

	function setPositions(playbackObjects) {
		let index = 0;
		let newPlaybackObjects = [];

		console.log("og:", playbackObjects);

		playbackObjects.forEach((playbackObject) => {
			let newPlaybackObject = new PlaybackObject(
				playbackObject.track,
				playbackObject.url,
				playbackObject.expireTime,
				index
			);

			newPlaybackObjects.push(newPlaybackObject);

			index++;
		});

		return newPlaybackObjects;
	}

	return {
		getPlaybackObjectFromTrack,
		playCollection,
		getPlaybackObjectsForCollection,
		setPositions,
	};
}
