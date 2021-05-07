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

	function playSong(track) {
		axios.get(serverURL + "/download-url?id=" + track.id).then((response) => {
			const url = response.data.url
			const expireTime = response.data.expireTime

			const playbackSong = new PlaybackSong(track, url, expireTime)
			console.log(playbackSong)

			setNowPlaying(playbackSong)
		})
	}

	return (
		<div>
			{/* <button onClick = {getSongs}></button>

    {songs.map((track, key) => {
      return (
      <div key = {key}>
        <p onClick = {() => playSong(track)}>{track.title} {track.id}</p>
      </div>
      )
    })}


    <Player src={nowPlaying.url}/>
    
    <h2>NOW PLAYING:</h2>

    {nowPlaying.song ? <p>{nowPlaying.track.title} by {nowPlaying.track.artist}</p> : <p></p>} */}

			<RecoilRoot>
				<Player />
				<Search />
			</RecoilRoot>
		</div>
	)
}

export default App
