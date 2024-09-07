import { CloseIcon, FlagIcon } from "@app/assets";
import {
  addSprite,
  cancelStartEvent,
  dispatchStartEvent,
  setSelectedSprite,
  setSpritePosition,
} from "@app/store";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useEffect, useRef, useState } from "react";

import { AnimateWrapper } from "./AnimateWrapper";
import { CatSprite } from "@app/blocks";
import { getRandomPositionForNewSprite } from "@app/utils";

export function PreviewArea() {
  const dispatch = useAppDispatch();
  const divRef = useRef(null);
  // const ref = useAppSelector((state) => state.global.ref);
  const sprites = useAppSelector((state) => state.global.sprites);
  const effectiveEvents = useAppSelector((state) => state.global.effectiveEvents);

  useEffect(() => {
    if (divRef.current) {
      dispatch(setSpritePosition({ spriteName: "sprite-1", position: getRandomPositionForNewSprite(divRef) }));
    }
  }, [divRef.current, dispatch]);

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

    dispatch(setSpritePosition({ spriteName: spriteId, position: { x: offsetX, y: offsetY, angle } }));
    setDraggedSprite(spriteId);

    setTimeout(() => {
      setDraggedSprite("");
    }, 100);
  };

  return (
    <div
      ref={divRef}
      className="flex-none h-full overflow-y-auto p-2 bg-green-100 w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex gap-2 items-center">
        <button
          onClick={() => dispatch(addSprite())}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
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
      <div className="flex">
        {sprites.map((sprite, index) => (
          <AnimateWrapper
            key={sprite}
            handleDragStart={handleDragStart}
            sprite={sprite}
            dragged={draggedSprite === sprite}
          >
            <p className="text-center text-yellow-500">s-{index + 1}</p>
            <CatSprite
              key={index}
              spriteName={sprite}
              setSelectedSprite={(spriteName) => dispatch(setSelectedSprite(spriteName))}
            />
          </AnimateWrapper>
        ))}
      </div>
    </div>
  );
}
