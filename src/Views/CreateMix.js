import React, {useEffect, useState} from "react";
import {useSetRecoilState, useRecoilState} from "recoil";
import {headerTextAtom, searchTermAtom} from "../Global/atoms";
import {useSpotifyModel} from "../Models/SpotifyModel";

import Song from "../Components/Song";

import {ReactComponent as SearchIcon} from "../Images/search.svg";
import {ReactComponent as CloseIcon} from "../Images/close.svg";



function CreateMix() {
	const [oldSearchTerm, setOldSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom);
	const setHeaderText = useSetRecoilState(headerTextAtom);
	const spotifyModel = useSpotifyModel();

	useEffect(() => {
		document.getElementById("search-input").focus();

		setHeaderText("New Mix");

		if (searchTerm !== "") {
			document.getElementById("search-input").value = searchTerm;
			getSearchResults(searchTerm);
		}
	}, [setHeaderText]);

	function getSearchResults(searchTerm) {
		if (searchTerm !== "") {
			if (searchTerm.length >= 3 && searchTerm.trim() !== oldSearchTerm) {
				spotifyModel
					.getToken()
					.then(async (token) => {
						const results = await spotifyModel.fetchSearchResults(
							token,
							searchTerm,
                            true
						);

						setSearchResults(results);

						setOldSearchTerm(searchTerm);
					})
					.catch((err) => {
						console.log("error getting search results was: " + err);
					});
			}
		} else {
			setSearchResults([]);
		}
	}

	function clearSearchInput() {
		const searchField = document.getElementById("search-input");

		searchField.value = "";
		setSearchResults([]);
		searchField.focus();
	}

    function addTrackToMix(track) {

    }

	return (
		<div className="space-y-8">
			<div
				className={
					"bg-gray-100 dark:bg-gray-800 rounded-2xl md:rounded-xl px-4 py-2 flex space-x-4 md:space-x-2.5 focus-within:bg-gray-50 dark:focus-within:bg-gray-700 duration-200"
				}>
				<SearchIcon fill="#A1A1AA" className="my-auto icon" />

				<input
					type="text"
					id="search-input"
					className="bg-transparent w-full text font-normal focus:outline-none "
					placeholder="Songs"
					onChange={(event) => {
						getSearchResults(event.target.value);
						setSearchTerm(event.target.value);
					}}
				/>

				<button onClick={clearSearchInput}>
					<CloseIcon style={{fill: "#A1A1AA"}} className="close-icon" />
				</button>
			</div>

			<div className="space-y-8">
				{searchResults.map((searchResult, key) => {
					return <Song 
                    index = {key}
                    key = {key}
                    track = {searchResult}
                    onClickFunction = {() => addTrackToMix(searchResult)} 
                    />;
				})}
			</div>
		</div>
	);
}

export default CreateMix;
