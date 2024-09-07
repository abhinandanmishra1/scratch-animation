import { Actions, Events } from "@app/constants";
import {
  completeOnClickEvent,
  completeStartEvent,
  dispatchCollisionEvent,
  dispatchOnClickEvent,
  handleCollision,
  setSpritePosition,
  togglePositionUpdate,
} from "@app/store/slice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useCallback, useEffect, useState } from "react";

import { Item } from "@app/types";
import { waitFor } from "@app/utils";

interface UseAnimationsProps {
  sprite: string;
  dragged: boolean;
}

export const useAnimations2 = ({ sprite, dragged }: UseAnimationsProps) => {
  const dispatch = useAppDispatch();
  const sprites = useAppSelector((state) => state.global.sprites);
  const spriteItemList = useAppSelector((state) => state.global.spriteItemList);
  const spritesPositions = useAppSelector(
    (state) => state.global.spritesPositions
  );
  const effectiveEvents = useAppSelector(
    (state) => state.global.effectiveEvents
  );
  const positionUpdateAllowed = useAppSelector(
    (state) => state.global.positionUpdateAllowed
  );

  const [TriggerEvent, setTriggerEvent] = useState<Events>();
  const [animations, setAnimations] = useState<Item[]>([]);

  useEffect(() => {
    const TriggerEvent = spriteItemList[sprite]?.[0]?.type as Events;
    setTriggerEvent(TriggerEvent);
    const animations = spriteItemList[sprite]?.slice(1) || [];
    setAnimations(animations);
  }, [spriteItemList, sprite]);

  const [isPlaying, setIsPlaying] = useState(false);

  const completeEvent = useCallback(() => {
    if (TriggerEvent === Events.OnClick) {
      dispatch(completeOnClickEvent(sprite));
    } else if (TriggerEvent === Events.OnStart) {
      dispatch(completeStartEvent(sprite));
    }
  }, [dispatch, TriggerEvent, sprite]);

  const togglePlayingOnClick = useCallback(() => {
    if (TriggerEvent === Events.OnClick) {
      dispatch(dispatchOnClickEvent(sprite));
    }
  }, [dispatch, TriggerEvent, sprite]);

  useEffect(() => {
    if (
      TriggerEvent === Events.OnClick &&
      effectiveEvents.onClick.includes(sprite)
    ) {
      setIsPlaying(true);
    } else if (
      TriggerEvent === Events.OnStart &&
      effectiveEvents.onStart.includes(sprite)
    ) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [TriggerEvent, effectiveEvents, sprite]);
  const [currentPosition, setCurrentPosition] = useState({
    x: spritesPositions[sprite].x,
    y: spritesPositions[sprite].y,
    angle: spritesPositions[sprite].angle,
  });

  useEffect(() => {
    if (effectiveEvents.onCollision.length == 2) {
      const [spriteA, spriteB] = effectiveEvents.onCollision;
      if (sprite === spriteA) {
        setCurrentPosition((currentPosition) => ({
          ...currentPosition,
          x: spritesPositions[spriteA].x - 200,
          y: spritesPositions[spriteA].y - 200,
        }));

        dispatch(handleCollision({ spriteA, spriteB }));
      }
    }
  }, [effectiveEvents.onCollision, dispatch, setSpritePosition, sprite]);

  useEffect(() => {
    if (dragged) {
      setCurrentPosition(spritesPositions[sprite]);
    }
  }, [dragged, spritesPositions, sprite]);

  useEffect(() => {
    if (positionUpdateAllowed) {
      dispatch(togglePositionUpdate());
      setCurrentPosition(spritesPositions[sprite]);
    }
  }, [spritesPositions, sprite, positionUpdateAllowed, dispatch]);

  const detectCollisions = useCallback(() => {
    const spriteA = sprite;
    for (const sprite of sprites) {
      if (sprite === spriteA) continue;
      const spriteB = sprite;
      const posA = spritesPositions[spriteA];
      const posB = spritesPositions[spriteB];

      // Basic bounding box collision detection
      if (Math.abs(posA.x - posB.x) < 50 && Math.abs(posA.y - posB.y) < 50) {
        return {
          spriteA,
          spriteB,
        };
      }
    }

    return { spriteA, spriteB: null };
  }, [sprites, spritesPositions, sprite]);

  const executeAnimation = useCallback(
    async (action: Item) => {
      const { type, payload } = action;
      switch (type) {
        case Actions.MoveXStepsForward:
          setCurrentPosition((current) => ({
            ...current,
            x: current.x + Number(payload?.steps || "10"),
          }));
          break;
        case Actions.MoveXStepsBackward:
          setCurrentPosition((current) => ({
            ...current,
            x: current.x - Number(payload?.steps || "10"),
          }));
          break;
        case Actions.MoveYStepsDownward:
          setCurrentPosition((current) => ({
            ...current,
            y: current.y + Number(payload?.steps || "10"),
          }));
          break;
        case Actions.MoveYStepsUpward:
          setCurrentPosition((current) => ({
            ...current,
            y: current.y - Number(payload?.steps || "10"),
          }));
          break;
        case Actions.TurnXDegreesClockwise:
          setCurrentPosition((current) => ({
            ...current,
            angle: current.angle + Number(payload?.degrees || "15"),
          }));
          break;
        case Actions.TurnXDegreesAntiClockwise:
          setCurrentPosition((current) => ({
            ...current,
            angle: current.angle - Number(payload?.degrees || "15"),
          }));
          break;
        case Actions.GotoXY:
          setCurrentPosition((current) => ({
            ...current,
            x: Number(payload?.x || "750"),
            y: Number(payload?.y || "50"),
          }));
          break;
        case Actions.RepeatXTimes:
          for (let count = 0; count < Number(payload?.times || "1"); count++) {
            for (const action of animations) {
              await waitFor(200);
              if (!isPlaying) return;
              if (action.type === Actions.RepeatXTimes) break;
              await executeAnimation(action);
            }
          }
          break;
        default:
          break;
      }

      if (type !== Actions.RepeatXTimes) {
        try {
          const { spriteA, spriteB } = detectCollisions();
          if (spriteB) {
            dispatch(dispatchCollisionEvent({ spriteA, spriteB }));
          }

          // return false;
        } catch (err) {
          console.error(err);
          alert("error happened");
        }
      }
    },
    [animations, setCurrentPosition, isPlaying, dispatch, sprite]
  );

  return {
    executeAnimation,
    animations,
    currentPosition,
    isPlaying,
    togglePlayingOnClick,
    completeEvent,
  };
};
