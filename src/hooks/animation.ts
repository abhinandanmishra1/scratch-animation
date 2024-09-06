import { useEffect, useState } from "react";

import { Actions } from "@app/constants";
import { useScratchStore } from "@app/store";

interface UseAnimationsProps {
  sprite: string;
  play: boolean;
  dragged: boolean;
}
const waitFor = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

export const useAnimations = ({ sprite, play, dragged}: UseAnimationsProps) => {
  const {
    spriteItemList,
    spritesPositions,
  } = useScratchStore((state) => state);

  const [currentPosition, setCurrentPosition] = useState({
    x: spritesPositions[sprite].x,
    y: spritesPositions[sprite].y,
    angle: spritesPositions[sprite].angle,
  });

  useEffect(() => {
    if (dragged) {
      setCurrentPosition(spritesPositions[sprite]);
    }
  }, [dragged]);

  const [runAllowed, setRunAllowed] = useState(true);

  useEffect(() => {
    if (runAllowed) {
      setRunAllowed(false);
      setCurrentPosition(spritesPositions[sprite]);
    }
  }, [spritesPositions[sprite]]);

  const animations = (spriteItemList[sprite]?.slice(1) || []) as Actions[];

  const MAX_REPEAT = 5;
  let repeatCount = 0;
  const executeAnimation = async (action: Actions) => {
    switch (action) {
      case Actions.Move10Steps:
        setCurrentPosition((current) => ({
          ...current,
          x: current.x + 10,
        }));
        break;
      case Actions.Turn15Degrees:
        setCurrentPosition((current) => ({
          ...current,
          angle: current.angle + 15,
        }));
        break;
      case Actions.GotoXY:
        setCurrentPosition((current) => ({
          ...current,
          x: 100,
          y: 200,
        }));
        break;
      case Actions.Repeat:
        // Here you would need to define how many times to repeat
        console.log(repeatCount);
        if (repeatCount === MAX_REPEAT) break;

        if (repeatCount < MAX_REPEAT) {
          repeatCount++;
        }
        for (const animation of animations) {
          if (!play) return;
          await waitFor(500); // Wait for 500 ms
          executeAnimation(animation); // Ensure to wait for each repeated action
        }
        break;
      default:
        break;
    }
  };

  return {
    executeAnimation,
    animations,
    currentPosition
  }
};
