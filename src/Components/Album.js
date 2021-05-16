import { Album, SpotifyModel, Track } from "open-music-lib"
import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom } from "../Global/atoms"
import { useTrackModel } from "../Models/TrackModel"
import Placeholder from "../Images/placeholder.svg"
import { PlaybackObject } from "../Models/PlaybackModel"
import ObjectRow from "./ObjectRow"

function AlbumComponent(props) {
	//TODO: when adding a song to the global queue, make sure you increase the playbackObject.positon by the queue length
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
	const spotifyModel = new SpotifyModel()
	const trackModel = useTrackModel()

	let album = new Album()
	album = props.album

	function playAlbum() {
		setCurrentPlaybackObject(
			new PlaybackObject(
				new Track("Loading...", "", "", "", "", 0, "", "", Placeholder)
			)
		)
		document.title = "Octave"

		spotifyModel.getAlbumTracks(album.id).then((tracks) => {
			trackModel.playCollection(tracks)
		})
	}

	return (
	<ObjectRow object={album} playFunction={playAlbum}>

	</ObjectRow>)
}

export default AlbumComponent
