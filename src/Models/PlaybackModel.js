import Placeholder from "../Images/placeholder.svg"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"
import { useRecoilState, useRecoilValue } from "recoil"
import { Track } from "open-music-lib"
import { useNotificationModel, NotificationObject } from "./NotificationModel"
import { useTrackModel } from "./TrackModel"

import CollectionSuccess from "../Images/collection-success.svg"
import CollectionError from "../Images/collection-error.svg"

export function usePlaybackModel() {
    const setCurrentPlaybackObject = useRecoilState(currentPlaybackObjectAtom)[1]
    const [queue, setQueue] = useRecoilState(queueAtom)
    const player = document.getElementById("custom-player")
    const notificationModel = useNotificationModel()
    const trackModel = useTrackModel()
    const currentPlaybackObject = useRecoilValue(currentPlaybackObjectAtom)

    function pause() {
        player.pause()
    }

    function prepareForNewSong() {

        document.tilte = "Octave"

        setQueue([])

        pause()

        setCurrentPlaybackObject(
			new PlaybackObject(
				new Track("Loading...", "", "", "", "", 0, "", "", Placeholder)
			)
		)
    }

    function addToQueue(track) {
		notificationModel.add(
			new NotificationObject(`Adding "${track.title}" to queue...`, "", "")
		)

		trackModel
			.getPlaybackObjectFromTrack(track)
			.then((playbackObject) => {
				const currentIndex = queue.indexOf(currentPlaybackObject)

				const newQueue = [...queue]
				newQueue.splice(currentIndex + 1, 0, playbackObject)

				setQueue(newQueue)

				notificationModel.add(
					new NotificationObject(
						`"${track.title}" added to queue`,
						"This song will play next",
						CollectionSuccess,
						true
					)
				)
			})
			.catch((err) => {
				console.log("error adding to queue:" + err)
				notificationModel.add(
					new NotificationObject(
						`Couldn't add "${track.title}" added to queue`,
						err,
						CollectionError
					)
				)
			})
	}

    return {pause, prepareForNewSong, addToQueue}

}

export class PlaybackObject {

    constructor(track, url, expireTime, position) {
        this.track = track
        this.url = url
        this.expireTime = expireTime
        this.position = position
    }

    isExpired() {
        return Date.now() >= this.expireTime
    }

    //add a function that caluculates wheter or not the song will expire by the end of playback

}