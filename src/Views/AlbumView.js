import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {SpotifyModel, Album} from "../Models/SpotifyModel";
import {headerTextAtom} from "../Global/atoms";
import ButtonComponent from "../Components/ButtonComponent";
import Song from "../Components/Song";
import {usePlaybackModel} from "../Models/PlaybackModel";
import {useTrackModel} from "../Models/TrackModel";

function AlbumView() {
	const setHeaderText = useSetRecoilState(headerTextAtom);
	const {prepareForNewSong, shuffleObjects} = usePlaybackModel();
	const spotifyModel = new SpotifyModel();
	const trackModel = useTrackModel();
	const {albumID} = useParams();

	const [album, setAlbum] = useState(new Album());

	useEffect(() => {
		const spotifyModel = new SpotifyModel();

		if (!album.title || album.id !== albumID) {
			setHeaderText("");

			spotifyModel.getAlbum(albumID).then((fetchedAlbum) => {

				setAlbum(fetchedAlbum);

			});
		}
	}, [albumID]);

	function getAlbumYear() {
		const date = new Date(album.date);
		return date.getFullYear();
	}

	async function shuffleAlbum() {
		prepareForNewSong();

		const shuffledTracks = shuffleObjects(album.tracks);
		console.log({shuffledTracks});

		trackModel.playCollection(shuffledTracks);
	}

	if (album.title && album.id === albumID) {
		return (
			<div id="album-view" className = "space-y-10">
				<div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
					<img src={album.artwork} alt="" className="md:w-60 md:h-60 rounded-xl mx-auto md:mx-0" />

					<div className="my-auto space-y-6">
						<div className = "space-y-3">
							<p className="text text-xl font-semibold text-center md:text-left">{album.title}</p>

							<p className="text-gray-400 font-semibold text-center md:text-left">
								{album.artist} • {getAlbumYear()}
							</p>
						</div>

						<div className="double-button">
							<ButtonComponent
								text="Play"
								action={() => {
									prepareForNewSong();

									spotifyModel.getAlbumTracks(album.id).then((tracks) => {
										trackModel.playCollection(tracks);
									});
								}}
							/>
							<p></p>
							<ButtonComponent text="Shuffle" action={shuffleAlbum} />
						</div>
					</div>
				</div>

				<div className="space-y-8">
					{album.tracks.map((track, key) => {
						return <Song track={track} noImage={true} key={key} index={key} />;
					})}
				</div>
			</div>
		);
	} else {
		return <p></p>;
	}
}

export default AlbumView;
