import { useRecoilValue } from "recoil"
import { fb, firestore } from "../Global/firebase"
import { accountAtom } from "./AccountModel"
import { NotificationObject, useNotificationModel } from "./NotificationModel"
import { useSpotifyModel } from "./SpotifyModel"
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
		trackIDs,
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
		this.trackIDs = trackIDs
		this.id = id
	}
}

export function usePlaylistModel() {
	const account = useRecoilValue(accountAtom)
	const notificationModel = useNotificationModel()
	const trackModel = useTrackModel()
	const spotifyModel = useSpotifyModel()

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
							dateAdded: data.trackIDs[track.id].dateAdded.toDate(),
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
						data.trackIDs,
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
			trackIDs: {},
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

	function addToPlaylist(rawTrack, playlist) {
		const track = JSON.parse(JSON.stringify(rawTrack))
		delete track.dateAdded

		console.log("adding", track.title, "to", playlist.id, track)

		notificationModel.add(
			new NotificationObject(
				`Adding ${track.title}`,
				`Adding ${track.title} to playlist "${playlist.title}"`
			)
		)

		const playlistRef = firestore.collection("playlists").doc(playlist.id)

		return firestore
			.runTransaction((transaction) => {
				// transaction because we need to updated based off firstTwentySongs
				return transaction.get(playlistRef).then((playlistDoc) => {
					const docData = playlistDoc.data()

					const timeStamp = fb.firestore.FieldValue.serverTimestamp()

					let updatedPlaylistData = {}

					updatedPlaylistData["lastUpdatedTime"] = timeStamp
					updatedPlaylistData["trackIDs." + track.id] = {
						id: track.id,
						dateAdded: timeStamp,
					}

					if (Object.values(docData.firstTwentySongs).length < 20) {
						updatedPlaylistData["firstTwentySongs"] =
							fb.firestore.FieldValue.arrayUnion(track)
					}

					transaction.update(playlistRef, updatedPlaylistData)
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

				trackModel.addTrackToDatabase(track).catch((error) => {
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

	function deleteFromPlaylist(playlist, rawTrack) {

		const track = JSON.parse(JSON.stringify(rawTrack))
		delete track.dateAdded

		const playlistRef = firestore.collection("playlists").doc(playlist.id)

		return firestore
			.runTransaction((transaction) => {

				return transaction.get(playlistRef).then(playlistDoc => {
					const data = playlistDoc.data()

					let isInFirstTwenty = false

					data.firstTwentySongs.map(firstTrack => {
						if (firstTrack.id === track.id) isInFirstTwenty = true
					})

					console.log({isInFirstTwenty})

					let updateData = {}

					if (isInFirstTwenty) {
						updateData["firstTwentySongs"] = fb.firestore.FieldValue.arrayRemove(track)
					}

					updateData["trackIDs." + track.id] = fb.firestore.FieldValue.delete()
					updateData["lastUpdatedTime"] = fb.firestore.FieldValue.serverTimestamp()

					transaction.update(playlistRef, updateData)
				})
			})
			.then(() => {
				new NotificationObject(
					`${track.title} removed`,
					`${track.title} was removed from playlist "${playlist.title}"`,
					"success"
				)
			})
			.catch((error) => {
				console.log(error.message, error.code)

				if (error.code === "permission-denied") {
					notificationModel.add(
						new NotificationObject(
							`${track.title} couldn't be removed`,
							`You don't have permission to edit the playlist "${playlist.title}"`,
							"error"
						)
					)
				} else {
					notificationModel.add(
						new NotificationObject(
							`${track.title} couldn't be removed`,
							`there was an issue removing ${track.title} from the playlist "${playlist.title}"`,
							"error"
						)
					)
				}
			})
	}

	function getNextTracks(playlist) {

		console.log({playlist})
		

		return new Promise((resolve, reject) => {

			//get a list of the song ids that haven't been retrieved

			let retrievedTrackIDs = []

			playlist.tracks.map(track => {
				retrievedTrackIDs.push(track.id)
			})

			let remainingTrackIDs = []

			Object.keys(playlist.trackIDs).map(trackID => {
				if (!retrievedTrackIDs.includes(trackID)) remainingTrackIDs.push(trackID)
			})

			remainingTrackIDs.sort((a, b) => {
				return playlist.trackIDs[a].dateAdded - playlist.trackIDs[b].dateAdded
			})

			remainingTrackIDs = remainingTrackIDs.slice(0, 30)

			spotifyModel.getTracksFromSongIDs(remainingTrackIDs, true)
			.then(newTracks => {

				let tracks = [
					...playlist.tracks,
					...newTracks
				]

				tracks.sort((a, b) => {
					return playlist.trackIDs[a.id].dateAdded - playlist.trackIDs[b.id].dateAdded
				})

				const newPlaylist = {
					...playlist,
					tracks
				}

				resolve(newPlaylist) 
			})
			.catch()
		})
	}

	// function getNextThirtyTracks(playlist) {
	// 	return new Promise((resolve, reject) => {
	// 		const tracks = playlist.tracks

	// 		if (tracks.length != playlist.songIDs.length) {
	// 			let retrievedTrackIDs = [] //in order
	// 			tracks.forEach((track) => {
	// 				retrievedTrackIDs.push(track.id)
	// 			})

	// 			firestore
	// 				.collection("playlists")
	// 				.doc(playlist.id)
	// 				.collection("songs")
	// 				.orderBy("dateAdded")
	// 				.startAfter(tracks[tracks.length - 1].dateAdded)
	// 				.limit(30)
	// 				.get()
	// 				.then((trackDocs) => {
	// 					let newTracks = []

	// 					trackDocs.forEach((trackDoc) => {
	// 						const data = trackDoc.data()

	// 						newTracks.push({
	// 							...data,
	// 							dateAdded: data.dateAdded.toDate(),
	// 						})
	// 					})

	// 					newTracks.sort((a, b) => {
	// 						return a.dateAdded - b.dateAdded
	// 					})

	// 					playlist.tracks = [...tracks, ...newTracks]

	// 					resolve(playlist)
	// 				})
	// 				.catch((err) => {
	// 					console.log("error getting paginated tracks", err)
	// 				})
	// 		}
	// 	})
	// }

	return {
		getPlaylist,
		addToPlaylist,
		createPlaylist,
		deleteFromPlaylist,
		getNextTracks,
	}
}
 