import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {SpotifyModel, Album} from "../Models/SpotifyModel";
import {headerTextAtom} from "../Global/atoms";
import ButtonComponent from "../Components/ButtonComponent";
import Song from "../Components/Song";
import {usePlaybackModel} from "../Models/PlaybackModel";
import {useTrackModel} from "../Models/TrackModel";
import { usePlaylistModel, Playlist } from "../Models/PlaylistModel";

function PlaylistView() {
	const setHeaderText = useSetRecoilState(headerTextAtom);
	const {prepareForNewSong, shuffleObjects} = usePlaybackModel();
	const spotifyModel = new SpotifyModel();
    const playlistModel = usePlaylistModel()
	const trackModel = useTrackModel();
	const {playlistID} = useParams();

	const [playlist, setPlaylist] = useState(new Playlist());

	useEffect(() => {

		if (!playlist.title || playlist.id !== playlistID) {
			setHeaderText("");

			//get the playlist
            playlistModel.getPlaylist(playlistID)
		}
	}, [playlistID]);

	function getAlbumYear() {
		const date = new Date(playlist.date);
		return date.getFullYear();
	}

	async function shuffleAlbum() {
		prepareForNewSong();

		const shuffledTracks = shuffleObjects(playlist.tracks);
		console.log({shuffledTracks});

		trackModel.playCollection(shuffledTracks);
	}

	if (playlist.title && playlist.id === playlistID) {
		return (
			<div id="playlist-view" className = "space-y-10">
				<div className="md:flex md:space-x-6 space-y-6 md:space-y-0">

					<div className="my-auto space-y-6">
						<div className = "space-y-3">
							<p className="text text-xl font-semibold text-center md:text-left">{playlist.title}</p>

							<p className="text-gray-400 font-semibold text-center md:text-left">
								{playlist.artist} • {getAlbumYear()}
							</p>
						</div>

						<div className="double-button">
							<ButtonComponent
								text="Play"
								action={() => {
									prepareForNewSong();

									spotifyModel.getAlbumTracks(playlist.id).then((tracks) => {
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
					{playlist.tracks.map((track, key) => {
						return <Song track={track} noImage={true} key={key} index={key} />;
					})}
				</div>
			</div>
		);
	} else {
		return <p></p>;
	}
}

export default PlaylistView;
