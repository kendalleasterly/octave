import { Track } from "../Models/SpotifyModel"
import React, { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
	contextSelectionAtom,
	currentPlaybackObjectAtom,
	isDarkAtom,
	queueAtom,
} from "../Global/atoms"

import { PlaybackObject, usePlaybackModel } from "../Models/PlaybackModel"
import { useTrackModel } from "../Models/TrackModel"
import ObjectRow from "./ObjectRow"
import { ReactComponent as More } from "../Images/more.svg"
import {
	NotificationObject,
	useNotificationModel,
} from "../Models/NotificationModel"
import CollectionSuccess from "../Images/collection-success.svg"
import CollectionError from "../Images/collection-error.svg"
import { useSpring } from "@react-spring/core"
import { animated } from "@react-spring/web"
import { usePlaylistModel } from "../Models/PlaylistModel"
import { useHistory } from "react-router-dom"
import { accountAtom } from "../Models/AccountModel"

function Song(props) {
	const isDark = useRecoilValue(isDarkAtom)
	const playbackModel = usePlaybackModel()
	const playlistModel = usePlaylistModel()
	const [contextSelection, setContextSelection] =
		useRecoilState(contextSelectionAtom)
	const history = useHistory()
	const { index, track, noImage } = props

	function showContext() {
		// const elements = document.getElementsByClassName("context-menu")
		//
		// let i
		// for (i = 0; i < elements.length; i++) {
		// 	elements[i].style.display = "none"
		// }

		setContextSelection(index)
	}

	function onContextMenu(event) {
		event.preventDefault()
		showContext()
	}

	return (
		<ObjectRow
			object={track}
			playFunction={() => playbackModel.playSong(track)}
			noImage={noImage}
			index={index}
			onContextMenu={onContextMenu}
		>
			<button
				className="my-auto"
				onClick={showContext}
				// onClick={() => playbackModel.addToQueue(track)}
			>
				<More fill={isDark ? "#FFFFFF" : "#3F3F46"} />
			</button>

			<Dropdown />
		</ObjectRow>
	)

	function Dropdown() {
		let playlistsActive = true
		const account = useRecoilValue(accountAtom)

		return (
			<div
				className={
					"flex flex-row absolute " +
					(contextSelection === index ? "block" : "hidden")
				}
			>
				<div className="bg-gray-800 rounded-md py-3 space-y-2 flex flex-col">
					<MenuRow
						title="Add To Queue"
						clickFunction={() => playbackModel.addToQueue(track)}
					/>
					<MenuRow
						title="Add To Playlist"
						clickFunction={() => null}
						onMouseOver={() => console.log("mouse over add to playlist")}
					/>
					<MenuRow
						title="View Album"
						clickFunction={() => {
							history.push(`/album/${track.albumID}`)
						}}
					/>
					<MenuRow title="View Artist" />
				</div>

				<div className="bg-gray-800 rounded-md py-3 space-y-2 flex flex-col flex-none">
					{account.simplePlaylists.map((simplePlaylist, key) => {
						return (
							<MenuRow
								title={simplePlaylist.title}
								clickFunction={() => playlistModel.addToPlaylist(track, simplePlaylist)}
								key = {key}
							/>
						)
					})}
				</div>
			</div>
		)

		function MenuRow(props) {
			const { clickFunction, title, onMouseOver } = props

			return (
				<button
					onClick={clickFunction}
					className="hover:bg-gray-700 text-gray-400 text-left px-4"
					onMouseOver={onMouseOver}
				>
					{title}
				</button>
			)
		}
	}
}

export default Song
