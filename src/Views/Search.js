import { SpotifyModel } from "../Models/SpotifyModel"
import React, { useEffect, useState } from "react"

import AlbumComponent from "../Components/Album"
import Song from "../Components/Song"
import { ReactComponent as SearchIcon } from "../Images/search.svg"
import { ReactComponent as CloseIcon } from "../Images/close.svg"
import { useRecoilState } from "recoil"
import { headerTextAtom, searchTermAtom } from "../Global/atoms"

function Search() {
	const [oldSearchTerm, setOldSearchTerm] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom)
	const setHeaderText = useRecoilState(headerTextAtom)[1]
	const spotifyModel = new SpotifyModel()

	useEffect(() => {
		document.getElementById("search-input").focus()

		setHeaderText("Search")

		if (searchTerm !== "") {
			document.getElementById("search-input").value = searchTerm
			getSearchResults(searchTerm)
		} 

	}, [setHeaderText])

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

	function clearSearchInput() {
		const searchField = document.getElementById("search-input")

		searchField.value = ""
		setSearchResults([])
		searchField.focus()
	}

	return (
		<div className="space-y-4 md:space-y-6">
			<div
				className={
					"bg-secondarybg rounded-2xl md:rounded-xl px-4 py-2 flex space-x-4 md:space-x-2.5 focus-within:bg-gray-800 duration-200"
				}
			>
				<SearchIcon fill="#A1A1AA" className="my-auto icon" />

				<input
					type="text"
					id="search-input"
					className="text-lg md:text-base text-white bg-transparent w-full focus:outline-none "
					placeholder="Songs and Albums"
					onChange={(event) => {
						getSearchResults(event.target.value)
						setSearchTerm(event.target.value)
					}}
				/>

				<button onClick={clearSearchInput}>
					<CloseIcon style={{ fill: "#A1A1AA" }} className="close-icon" />
				</button>
			</div>

			<div className="space-y-2.5 md:space-y-3">
				{searchResults.map((searchResult, key) => {
					return (
						<div className="space-y-2.5 md:space-y-3" key={key}>
							<div className="px-4">
								{searchResult.album ? (
									<Song track={searchResult} />
								) : (
									<AlbumComponent album={searchResult} />
								)}
							</div>
							{key + 1 !== searchResults.length ? <hr className="border-borderColor" /> : <p/>}
							
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Search
