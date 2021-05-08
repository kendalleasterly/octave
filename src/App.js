import axios from "axios"
import { useState, useEffect } from "react"
import "./App.css"
import { RecoilRoot } from "recoil"

import { firestore } from "./Global/firebase"
import { FirebaseModel } from "./Models/FirebaseModel"
import { PlaybackSong } from "./Models/PlaybackModel"

import Player from "./Components/Player"
import Search from "./Search"

const serverURL = "https://open-music.herokuapp.com"
// const serverURL = "http://localhost:4000"

function App() {
	const [songs, setSongs] = useState([])
	const [nowPlaying, setNowPlaying] = useState({})
	const firebaseModel = new FirebaseModel()

	useEffect(() => {
		if (songs.length === 0) {
			console.log("use effect called")
			firebaseModel
				.getSongs(firestore.collection("songs"))
				.then((songArray) => {
					setSongs(songArray)
				})
				.catch((err) => {
					console.log("error getting songs:" + err)
				})
		}
	})

	return (
		<div className = "p-4">
			<RecoilRoot>
				<Search />
				<Player/>
			</RecoilRoot>
		</div>
	)
}

export default App
