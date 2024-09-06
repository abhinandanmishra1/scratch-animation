import { CloseIcon, FlagIcon } from "@app/assets";
import { useCallback, useEffect, useState } from "react";

import { AnimateWrapper } from "./AnimateWrapper";
import { CatSprite } from "@app/blocks";
import { Events } from "@app/constants";
import { getRandomPositionForNewSprite } from "@app/utils";
import { useScratchStore } from "@app/store";

export function PreviewArea() {
  const {
    ref,
    sprites,
    addSprite,
    setSelectedSprite,
    setSpritesPosition,
    dispatchStartEvent,
    cancelStartEvent,
    completeStartEvent,
    effectiveEvents
  } = useScratchStore();

  useEffect(() => {
    if (ref) setSpritesPosition("sprite-1", getRandomPositionForNewSprite(ref));
  }, [ref]);

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

    setSpritesPosition(spriteId, { x: offsetX, y: offsetY, angle }); // Update position state when dropped
    setDraggedSprite(spriteId);

    setTimeout(() => {
      setDraggedSprite("");
    }, 100);
  };

  return (
    <div
      ref={ref}
      className="flex-none h-full overflow-y-auto p-2 bg-green-100 w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex gap-2 items-center">
        <button
          onClick={addSprite}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Add Sprite
        </button>
        {effectiveEvents.onStart.length === 0 && (
          <FlagIcon
            size={32}
            onClick={dispatchStartEvent}
            className="cursor-pointer text-green-800 hover:text-green-700"
          />
        )}

        {effectiveEvents.onStart.length > 0 && (
          <CloseIcon
            size={32}
            onClick={cancelStartEvent}
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
              setSelectedSprite={setSelectedSprite}
            />
          </AnimateWrapper>
        ))}
      </div>
    </div>
  );
}
