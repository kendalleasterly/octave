import axios from "axios"

export function useSpotifyModel() {
	const spotifyURL = "https://api.spotify.com/v1"

	const serverURL = "http://open-music.herokuapp.com"
	// const serverURL = "http://localhost:4000"

	function getToken() {
		function requestToken() {
			return new Promise((resolve, reject) => {
				//contact server for a new token

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

	function getArtists(artistObjects) {
		// const artists = spotifyTrack.artists

		let artists = []

		artistObjects.forEach((artist) => {
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

	function getArtistObjects(spotifyObject) {
		const artists = spotifyObject.artists

		let artistObjects = []

		artists.forEach((artist) => {
			const artistObject = {
				id: artist.id,
				name: artist.name,
			}

			artistObjects.push(artistObject)
		})

		return artistObjects
	}

	function parseSpotifyTrack(spotifyTrack, spotifyAlbum) {
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

		const title = spotifyTrack.name
		const aritst = getArtists(spotifyTrack.artists)
		const album = spotifyAlbum.name
		const trackPosition = getTrackPosition()
		const date = spotifyAlbum.release_date
		const disc = String(spotifyTrack.disc_number)
		const id = spotifyTrack.id
		const duration = getDuratoion()
		const albumID = spotifyAlbum.id
		const artistObjects = getArtistObjects(spotifyTrack)
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

	function fetchSearchResults(token, term) {
		return new Promise((resolve, reject) => {
			const encodedTerm = encodeURIComponent(term)

			axios
				.get(
					spotifyURL +
						"/search?q=" +
						encodedTerm +
						"&type=track%2Calbum&limit=6",
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
						const trackObject = parseSpotifyTrack(
							spotifyTrack,
							spotifyTrack.album
						)
						//instead of artists its album
						trackArray.push(trackObject)
					})

					let albumArray = []

					albums.forEach((spotifyAlbum) => {
						const title = spotifyAlbum.name
						const artist = getArtists(spotifyAlbum.artists)
						const totalTracks = spotifyAlbum.total_tracks
						const id = spotifyAlbum.id
						let thumbnail = ""

						if (spotifyAlbum.images[0]) {
							thumbnail = spotifyAlbum.images[0].url
						} else {
							console.log({ spotifyAlbum })
						}

						albumArray.push(
							new Album(title, artist, totalTracks, id, thumbnail)
						)
					})

					resolve([...trackArray, ...albumArray])
				})
		})
	}

	function getAlbumTracks(id) {
		return new Promise(async (resolve, reject) => {
			const token = await getToken()

			const album = await axios.get(spotifyURL + "/albums/" + id, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			let trackArray = []

			album.data.tracks.items.forEach((spotifyTrack) => {
				const parsedTrack = parseSpotifyTrack(spotifyTrack, album.data)
				trackArray.push(parsedTrack)
			})

			resolve(trackArray)
		})
	}

	function parseSpotifyAlbum(spotifyAlbum) {
		const title = spotifyAlbum.name
		const artists = getArtistObjects(spotifyAlbum)
		const id = spotifyAlbum.id
		const totalTracks = spotifyAlbum.total_tracks
		const artist = getArtists(spotifyAlbum.artists)
		const type = spotifyAlbum.album_type
		const date = spotifyAlbum.release_date

		const tracks = []

		spotifyAlbum.tracks.items.forEach((spotifyTrack) => {
			const parsedTrack = parseSpotifyTrack(spotifyTrack, spotifyAlbum)
			tracks.push(parsedTrack)
		})

		let thumbnail = ""
		let artwork = ""
		if (spotifyAlbum.images) {
			if (spotifyAlbum.images[0]) {
				artwork = spotifyAlbum.images[0].url
			}

			if (spotifyAlbum.images[1]) {
				thumbnail = spotifyAlbum.images[1].url
			}
		}

		const parsedAlbum = new Album(
			title,
			artist,
			totalTracks,
			id,
			thumbnail,
			date,
			tracks,
			artwork,
			artists,
			type
		)

		return parsedAlbum
	}

	function getAlbum(id) {
		return new Promise((resolve, reject) => {
			getToken()
				.then((token) => {
					axios
						.get(spotifyURL + "/albums/" + id, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						})
						.then((spotifyAlbum) => {
							const parsedAlbum = parseSpotifyAlbum(spotifyAlbum.data)
							resolve(parsedAlbum)
						})
				})
				.catch((error) => {
					console.log("error getting album:", error)
					reject(error)
				})
		})
	}

	function getTracksFromSongIDs(trackIDs, shouldCache) {
		//check local storage to see if we have it

		return new Promise(async (resolve, reject) => {
			let remainingIDs = []
			let tracks = []

			trackIDs.map((trackID) => {
				const trackString = localStorage.getItem(trackID)

				if (trackString) {
					tracks.push(JSON.parse(trackString))
				} else {
					remainingIDs.push(trackID)
				}
			})

			if (remainingIDs.length !== 0) {

				let idsString = ""
				for (let i = 0; i < remainingIDs.length; i++) {
					if (i != 0) idsString += ","

					idsString += remainingIDs[i]
				}

				const token = await getToken()

				axios
					.get(spotifyURL + "/tracks?ids=" + idsString, {
						headers: {
							Authorization: "Bearer " + token,
						},
					})
					.then((result) => {
						const rawTracks = result.data.tracks

						rawTracks.map((rawTrack) => {
							const track = parseSpotifyTrack(rawTrack, rawTrack.album)

							if (shouldCache)
								localStorage.setItem(track.id, JSON.stringify(track))

							tracks.push(track)
						})

						resolve(tracks)
					})
					.catch((error) => {
						console.log("error getting remaining trackIDs", error)
						reject(error)
					})
			} else {
				resolve(tracks)
			}
		})

		//continue rest of function with the ones we don't have
	}

	return {
		getToken,
		getArtists,
		getAlbum,
		getAlbumTracks,
		getArtistObjects,
		parseSpotifyAlbum,
		parseSpotifyTrack,
		fetchSearchResults,
		getTracksFromSongIDs,
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
		artistObjects,
		dateAdded
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
		this.albumID = albumID
		this.artistObjects = artistObjects
		this.dateAdded = dateAdded //optional, only for playlists
	}
}

class Album {
	constructor(
		title,
		artist,
		totalTracks,
		id,
		thumbnail,
		date,
		tracks,
		artwork,
		aritsts,
		type
	) {
		//required
		this.title = title
		this.artist = artist
		this.id = id
		this.thumbnail = thumbnail
		this.totalTracks = totalTracks
		this.date = date

		//not required
		this.tracks = tracks
		this.artwork = artwork
		this.artists = aritsts
		this.type = type
	}
}

export { Track, Album }
