import { useEffect, useState } from "react";

import { CatSprite } from "./CatSprite";
import { CgCloseO } from "react-icons/cg";
import { FlagIcon } from "@app/assets";
import { getRandomPositionForNewSprite } from "@app/utils/animation";
import { useAnimations } from "@app/hooks/animation";
import { useScratchStore } from "@app/store";

interface AnimateWrapperProps {
  children: React.ReactNode;
  play: boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  togglePlay: () => void;
  sprite: string;
  dragged: boolean;
}

const AnimateWrapper = ({
  children,
  play,
  handleDragStart,
  sprite,
  togglePlay,
  dragged,
}: AnimateWrapperProps) => {
  const { setSpritesPosition, selectedSprite} = useScratchStore((state) => state);

  const { animations, currentPosition, executeAnimation } = useAnimations({
    sprite,
    play,
    dragged
  });

  const playAnimations = async () => {
    for (const animation of animations) {
      if (!play) return;
      await executeAnimation(animation);
    }

    console.log("toggling")
    togglePlay();
    setSpritesPosition(sprite, currentPosition);
  };

  useEffect(() => {
    if (play) {
      playAnimations();
    }
  }, [play]);

  console.log(play)

  return (
    <div
      draggable
      id={sprite}
      onDragStart={handleDragStart}
      style={{
        top: currentPosition.y,
        left: currentPosition.x,
        transform: `rotate(${currentPosition.angle}deg)`, // Apply rotation based on current angle
        transition: "all 0.5s ease", // Smooth transitions
      }}
      key={sprite}
      className={`absolute border ${
        selectedSprite === sprite
          ? "border-blue-400 shadow-md p-1"
          : "border-transparent"
      }`}
    >
      {children}
    </div>
  );
};
export function PreviewArea() {
  const {
    ref,
    sprites,
    addSprite,
    setSelectedSprite,
    spritesPositions,
    setSpritesPosition,
  } = useScratchStore();

  const [play, setPlay] = useState(false);
  const togglePlay = () => {
    setPlay((prev) => !prev); // Toggle play state when flag icon is clicked
    console.log("toggled")
  };

  useEffect(() => {
    if (ref) setSpritesPosition("sprite-1", getRandomPositionForNewSprite(ref));
  }, [ref]);

  const [draggSprite, setDragSprite] = useState("");
  const [draggedSprite, setDraggedSprite] = useState("");

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drag started");
    setDragSprite(e.currentTarget.id);
    e.dataTransfer.setData("text/plain", `${e.clientX},${e.clientY}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drag ended");
    const offsetX = e.clientX;
    const offsetY = e.clientY;
    const angle = spritesPositions[draggSprite].angle;
    console.log({
      prev: spritesPositions[draggSprite],
      new: { x: offsetX, y: offsetY, angle },
    });
    setSpritesPosition(draggSprite, { x: offsetX, y: offsetY, angle }); // Update position state when dropped
    setDraggedSprite(draggSprite);

    setTimeout(() => {
      setDraggedSprite("");
      setDragSprite("");
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
        {!play && (
          <FlagIcon
            size={32}
            onClick={togglePlay}
            className="cursor-pointer text-green-800 hover:text-green-700"
          />
        )}

        {play && (
          <CgCloseO
            size={32}
            onClick={togglePlay}
            className="cursor-pointer text-red-800 hover:text-red-700"
          />
        )}
      </div>
      <div className="flex">
        {sprites.map((sprite, index) => (
          <AnimateWrapper
            key={sprite}
            play={play}
            handleDragStart={handleDragStart}
            sprite={sprite}
            togglePlay={togglePlay}
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
