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

	function testFunction() {

	}

	return (
		<div className="space-y-6 overflow-hidden pb-14">
			<div className="flex space-x-4">
				<button onClick = {testFunction}>
					<img src={MenuIcon} alt="" />
				</button>
				

				<p className={"text-3xl font-semibold text-white"}>Search</p>
			</div>

			<div
				className={"bg-secondaryBackground rounded px-4 py-2 flex space-x-4"}
			>
				<img src={SearchIcon} alt="" />

				<input
					type="text"
					className="text-lg text-white bg-transparent"
					onChange={(event) => getSearchResults(event.target.value)}
				/>
			</div>

			<div className="space-y-2.5">
				{searchResults.map((searchResult, key) => {
						return (
							<div className = "space-y-2.5"  key={key}>
								{searchResult.album ? <Song track={searchResult} /> : <AlbumComponent album={searchResult}/>}
								{searchResult.id !== searchResults[searchResults.length - 1].id ? <hr/> : <p></p>}
							</div>
						)
				})}
			</div>
		</div>
	)
}

export default Search
