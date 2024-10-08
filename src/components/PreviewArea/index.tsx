import { CloseIcon, FlagIcon } from "@app/assets";
import {
  addSprite,
  cancelStartEvent,
  dispatchStartEvent,
  setSelectedSprite,
  setSpritePosition,
} from "@app/store";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useEffect, useState } from "react";

import { AnimateWrapper } from "./AnimateWrapper";
import { CatSprite } from "@app/blocks";
import { Tooltip } from "@app/blocks";
import { getRandomPositionForNewSprite } from "@app/utils";
import { useScratchStore } from "@app/store/zustand";

export function PreviewArea() {
  const dispatch = useAppDispatch();
  const ref = useScratchStore((state) => state.ref);
  const sprites = useAppSelector((state) => state.global.sprites);
  const effectiveEvents = useAppSelector(
    (state) => state.global.effectiveEvents
  );

  const [highLightSelectedSprite, setHighLightSelectedSprite] = useState(true);

  const toggleHighlight = () => {
    setHighLightSelectedSprite(
      (highLightSelectedSprite) => !highLightSelectedSprite
    );
  };
  useEffect(() => {
    if (ref && ref.current !== null) {
      dispatch(
        setSpritePosition({
          spriteName: "sprite-1",
          position: getRandomPositionForNewSprite(
            ref.current.getBoundingClientRect()
          ),
        })
      );
    }
  }, [ref.current, dispatch]);

  const [draggedSprite, setDraggedSprite] = useState("");

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    currentAngle: number
  ) => {
    e.dataTransfer.setData("draggSprite", e.currentTarget.id);
    e.dataTransfer.setData("currentAngle", currentAngle.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const offsetX = e.clientX;
    const offsetY = e.clientY;
    const spriteId = e.dataTransfer.getData("draggSprite");
    const angle = Number(e.dataTransfer.getData("currentAngle") || "0");

    dispatch(
      setSpritePosition({
        spriteName: spriteId,
        position: { x: offsetX, y: offsetY, angle },
      })
    );
    setDraggedSprite(spriteId);

    setTimeout(() => {
      setDraggedSprite("");
    }, 100);
  };

  return (
    <div
      ref={ref}
      className="flex-none h-full overflow-y-auto p-2 bg-white w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              if (!ref.current) return;
              const boundingRect = ref.current.getBoundingClientRect();
              const position = getRandomPositionForNewSprite(boundingRect);
              dispatch(addSprite(position));
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Sprite
          </button>
          {effectiveEvents.onStart.length === 0 && (
            <FlagIcon
              size={32}
              onClick={() => dispatch(dispatchStartEvent())}
              className="cursor-pointer text-green-800 hover:text-green-700"
            />
          )}

          {effectiveEvents.onStart.length > 0 && (
            <CloseIcon
              size={32}
              onClick={() => dispatch(cancelStartEvent())}
              className="cursor-pointer text-red-800 hover:text-red-700"
            />
          )}
        </div>
        {/* create a toggle input button to highlight/nonhiglight selected sprite */}

        <Tooltip id="highlightbutton" content="Highlight selected sprite">
          <label className="inline-flex items-center cursor-pointer bg-transparent">
            <input type="checkbox" onChange={toggleHighlight} checked={highLightSelectedSprite} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </Tooltip>
      </div>
      <div className="flex">
        {sprites.map((sprite, index) => (
          <AnimateWrapper
            key={sprite}
            handleDragStart={handleDragStart}
            sprite={sprite}
            highLightSelectedSprite={highLightSelectedSprite}
            dragged={draggedSprite === sprite}
          >
            <p className="text-center text-yellow-500">s-{index + 1}</p>
            <CatSprite
              key={index}
              spriteName={sprite}
              setSelectedSprite={(spriteName) =>
                dispatch(setSelectedSprite(spriteName))
              }
            />
          </AnimateWrapper>
        ))}
      </div>
    </div>
  );
}
