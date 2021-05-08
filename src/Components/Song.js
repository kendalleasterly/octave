import axios from "axios"
import React from "react"
import { useRecoilState } from "recoil"
import { playbackObjectAtom } from "../Global/atoms"
import { PlaybackSong } from "../Models/PlaybackModel"

function Song(props) {
    const setPlaybackObject = useRecoilState(playbackObjectAtom)[1]

    const serverURL = "http://localhost:4000"
    // const serverURL = "https://open-music.herokuapp.com"

    const track = props.track

    function playSong() {
        //user selects spotify song from spotify search


        console.log(localStorage.getItem(track.id))

        //id in session storage?
        if (sessionStorage.getItem(track.id)) {
            //yes
            console.log("I have the id in session storage")
        } else {
            //no
            console.log("I didn't have the id in session storage")

            const payload = JSON.stringify(track)

            axios.post(serverURL + "/metadata-link", payload, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(response => {
                console.log(response)
                const playbackObject = new PlaybackSong(track, response.data.url, response.data.expireDate)
                setPlaybackObject(playbackObject)
            })



        }
    }

	return (
		<div>
			<img src={track.thumbnail} alt="" />

			<div>
				<p>{track.title}</p>
				<p>{track.artist}</p>
				<p>{track.duration}</p>
                <button onClick = {playSong}>play</button>
			</div>
		</div>
	)
}

export default Song
