import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import ObjectRow from "../Components/ObjectRow";
import {
	currentPlaybackObjectAtom,
	headerTextAtom,
	queueAtom,
} from "../Global/atoms";
import {usePlaybackModel} from "../Models/PlaybackModel";

function Timeline() {
	const queue = useRecoilValue(queueAtom);
	const setHeaderText = useSetRecoilState(headerTextAtom);
	const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(
		currentPlaybackObjectAtom
	);
	const [view, setView] = useState("queue");
	const playbackModel = usePlaybackModel();
	const queueWithPositions = playbackModel.setPositions(queue);

	useEffect(() => {
		setHeaderText("Timeline");
	});

	let reversedQueue = [...queue];
	reversedQueue.reverse();

	function isInQueue(playbackObject) {
		//first make a local array. then do all of your logic using that one.

		let currentPosition = -1;

		queueWithPositions.forEach((object) => {
			if (object.url === currentPlaybackObject.url) {
				currentPosition = object.position;
			}
		});

		return playbackObject.position >= currentPosition;
	}

	if (queue.length !== 0) {
		return (
			<div className="space-y-4">
				<div className="flex justify-around">
					<button onClick={() => setView("queue")}>
						<p
							className={
								"text-lg " + (view === "queue" ? "text-white" : "text-gray-400")
							}>
							Queue
						</p>
					</button>

					<button onClick={() => setView("history")}>
						<p
							className={
								"text-lg " +
								(view === "history" ? "text-white" : "text-gray-400")
							}>
							History
						</p>
					</button>
				</div>

				{view === "queue" ? (
					<div className="space-y-8">
						{queueWithPositions.map((playbackObject, key) => {
							if (isInQueue(playbackObject)) {
								return (
									<ObjectRow
										object={playbackObject.track}
										index={key}
										playFunction={() =>
											setCurrentPlaybackObject(playbackObject)
										}></ObjectRow>
								);
							}
						})}
					</div>
				) : (
					<div className="space-y-8">
						{queueWithPositions.map((playbackObject, key) => {
							if (!isInQueue(playbackObject)) {
								return (
									<ObjectRow
										object={playbackObject.track}
										index={key}
										playFunction={() =>
											setCurrentPlaybackObject(playbackObject)
										}></ObjectRow>
								);
							}
						})}
					</div>
				)}
			</div>
		);
	} else {
		return (
			<p className="text-gray-400 text-center">
				You have no songs in your queue or history!
			</p>
		);
	}
}

export default Timeline;
