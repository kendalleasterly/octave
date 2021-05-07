import { atom } from "recoil"
import { PlaybackSong } from "../Models/PlaybackModel"

export const playbackObjectAtom = atom({
    key: "playbackObject",
    default: new PlaybackSong()
})