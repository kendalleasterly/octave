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

export const headerTextAtom = atom({
    key: "headerText",
    default: ""
})

export const searchTermAtom = atom({
    key: "searchTerm",
    default: ""
})

export const menuIsActiveAtom = atom({
    key: "menuIsActive",
    default: false
})

export const shouldPlayAtom = atom({
    key: "shouldPlay",
    defualt: true
})

export const shufflingAtom = atom({
    key: "shuffling",
    default: false
})

export const contextSelectionAtom = atom({
    key: "contextSelection",
    default: -1
})

//MARK: Settings

function getLSBool(setting) {

    const LSBool = localStorage.getItem(setting)

    return LSBool === "true"
}

export const isDarkAtom = atom({
    key: "isDark",
    default: getLSBool("isDark")
})