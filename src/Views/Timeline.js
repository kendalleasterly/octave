import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import ObjectRow from "../Components/ObjectRow"
import { currentPlaybackObjectAtom, queueAtom } from "../Global/atoms"

function Timeline() {
	const [queue, setQueue] = useRecoilState(queueAtom)
	const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(
		currentPlaybackObjectAtom
	)
	const [view, setView] = useState("queue")

	let reversedQueue = [...queue]
	reversedQueue.reverse()

	if (queue.length !== 0) {
		return (
			<div className="space-y-4">
				<div className="flex justify-around">
					<button onClick={() => setView("queue")}>
						<p
							className={
								"text-lg text-" + (view === "queue" ? "accent-1" : "white")
							}
						>
							Queue
						</p>
					</button>

					<button onClick={() => setView("history")}>
						<p
							className={
								"text-lg text-" + (view === "history" ? "accent-1" : "white")
							}
						>
							History
						</p>
					</button>
				</div>

				{view === "queue" ? (
					<div className="space-y-2.5 md:space-y-3">
						{queue.map((playbackObject, key) => {
							if (
								queue.indexOf(playbackObject) >=
								queue.indexOf(currentPlaybackObject)
							) {
								return (
									<div className="space-y-2.5 md:space-y-3">
										<ObjectRow
											key={key}
											object={playbackObject.track}
											playFunction={() =>
												setCurrentPlaybackObject(playbackObject)
											}
										></ObjectRow>

										<hr className="border-borderColor" />
									</div>
								)
							}
						})}
					</div>
				) : (
					<div className="space-y-2.5 md:space-y-3">
						{reversedQueue.map((playbackObject, key) => {
							if (
								queue.indexOf(playbackObject) <
								queue.indexOf(currentPlaybackObject)
							) {
								return (
									<div className="space-y-2.5 md:space-y-3">
										<ObjectRow
											key={key}
											object={playbackObject.track}
											playFunction={() =>
												setCurrentPlaybackObject(playbackObject)
											}
										></ObjectRow>

										<hr className="border-borderColor" />
									</div>
								)
							}
						})}
					</div>
				)}
			</div>
		)
	} else {
		return <p>You have no songs in your queue or history!</p>
	}
}

export default Timeline
