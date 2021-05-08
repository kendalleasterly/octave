import React from 'react'
import { useRecoilValue } from 'recoil'
import { playbackObjectAtom } from '../Global/atoms'

import PlayIcon from "../Images/play-button.svg"

function Player(props) {

    const playbackObject = useRecoilValue(playbackObjectAtom)

    const customPlayer = document.getElementById("custom-player")

    function playPause() {
        if (customPlayer.paused) {
            customPlayer.play()
        } else {
            customPlayer.pause()
        }
        
    }

    function handleTimeUpdate() {



    }


    return (
        <div className = "player px-4 py-2 bg-secondaryBackground w-full space-x-4">
            
            <img src={playbackObject.track.thumbnail} className = "w-14 h-14 rounded" alt="" />
            <p className = "my-auto text-white text-xl">{playbackObject.track.title}</p>
            <audio autoPlay id = "custom-player" src={playbackObject.url} onTimeUpdate = {handleTimeUpdate}></audio>
            <button onClick = {playPause}><img src={PlayIcon} alt="" /></button>
            
        </div>
    )
}

export default Player
