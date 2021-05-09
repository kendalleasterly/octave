import { atom } from "recoil"
import { PlaybackObject } from "../Models/PlaybackModel"

export const currentPlaybackObjectAtom = atom({
    key: "playbackObject",
    default: new PlaybackObject()
})

export const queueAtom = atom({
    key:"queue",
    default: []
})