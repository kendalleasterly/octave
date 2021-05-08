import React from 'react'
import { useRecoilValue } from 'recoil'
import { playbackObjectAtom } from '../Global/atoms'

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
        <div>
            <audio autoPlay controls id = "custom-player" src={playbackObject.url} onTimeUpdate = {handleTimeUpdate}></audio>
            <button onClick = {playPause}> puase</button>
        </div>
    )
}

export default Player
