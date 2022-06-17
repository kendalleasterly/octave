import axios from "axios"
import { useRecoilValue } from "recoil"
import Song from "../Components/Song"
import { fb, firestore } from "../Global/firebase"
import { accountAtom } from "./AccountModel"
import { NotificationObject, useNotificationModel } from "./NotificationModel"
import { Track } from "./SpotifyModel"
import { useTrackModel } from "./TrackModel"

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
	const trackModel = useTrackModel()

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

					let tracks = []

					Object.values(data.firstTwentySongs).map((track) => {
						tracks.push({
							...track,
							dateAdded: track.dateAdded.toDate(),
						})
					})

					tracks.sort((a, b) => {
						return a.dateAdded - b.dateAdded
					})

					const playlist = new Playlist(
						createTime,
						data.description,
						tracks,
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
			firstTwentySongs: {},
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

		notificationModel.add(
			new NotificationObject(
				`Adding ${track.title}`,
				`Adding ${track.title} to playlist "${playlist.title}"`
			)
		)

		const playlistRef = firestore.collection("playlists").doc(playlist.id)

		return firestore
			.runTransaction((transaction) => {
				return transaction.get(playlistRef).then((playlistDoc) => {
					const docData = playlistDoc.data()

					const totalTrack = {
						...track,
						dateAdded: fb.firestore.FieldValue.serverTimestamp(),
					}

					transaction.set(
						playlistRef.collection("songs").doc(track.id),
						totalTrack
					)

					transaction.update(playlistRef, {
						lastUpdatedTime: fb.firestore.FieldValue.serverTimestamp(),
						songIDs: fb.firestore.FieldValue.arrayUnion(track.id),
					})

					let updatedData = {}
					updatedData["firstTwentySongs." + track.id] = totalTrack

					if (Object.values(docData.firstTwentySongs).length < 20) {
						transaction.update(playlistRef, updatedData)
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

				trackModel.addTrackToDatabase(track)
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
				lastUpdatedTime: fb.firestore.FieldValue.serverTimestamp(),
			})

			let updatedData = {}
			updatedData["firstTwentySongs." + track.id] =
				fb.firestore.FieldValue.delete()

			if (isInFirstTwenty()) {
				batch.update(playlistRef, updatedData)
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
							data.artistObjects,
							data.dateAdded
						)

						localStorage.setItem(songID, JSON.stringify(track))

						resolve(track)
					})
					.catch((error) => {
						console.log("error getting track from song id", error)
						reject(error)
					})
			}
		})
	}

	function getNextThirtyTracks(playlist) {
		return new Promise((resolve, reject) => {
			const tracks = playlist.tracks

			if (tracks.length != playlist.songIDs.length) {
				let retrievedTrackIDs = [] //in order
				tracks.forEach((track) => {
					retrievedTrackIDs.push(track.id)
				})

				firestore
					.collection("playlists")
					.doc(playlist.id)
					.collection("songs")
					.orderBy("dateAdded")
					.startAfter(tracks[tracks.length - 1].dateAdded)
					.limit(30)
					.get()
					.then((trackDocs) => {
						let newTracks = []

						trackDocs.forEach((trackDoc) => {
							const data = trackDoc.data()

							newTracks.push({
								...data,
								dateAdded: data.dateAdded.toDate(),
							})
						})

						newTracks.sort((a, b) => {
							return a.dateAdded - b.dateAdded
						})

						playlist.tracks = [...tracks, ...newTracks]

						resolve(playlist)
					})
					.catch((err) => {
						console.log("error getting paginated tracks", err)
					})
			}
		})
	}

	return {
		getPlaylist,
		addToPlaylist,
		createPlaylist,
		deleteFromPlaylist,
		getNextThirtyTracks,
	}
}
