
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