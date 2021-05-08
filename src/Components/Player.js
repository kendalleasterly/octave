import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { playbackObjectAtom } from '../Global/atoms'

import PlayIcon from "../Images/play.svg"
import PauseIcon from "../Images/pause.svg"
import Placeholder from "../Images/placeholder.svg"

function Player(props) {

    const playbackObject = useRecoilValue(playbackObjectAtom)
    const customPlayer = document.getElementById("custom-player")

    const [playPauseIcon, setPlayPauseIcon] = useState(PlayIcon)

    function playPause() {
        if (customPlayer.paused) {
            customPlayer.play()
        } else {
            customPlayer.pause()
        }
    }

    function handlePlay() {

        setPlayPauseIcon(PauseIcon)
        console.log("we are playing")

    }

    function handlePause() {
        setPlayPauseIcon(PlayIcon)
        console.log("we are pausing")
    }

    function getSongTitle() {
        if (playbackObject.track) {
            return playbackObject.track.title
        } else {
            return ""
        }
    }

    function getSongThumbnail() {
        if (playbackObject.track) {
            return playbackObject.track.thumbnail
        } else {
            return Placeholder
        }
    }


    return (
        <div className = "player px-4 py-2 bg-secondaryBackground w-full space-x-4">

            <img src={getSongThumbnail()} className = "w-12 h-12 rounded" alt="" />
            <p className = "my-auto text-white text-lg">{getSongTitle()}</p>
            <audio autoPlay id = "custom-player" src={playbackObject.url} onPlay = {handlePlay} onPause ={handlePause}></audio>
            <button onClick = {playPause}><img src={playPauseIcon} alt="" /></button>
            
        </div>
    )
}

export default Player
