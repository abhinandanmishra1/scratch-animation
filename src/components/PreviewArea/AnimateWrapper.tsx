import { useAnimations2, useAppDispatch, useAppSelector } from "@app/hooks";
import { useCallback, useEffect } from "react";

import { setSpritePosition } from "@app/store";

interface AnimateWrapperProps {
  children: React.ReactNode;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, currentAngle: number) => void;
  sprite: string;
  dragged: boolean;
  highLightSelectedSprite: boolean;
}

export const AnimateWrapper = ({
  children,
  handleDragStart,
  sprite,
  dragged,
  highLightSelectedSprite
}: AnimateWrapperProps) => {
  const dispatch = useAppDispatch();
  const selectedSprite = useAppSelector((state) => state.global.selectedSprite);

  const { animations, currentPosition, executeAnimation, isPlaying, togglePlayingOnClick, completeEvent} = useAnimations2({
    sprite,
    dragged,
  });

  const playAnimations = useCallback(async () => {
    for (const animation of animations) {
      if (!isPlaying) return;
      await executeAnimation(animation);
    }

    dispatch(setSpritePosition({ spriteName: sprite, position: currentPosition }));
    completeEvent();
  }, [isPlaying, sprite, currentPosition]);

  useEffect(() => {
    if (isPlaying) {
      playAnimations();
    }
  }, [isPlaying]);

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
        transition: "all 0.1s ease", // Smooth transitions
      }}
      key={sprite}
      className={`absolute border p-1 py-2 rounded-md ${
        selectedSprite === sprite && highLightSelectedSprite ? "border-yellow-400 bg-yellow-100" : "border-transparent"
      }`}
    >
      {children}
    </div>
  );
};
