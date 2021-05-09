import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentPlaybackObjectAtom, queueAtom } from '../Global/atoms'

import PlayIcon from "../Images/play.svg"
import PauseIcon from "../Images/pause.svg"
import Placeholder from "../Images/placeholder.svg"

function Player(props) {

    const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(currentPlaybackObjectAtom)
    const customPlayer = document.getElementById("custom-player")
    const queue = useRecoilValue(queueAtom)

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
        if (currentPlaybackObject.track) {
            return currentPlaybackObject.track.title
        } else {
            return ""
        }
    }

    function getSongThumbnail() {
        if (currentPlaybackObject.track) {
            return currentPlaybackObject.track.thumbnail
        } else {
            return Placeholder
        }
    }

    function handleEnded() {
        //TODO: make sure the song hasn't epired
        console.log("song did end")

        const nextPlaybackObject = queue[currentPlaybackObject.position + 1]
        console.log({nextPlaybackObject})
        if (nextPlaybackObject) {
            setCurrentPlaybackObject(nextPlaybackObject)
        }
    }

    


    return (
        <div className = "player px-4 py-2 bg-secondaryBackground w-full space-x-4">

            <img src={getSongThumbnail()} className = "w-12 h-12 rounded" alt="" />
            <p className = "my-auto text-white text-lg">{getSongTitle()}</p>
            {/* when you get a chance make sure that when you get to the next song in the queue it's not expired. if is figure out what to do (don't keep them waiting) */}
            <audio autoPlay id = "custom-player" src={currentPlaybackObject.url} onPlay = {handlePlay} onPause ={handlePause} onEnded = {handleEnded}></audio>
            <button onClick = {playPause}><img src={playPauseIcon} alt="" /></button>
            
        </div>
    )
}

export default Player
