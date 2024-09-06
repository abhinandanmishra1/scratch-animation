import { useCallback, useEffect } from "react";

import { useAnimations } from "@app/hooks";
import { useScratchStore } from "@app/store";

interface AnimateWrapperProps {
  children: React.ReactNode;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, currentAngle: number) => void;
  sprite: string;
  dragged: boolean;
}

export const AnimateWrapper = ({
  children,
  handleDragStart,
  sprite,
  dragged,
}: AnimateWrapperProps) => {
  const { setSpritesPosition, selectedSprite} = useScratchStore((state) => state);

  const { animations, currentPosition, executeAnimation, isPlaying, togglePlayingOnClick, completeEvent} = useAnimations({
    sprite,
    dragged
  });

  const playAnimations = useCallback(async () => {
    for (const animation of animations) {
      if (!isPlaying) return;
      console.log("Executing animation ", animation, " for ", sprite);
      const collision = await executeAnimation(animation);

      if (collision) {
        setSpritesPosition(sprite, currentPosition);
        completeEvent();
        // return; // animation ended
      }
      console.log("Animation executed");
    }

    setSpritesPosition(sprite, currentPosition);
    completeEvent();
  }, [isPlaying, sprite, completeEvent, animations]);

  useEffect(() => {
    if (isPlaying) {
      playAnimations();
    }
  }, [isPlaying, playAnimations]);

  return (
    <div
      draggable
      id={sprite}
      onClick={togglePlayingOnClick}
      onDragStart={(e) => handleDragStart(e, currentPosition.angle)}
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
