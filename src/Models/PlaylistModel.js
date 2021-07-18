import Song from "../Components/Song"
import { firestore } from "../Global/firebase"
import { Track } from "./SpotifyModel"

export class Playlist {
    constructor(createTime, description, songs, isVisible, lastUpdatedTime, ownerName, ownerUID, songIDs, title ) {
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

    function getPlaylist(id) {
        return new Promise((resolve, reject) => {
            firestore.collection("playlists").doc(id).get()
            .then(doc => {
                const data = doc.data()

                const createTime = data.createTime.toDate()
                const lastUpdatedTime = data.lastUpdatedTime.toDate()

                const playlist = new Playlist(createTime, data.description, data.firstTwentySongs, data.isVisible, lastUpdatedTime, data.ownerName, data.ownerUID, data.songIDs, data.title)

                console.log(playlist)
                resolve(playlist)
            })
        })
    }

    function addToPlaylist(track) {
         
    }

    return {getPlaylist, addToPlaylist}

}