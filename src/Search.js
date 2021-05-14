import { SpotifyModel } from "open-music-lib"
import React, { useState } from "react"
import AlbumComponent from "./Components/Album"

import Song from "./Components/Song"
import MenuIcon from "./Images/menu.svg"
import SearchIcon from "./Images/search.svg"

function Search() {
	const [oldSearchTerm, setOldSearchTerm] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const spotifyModel = new SpotifyModel()

	function getSearchResults(searchTerm) {
		if (searchTerm !== "") {
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
		} else {
			setSearchResults([])
		}
	}

	function testFunction() {}

	return (
		<div className = "overflow-hidden">
			<div className = "p-4 space-y-4">
				<div className="one-button-header space-x-4">
					<button onClick={testFunction}>
						<img
							src={MenuIcon}
							alt=""
							className="rounded-full bg-secondaryBackground p-2.5"
						/>
					</button>

					<p className={"text-2xl font-semibold text-white m-auto text-center"}>
						Search
					</p>
				</div>

				<div
					className={
						"bg-secondaryBackground rounded-2xl px-4 py-2 flex space-x-4"
					}
				>
					<img src={SearchIcon} alt="" />

					<input
						type="text"
						className="text-lg text-white bg-transparent"
						placeholder="Songs and Albums"
						onChange={(event) => getSearchResults(event.target.value)}
					/>
				</div>
			</div>
			<div className="space-y-2.5 pb-17">
				{searchResults.map((searchResult, key) => {
					return (
						<div className="space-y-2.5" key={key}>
							{searchResult.album ? (
								<Song track={searchResult} />
							) : (
								<AlbumComponent album={searchResult} />
							)}
							<hr />
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Search
