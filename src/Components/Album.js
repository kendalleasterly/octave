import { Album } from "../Models/SpotifyModel"
import React from "react"
import ObjectRow from "./ObjectRow"
import Disclosure from "../Images/disclosure.svg"
import { useHistory } from "react-router-dom"

function AlbumComponent(props) {
	//TODO: when adding a song to the global queue, make sure you increase the playbackObject.positon by the queue length
	const history = useHistory()

	let album = new Album()
	album = props.album

	function goToAlbum() {
		history.push("/album/" + album.id)
	}

	return (
	<ObjectRow object={album} playFunction={goToAlbum} index = {props.index}>
		<button className="my-auto" >
				<img src={Disclosure} alt="" className="my-auto" />
			</button>
	</ObjectRow>)
}

export default AlbumComponent
