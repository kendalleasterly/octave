import { firestore } from "../Global/firebase"

export class FirebaseModel {
	getSongs(ref) {
		return new Promise((resolve, reject) => {
            // firestore.collection("songs")
			ref
				.limit(50)
				.get()
				.then((documentSnapshots) => {
					let trackArray = []

					documentSnapshots.forEach(doc => {
						const data = doc.data()
                        // const lols = doc.

						const track = new Track(
							data.title,
							data.artist,
							doc.id,
							data.thubmnail,
							data.duration
						)

						trackArray.push(track)
					})

                    // const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]

                    resolve(trackArray)

				})
		})
	}

	// getNextSongs(lastVisible)
}

class Track {
	constructor(title, aritst, id, thumbnail, duration) {
		this.title = title
		this.artist = aritst
		this.id = id
		this.thumbnail = thumbnail
		this.duration = duration
	}
}
