import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ObjectRow from "../Components/ObjectRow";
import {
  currentPlaybackObjectAtom,
  headerTextAtom,
  queueAtom,
} from "../Global/atoms";

function Timeline() {
  const [queue, setQueue] = useRecoilState(queueAtom);
  const setHeaderText = useSetRecoilState(headerTextAtom);
  const [currentPlaybackObject, setCurrentPlaybackObject] = useRecoilState(
    currentPlaybackObjectAtom
  );
  const [view, setView] = useState("queue");

  useEffect(() => {
    setHeaderText("Timeline");
  });

  let reversedQueue = [...queue];
  reversedQueue.reverse();

  function isInQueue(playbackObject) {
    let currentPosition = -1;

    queue.forEach((object) => {
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
              }
            >
              Queue
            </p>
          </button>

          <button onClick={() => setView("history")}>
            <p
              className={
                "text-lg " +
                (view === "history" ? "text-white" : "text-gray-400")
              }
            >
              History
            </p>
          </button>
        </div>

        {view === "queue" ? (
          <div className="space-y-2.5 md:space-y-3">
            {queue.map((playbackObject, key) => {
              if (isInQueue(playbackObject)) {
                return (
                  <div className="space-y-2.5 md:space-y-3" key={key}>
                    <ObjectRow
                      object={playbackObject.track}
                      playFunction={() =>
                        setCurrentPlaybackObject(playbackObject)
                      }
                    ></ObjectRow>

                    <hr className="border-borderColor" />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="space-y-2.5 md:space-y-3">
            {reversedQueue.map((playbackObject, key) => {
              if (!isInQueue(playbackObject)) {
                return (
                  <div className="space-y-2.5 md:space-y-3" key={key}>
                    <ObjectRow
                      object={playbackObject.track}
                      playFunction={() =>
                        setCurrentPlaybackObject(playbackObject)
                      }
                    ></ObjectRow>

                    <hr className="border-borderColor" />
                  </div>
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
