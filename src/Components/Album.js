import { Album, SpotifyModel } from "open-music-lib"
import React from "react"
import { useTrackModel } from "../Models/TrackModel"

function AlbumComponent(props) {
	//TODO: when adding a song to the global queue, make sure you increase the playbackObject.positon by the queue length
	const spotifyModel = new SpotifyModel()
	const trackModel = useTrackModel()

	let album = new Album()
	album = props.album

	function playAlbum() {
		spotifyModel.getAlbumTracks(album.id).then((tracks) => {
			console.log(tracks)
            
			trackModel.playCollection(tracks)
		})
	}

	return (
		<button className="flex space-x-4" onClick={playAlbum}>
			<img className="w-12 h-12 rounded" src={album.thumbnail} alt="" />

			<div className="truncate text-left">
				<p className="truncate text-lg text-white">{album.title}</p>
				<p className="truncate text-gray-400">{album.artist}</p>
			</div>
		</button>
	)
}

export default AlbumComponent
