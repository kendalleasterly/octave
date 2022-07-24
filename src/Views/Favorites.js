import React, {useEffect, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {headerTextAtom} from "../Global/atoms";
import {accountAtom} from "../Models/AccountModel";

function Favorites() {
	const setHeaderText = useSetRecoilState(headerTextAtom);
	const account = useRecoilValue(accountAtom);

	const [saved, setSaved] = useState([]);

	useEffect(() => {
		setHeaderText("Favorites");
		//
	}, []);

	useEffect(() => {

    
  }, [account.savedTracks]);

	return (
		<div id="stuff">
			<div>
				{saved.map((savedTrack, key) => {
					// <p key={key}>{savedTrack.id} {savedTrack.dateAdded}</p>
					return <p key={key}>yes</p>;
				})}
			</div>
		</div>
	);
}

export default Favorites;
