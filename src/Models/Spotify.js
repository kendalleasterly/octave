import axios from "axios"

class SpotifyModel {
	getToken() {
		function requestToken() {
			return new Promise((resolve, reject) => {
				//contact server for a new token

				const serverURL = "http://open-music.herokuapp.com"
				// const serverURL = "http://localhost:4000"

				axios
					.get(serverURL + "/spotify-token")
					.then((response) => {
						localStorage.setItem("tokenJSON", JSON.stringify(response.data))

						const token = response.data.token

						resolve(token)
					})
					.catch((err) => {
						console.log("error getting data from response: " + err.response)
						reject("error getting data from response: " + err.response)
					})
			})
		}

		return new Promise((resolve, reject) => {
			const tokenString = localStorage.getItem("tokenJSON")

			if (tokenString) {
				//we have a tokenJSON already, let's see if it is

				const tokenJSON = JSON.parse(tokenString)
				const expireDateTime = tokenJSON.expireDateTime

				if (expireDateTime >= Date.now()) {
					//has not expired yet

					resolve(tokenJSON.token)
				} else {
					//it did expire, so get a new one

					requestToken()
						.then((token) => {
							resolve(token)
						})
						.catch((err) => {
							reject("error requesting token: " + err)
						})
				}
			} else {
				//we don't have one so get a new one
				requestToken()
					.then((token) => {
						resolve(token)
					})
					.catch((err) => {
						reject("error requesting token: " + err)
					})
			}
		})
	}

	getArtists(SpotifyItem) {
		// const artists = spotifyTrack.artists

		let artists = []

		SpotifyItem.artists.forEach((artist) => {
			artists.push(artist.name)
		})

		if (artists.length === 1) {
			return artists[0]
		} else if (artists.length === 2) {
			return `${artists[0]} & ${artists[1]}`
		} else {
			let returnData = ""

			artists.forEach((artist) => {
				if (artists[0] === artist) {
					returnData = artist
				} else if (artists[artists.length - 1] === artist) {
					returnData = returnData + " & " + artist
				} else {
					returnData = returnData + ", " + artist
				}
			})

			return returnData
		}
	}

	parseSpotifyTrack(spotifyTrack, spotifyAlbum) {
		function getTrackPosition() {
			const trackNumber = spotifyTrack.track_number
			const totalTracks = spotifyAlbum.total_tracks

			return trackNumber + "/" + totalTracks
		}

		function getDuratoion() {
			const duration = Number(spotifyTrack.duration_ms)
			let seconds = Math.round(duration / 1000)

			return seconds
		}

		function getArtistObjects() {
			const artists = spotifyTrack.artists

			let artistObjects = []

			artists.forEach(artist => {
				const artistObject = {
					id: artist.id,
					name: artist.name
				}

				artistObjects.push(artistObject)

			})

			return artistObjects

		}

		const title = spotifyTrack.name
		const aritst = this.getArtists(spotifyTrack)
		const album = spotifyAlbum.name
		const trackPosition = getTrackPosition()
		const date = spotifyAlbum.release_date
		const disc = String(spotifyTrack.disc_number)
		const id = spotifyTrack.id
		const duration = getDuratoion()
		const albumID = spotifyAlbum.id
		const artistObjects = getArtistObjects()
		let artwork = ""
		let thumbnail = ""

		if (spotifyAlbum.images) {
			if (spotifyAlbum.images[0]) {
				artwork = spotifyAlbum.images[0].url
			}

			if (spotifyAlbum.images[1]) {
				thumbnail = spotifyAlbum.images[1].url
			}
		}

		return new Track(
			title,
			aritst,
			album,
			trackPosition,
			date,
			disc,
			id,
			artwork,
			thumbnail,
			duration,
			albumID,
			artistObjects
		)
	}

	fetchSearchResults(token, term) {
		return new Promise((resolve, reject) => {
			const encodedTerm = encodeURI(term)

			axios
				.get(
					`https://api.spotify.com/v1/search?q=${encodedTerm}&type=track%2Calbum&limit=6`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((response) => {

					const tracks = response.data.tracks.items
					const albums = response.data.albums.items

					let trackArray = []

					tracks.forEach((spotifyTrack) => {
						
						const trackObject = this.parseSpotifyTrack(spotifyTrack, spotifyTrack.album)
//instead of artists its album
						trackArray.push(trackObject)
					})

					let albumArray = []

					albums.forEach((spotifyAlbum) => {
						const title = spotifyAlbum.name
						const artist = this.getArtists(spotifyAlbum)
						const thumbnail = spotifyAlbum.images[1].url
						const totalTracks = spotifyAlbum.total_tracks
						const id = spotifyAlbum.id

						albumArray.push(
							new Album(title, artist, totalTracks, id, thumbnail)
						)
					})

					resolve([...trackArray, ...albumArray])
				})
		})
	}

	getAlbumTracks(id) {

		return new Promise(async (resolve, reject) => {

			const token = await this.getToken()

			const album = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}})
	
			let trackArray = []
	
			album.data.tracks.items.forEach(spotifyTrack => {
				
				const parsedTrack = this.parseSpotifyTrack(spotifyTrack, album.data)
				trackArray.push(parsedTrack)
	
			})
	
			resolve(trackArray)
		})
	}
}

class Track {
	constructor(
		title,
		aritst,
		album,
		track,
		date,
		disc,
		id,
		artwork,
		thumbnail,
		duration,
		albumID,
		artistObjects
	) {
		this.title = title
		this.artist = aritst
		this.album = album
		this.track = track
		this.date = date //DD.MM.YY
		this.disc = disc
		this.id = id
		this.artwork = artwork
		this.thumbnail = thumbnail
		this.duration = duration
		this.albumID = albumID,
		this.artistObjects = artistObjects
	}
}

class Album {
	constructor(title, aritst, totalTracks, id, thumbnail) {
		this.title = title
		this.artist = aritst
		this.id = id
		this.thumbnail = thumbnail
		this.totalTracks = totalTracks
	}
}

export {SpotifyModel, Track, Album}