import axios from "axios"
import { useRecoilValue } from "recoil"
import Song from "../Components/Song"
import { fb, firestore } from "../Global/firebase"
import { accountAtom } from "./AccountModel"
import { NotificationObject, useNotificationModel } from "./NotificationModel"
import { Track } from "./SpotifyModel"

export class Playlist {
	constructor(
		createTime,
		description,
		tracks,
		isVisible,
		lastUpdatedTime,
		ownerName,
		ownerUID,
		songIDs,
		title,
		id
	) {
		this.createTime = createTime
		this.description = description
		this.isVisible = isVisible
		this.lastUpdatedTime = lastUpdatedTime
		this.title = title
		this.ownerName = ownerName
		this.ownerUID = ownerUID
		this.tracks = tracks
		this.songIDs = songIDs
		this.id = id
	}
}

export function usePlaylistModel() {
	const account = useRecoilValue(accountAtom)
	const notificationModel = useNotificationModel()

	let serverURL = "https://open-music.herokuapp.com"

	function getPlaylist(id) {
		return new Promise((resolve, reject) => {
			firestore
				.collection("playlists")
				.doc(id)
				.get()
				.then((doc) => {
					const data = doc.data()

					const createTime = data.createTime.toDate()
					const lastUpdatedTime = data.lastUpdatedTime.toDate()

					const playlist = new Playlist(
						createTime,
						data.description,
						data.firstTwentySongs,
						data.isVisible,
						lastUpdatedTime,
						data.ownerName,
						data.ownerUID,
						data.songIDs,
						data.title,
						doc.id
					)

					resolve(playlist)
				})
				.catch((error) => {
					console.log(error)

					if (error.code === "permission-denied") {
						notificationModel.add(
							new NotificationObject(
								"Permission Denied",
								"You don't have access to this playlist",
								"error"
							)
						)

						reject(error.message)
					} else {
						notificationModel.add(
							new NotificationObject(
								"Error Getting Playlist",
								"Sorry, there was an error getting this playlist",
								"error"
							)
						)

						reject(error.message)
					}
				})
		})
	}

	function createPlaylist(description, isVisible, title) {
		if (typeof title != String || title === "") {
			notificationModel.add(
				new NotificationObject(
					"Please add a title",
					"Playlists must have titles",
					"error"
				)
			)
		}

		const batch = firestore.batch()

		const newPlaylistRef = firestore.collection("playlists").doc()

		batch.set(newPlaylistRef, {
			createTime: fb.firestore.FieldValue.serverTimestamp(),
			description: description,
			firstTwentySongs: [],
			isVisible: isVisible,
			lastUpdatedTime: fb.firestore.FieldValue.serverTimestamp(),
			ownerName: account.name,
			ownerUID: account.uid,
			songIDs: [],
			title: title,
		})

		const accountRef = firestore.collection("users").doc(account.uid)

		batch.update(accountRef, {
			simplePlaylists: fb.firestore.FieldValue.arrayUnion({
				id: newPlaylistRef.id,
				title: title,
			}),
		})

		batch
			.commit()
			.then(() => {
				notificationModel.add(
					new NotificationObject(
						`"${title}" added`,
						`Your new playlist "${title}" was created"`,
						"success"
					)
				)
			})
			.catch((err) => {
				console.log("error creating playlist:", err)

				notificationModel.add(
					new NotificationObject(
						`"${title}" not added`,
						`Sorry, there was an error creating "${title}"`,
						"error"
					)
				)
			})
	}

	function addToPlaylist(track, playlist) {
		console.log("adding", track.title, "to", playlist.id, { track })

		const playlistRef = firestore.collection("playlists").doc(playlist.id)

		return firestore
			.runTransaction((transaction) => {
				return transaction.get(playlistRef).then((playlistDoc) => {
					const songsCount = playlistDoc.data().firstTwentySongs.length

					const normalizedTrack = JSON.parse(JSON.stringify(track))

					transaction.set(
						playlistRef.collection("songs").doc(track.id),
						normalizedTrack
					)

					transaction.update(playlistRef, {
						lastUpdatedTime: fb.firestore.FieldValue.serverTimestamp(),
						songIDs: fb.firestore.FieldValue.arrayUnion(track.id),
					})

					if (songsCount < 20) {
						transaction.update(playlistRef, {
							firstTwentySongs:
								fb.firestore.FieldValue.arrayUnion(normalizedTrack),
						})
					}
				})
			})
			.then(() => {
				notificationModel.add(
					new NotificationObject(
						`${track.title} added`,
						`${track.title} was added to playlist "${playlist.title}"`,
						"success"
					)
				)

				axios
					.post(serverURL + "/metadata-add", track)
					.then((response) => {
						console.log(response.status, response.data)
					})
					.catch((error) => {
						if (error.response) {
							if (error.response.status !== 409) {
								console.log("error adding song file to database", error)
							}
						} else {
							console.log("error adding song file to database", error)
						}
					})
			})
			.catch((error) => {
				console.log("error adding song to playlist:", error)
				notificationModel.add(
					new NotificationObject(
						`${track.title} couldn't be added`,
						`there was an issue adding ${track.title} to the playlist "${playlist.title}"`,
						"error"
					)
				)
			})
	}

	function deleteFromPlaylist(playlist, track) {
		return new Promise((resolve, reject) => {
			function isInFirstTwenty() {
				let returnValue = false

				playlist.tracks.forEach((song) => {
					if (song.id === track.id) returnValue = true
				})

				return returnValue
			}

			console.log({ track, playlist })

			const batch = firestore.batch()
			const playlistRef = firestore.collection("playlists").doc(playlist.id)

			batch.update(playlistRef, {
				songIDs: fb.firestore.FieldValue.arrayRemove(track.id),
				lastUpdatedTime: fb.firestore.FieldValue.serverTimestamp()
			})

			if (isInFirstTwenty()) {
				batch.update(playlistRef, {
					firstTwentySongs: fb.firestore.FieldValue.arrayRemove(track),
				})
			}

			batch.delete(playlistRef.collection("songs").doc(track.id))

			batch
				.commit()
				.then(() => {
					notificationModel.add(
						new NotificationObject(
							`${track.title} removed`,
							`${track.title} was removed from playlist "${playlist.title}"`,
							"success"
						)
					)
					resolve()
				})
				.catch((error) => {
					console.log(error.message, error.code)

					if (error.code === "permission-denied") {
						notificationModel.add(
							new NotificationObject(
								`${track.title} couldn't be added`,
								`You don't have permission to edit the playlist "${playlist.title}"`,
								"error"
							)
						)
					} else {
						notificationModel.add(
							new NotificationObject(
								`${track.title} couldn't be added`,
								`there was an issue removing ${track.title} from the playlist "${playlist.title}"`,
								"error"
							)
						)
					}

					reject()
				})
		})
	}

	function getTrackFromSongID(songID, playlistID) {
		return new Promise((resolve, reject) => {

			let LSTrack = localStorage.getItem(songID)

			if (LSTrack) {
				const track = JSON.parse(LSTrack)
				resolve(track)
			} else {

				firestore
				.collection("playlists")
				.doc(playlistID)
				.collection("songs")
				.doc(songID)
				.get()
				.then((doc) => {
					const data = doc.data()

					const track = new Track(
						data.title,
						data.artist,
						data.album,
						data.track,
						data.date,
						data.disc,
						data.id,
						data.artwork,
						data.thumbnail,
						data.duration,
						data.albumID,
						data.artistObjects
					)

					localStorage.setItem(songID, JSON.stringify(track))

					resolve(track)
				})
				.catch(error => {
					console.log("error getting track from song id", error)
					reject(error)
				})
			}
		})
	}

	function getNextThirtyTracks(playlist) {

		return new Promise((resolve, reject) => {
			//i need to know where im starting from and what i'm getting

			// - i will use the full array of song IDs and make a new one by looping over the full one and not appending what i already have
			let retrievedTrackIDs = [] //in order
			playlist.tracks.forEach((track) => {
				retrievedTrackIDs.push(track.id)
			})

			let remainingTrackIDs = [] //in order
			playlist.songIDs.forEach((songID) => {
				if (!retrievedTrackIDs.includes(songID)) {
					//we have not retrieved this song ID yet

					remainingTrackIDs.push(songID)
				}
			})

			let maxSpliceIndex =
				remainingTrackIDs.length >= 30 ? 30 : remainingTrackIDs.length

			remainingTrackIDs.splice(maxSpliceIndex, remainingTrackIDs.length)

			let tracks = [] //unordered
			let errors = 0

			remainingTrackIDs.forEach(trackID => {
				getTrackFromSongID(trackID, playlist.id)
				.then(track => {
					tracks.push(track)

					checkForFinish()
				})
				.catch(error => {
					console.log("error getting track from song id", error)
					reject("error getting track from song id " + error)

				})
			})

			function checkForFinish() {

				if (tracks.length - errors === remainingTrackIDs.length) {
					tracks.sort((firstTrack, secondTrack) => {
						return playlist.songIDs.indexOf(firstTrack.id) - playlist.songIDs.indexOf(secondTrack.id)
					})
		
					playlist.tracks = [
						...playlist.tracks,
						...tracks
					]
		
					resolve(playlist)
				}
			}

			// - will return a new playlist object with all the new songs.
			// i can get all of this info by just receiving the playlist object
		})
	}

	return { getPlaylist, addToPlaylist, createPlaylist, deleteFromPlaylist, getNextThirtyTracks }
}
