import { Track } from "../Models/SpotifyModel"
import React, { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
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

function Song(props) {
	const [contextIsActive, setContextIsActive] = useState(false)
	const isDark = useRecoilValue(isDarkAtom)
	const playbackModel = usePlaybackModel()
	const playlistModel = usePlaylistModel()
	const history = useHistory()
	const { index } = props

	const { track, noImage } = props

	useEffect(() => {

		window.addEventListener("scroll", () => {
			console.log("scroll was captured")
		})
	}, [])

	function showContext() {
		const elements = document.getElementsByClassName("context-menu")

		let i
		for (i = 0; i < elements.length; i++) {
			elements[i].style.display = "none"
		}

		setContextIsActive(!contextIsActive)
	}

	function getPosition() {
		const contextButton = document.getElementById(`context-button-${index}`)

		const xpos = contextButton.getBoundingClientRect().left
		const ypos = contextButton.getBoundingClientRect().top

		return { xpos, ypos }
	}

	return (
		<ObjectRow
			object={track}
			playFunction={() => playbackModel.playSong(track)}
			noImage={noImage}
			index={index}
		>
			<button
				id={`context-button-${index}`}
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
		return (
			<div
				id={`context-menu-${index}`}
				className={
					"bg-gray-800 rounded-md px-4 py-3 space-y-2 flex flex-col context-menu " +
					(contextIsActive ? "absolute" : "hidden")
				}
			>
				<MenuRow title = "Add To Queue" clickFunction = {() => playbackModel.addToQueue(track)}/>
				<MenuRow title = "Add To Playlist" clickFunction = {() => playlistModel.addToPlaylist(track)} />
				<MenuRow title = "View Album" clickFunction = {() => {
					history.push(`/album/${track.albumID}`)
				}}/>
				<p >View Artist</p>
			</div>
		)

		function MenuRow(props) {

			const {clickFunction, title} = props

			return (
				<button onClick = {clickFunction} className="hover:bg-gray-700 text-gray-400 text-left ">
					{title}
				</button>
			)
		}
	}
}

export default Song
