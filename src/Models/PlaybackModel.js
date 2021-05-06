
export class PlaybackSong {

    constructor(track, url, expireTime) {
        this.track = track
        this.url = url
        this.expireTime = expireTime
    }

    isExpired() {
        return Date.now() >= this.expireTime
    }

    //add a function that caluculates wheter or not the song will expire by the end of playback

}