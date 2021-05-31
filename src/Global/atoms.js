import { atom } from "recoil"
import { PlaybackObject } from "../Models/PlaybackModel"

export const isPlayingAtom = atom({
    key: "isPlaying",
    default: false
})

export const currentPlaybackObjectAtom = atom({
    key: "playbackObject",
    default: new PlaybackObject()
})

export const queueAtom = atom({
    key:"queue",
    default: []
})

export const timelineIsActiveAtom = atom({
    key:"timelineIsActive",
    default: false
})