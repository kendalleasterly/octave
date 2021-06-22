import { Album, SpotifyModel, Track } from "../Models/SpotifyModel"
import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"
import { useTrackModel } from "../Models/TrackModel"
import Placeholder from "../Images/placeholder.svg"
import { usePlaybackModel } from "../Models/PlaybackModel"
import ObjectRow from "./ObjectRow"
import Disclosure from "../Images/disclosure.svg"
import { useHistory } from "react-router-dom"

function AlbumComponent(props) {
	//TODO: when adding a song to the global queue, make sure you increase the playbackObject.positon by the queue length
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
	const history = useHistory()
	const spotifyModel = new SpotifyModel()
	const trackModel = useTrackModel()
	const setQueue = useRecoilState(queueAtom)[1]
	const playbackModel = usePlaybackModel()

	let album = new Album()
	album = props.album

	function playAlbum() {
		
		playbackModel.prepareForNewSong()

		spotifyModel.getAlbumTracks(album.id).then((tracks) => {
			trackModel.playCollection(tracks)
		})
	}

	function goToAlbum() {
		history.push("/album/" + album.id)
	}

	return (
	<ObjectRow object={album} playFunction={goToAlbum}>
		<button className="my-auto" >
				<img src={Disclosure} alt="" className="my-auto" />
			</button>
	</ObjectRow>)
}

export default AlbumComponent
