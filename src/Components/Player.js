import React from 'react'

function Player(props) {

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
            <audio autoPlay controls id = "custom-player" src={props.src} onTimeUpdate = {handleTimeUpdate}></audio>
            <button onClick = {playPause}> puase</button>
        </div>
    )
}

export default Player
