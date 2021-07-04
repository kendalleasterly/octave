import { Album } from "../Models/SpotifyModel"
import React from "react"
import ObjectRow from "./ObjectRow"
import {ReactComponent as Disclosure} from "../Images/disclosure.svg"
import { useHistory } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { isDarkAtom } from "../Global/atoms"

function AlbumComponent(props) {
	//TODO: when adding a song to the global queue, make sure you increase the playbackObject.positon by the queue length
	const history = useHistory()
	const isDark = useRecoilValue(isDarkAtom)

	let album = new Album()
	album = props.album

	function goToAlbum() {
		history.push("/album/" + album.id)
	}

	return (
	<ObjectRow object={album} playFunction={goToAlbum} index = {props.index}>
		<button className="my-auto" >
				<Disclosure fill = {isDark ? "#FFFFFF" : "#3F3F46"}/>
			</button>
	</ObjectRow>)
}

export default AlbumComponent
