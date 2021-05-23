import { Album, SpotifyModel, Track } from "open-music-lib"
import React from "react"
import { useRecoilState } from "recoil"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"
import { useTrackModel } from "../Models/TrackModel"
import Placeholder from "../Images/placeholder.svg"
import { usePlaybackModel } from "../Models/PlaybackModel"
import ObjectRow from "./ObjectRow"
import Disclosure from "../Images/disclosure.svg"

function AlbumComponent(props) {
	//TODO: when adding a song to the global queue, make sure you increase the playbackObject.positon by the queue length
	const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
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

	return (
	<ObjectRow object={album} playFunction={playAlbum}>
		<button className="my-auto" >
				<img src={Disclosure} alt="" className="my-auto" />
			</button>
	</ObjectRow>)
}

export default AlbumComponent
