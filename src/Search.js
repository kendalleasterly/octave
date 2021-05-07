import { SpotifyModel } from "open-music-lib"
import React, { useState } from "react"
import Song from "./Components/Song"

function Search() {
	const [oldSearchTerm, setOldSearchTerm] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const spotifyModel = new SpotifyModel()

	function getSearchResults(searchTerm) {
		if (searchTerm.length >= 3 && searchTerm.trim() !== oldSearchTerm) {
			spotifyModel
				.getToken()
				.then(async (token) => {
					const results = await spotifyModel.fetchSearchResults(
						token,
						searchTerm
					)

					setSearchResults(results)

					setOldSearchTerm(searchTerm)
				})
				.catch((err) => {
					console.log("error getting search results was: " + err)
				})
		}
	}

	return (
		<div>
			<input
				type="text"
				onChange={(event) => getSearchResults(event.target.value)}
			/>

			{searchResults.map((searchResult, key) => {
				return (
					<Song track={searchResult} key = {key}/>
				)
			})}
		</div>
	)
}

export default Search
