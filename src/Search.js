import { SpotifyModel } from "open-music-lib"
import React, { useState } from "react"

import Song from "./Components/Song"
import MenuIcon from "./Images/menu.svg"
import SearchIcon from "./Images/search.svg"

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
		<div className="space-y-6">
			<div className="flex space-x-4">
				<img src={MenuIcon} alt="" />

				<p className={"text-3xl font-semibold text-white"}>Search</p>
			</div>

			<div
				className={"bg-secondaryBackground rounded px-4 py-2 flex space-x-4"}
			>
				<img src={SearchIcon} alt="" />

				<input
					type="text"
					className="text-xl text-white bg-transparent"
					onChange={(event) => getSearchResults(event.target.value)}
				/>
			</div>

			<div className="space-y-4">
				{searchResults.map((searchResult, key) => {
					if (searchResult.id !== searchResults[searchResults.length - 1].id) {
						return (
							<div className = "space-y-4">
								<Song track={searchResult} key={key} />
								<hr/>
							</div>
						)
					} else {
						return <Song track={searchResult} key={key} />
					}
				})}
			</div>
		</div>
	)
}

export default Search
