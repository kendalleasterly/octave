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
		songs,
		isVisible,
		lastUpdatedTime,
		ownerName,
		ownerUID,
		songIDs,
		title
	) {
		this.createTime = createTime
		this.description = description
		this.isVisible = isVisible
		this.lastUpdatedTime = lastUpdatedTime
		this.title = title
		this.ownerName = ownerName
		this.ownerUID = ownerUID
		this.songs = songs
		this.songIDs = songIDs
	}
}

export function usePlaylistModel() {
	const account = useRecoilValue(accountAtom)
	const notificationModel = useNotificationModel()

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
						data.title
					)

					console.log(playlist)
					resolve(playlist)
				})
		})
	}

	function createPlaylist(description, isVisible, title) {
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

		return firestore.runTransaction((transaction) => {
			return transaction.get(playlistRef).then((playlistDoc) => {
				const playlistData = playlistDoc.data()
				const songsCount = playlistData.firstTwentySongs.length

                const normalizedTrack = JSON.parse(JSON.stringify(track)) 

				transaction.set(playlistRef.collection("songs").doc(track.id), normalizedTrack)

				transaction.update(playlistRef, {
					lastUpdatedTime: fb.firestore.FieldValue.serverTimestamp(),
					songIDs: fb.firestore.FieldValue.arrayUnion(track.id),
				})

				if (songsCount < 20) {
					transaction.update(playlistRef, {
						firstTwentySongs: fb.firestore.FieldValue.arrayUnion(normalizedTrack),
					})
				}
			})
		})
        .then(() => {
            notificationModel.add(new NotificationObject(`${track.title} added`, `${track.title} was added to playlist "${playlist.title}"`, "success"))
        })
        .catch(error => {
            console.log("error adding song to playlist:", error)
            notificationModel.add(new NotificationObject(`${track.title} couldn't be added`, `there was an issue adding ${track.title} to the playlist "${playlist.title}"`))
        })
	}

	return { getPlaylist, addToPlaylist, createPlaylist }
}
