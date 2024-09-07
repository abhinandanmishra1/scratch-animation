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
  const [animations, setAnimations] = useState<Actions[]>([]);

  useEffect(() => {
    const TriggerEvent = spriteItemList[sprite]?.[0] as Events;
    setTriggerEvent(TriggerEvent);
    const animations = spriteItemList[sprite]?.slice(1) as Actions[];
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
      console.log("useffect triggered", {
        sprite,
        TriggerEvent,
        collision: effectiveEvents.onCollision,
      });
      const [spriteA, spriteB] = effectiveEvents.onCollision || ["1", "2"];
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

    for (let sprite of sprites) {
      if (sprite === spriteA) continue;
      const spriteB = sprite; 
      const posA = spritesPositions[spriteA];
      const posB = spritesPositions[spriteB];

      // Basic bounding box collision detection
      if (
        Math.abs(posA.x - posB.x) < 50 && 
        Math.abs(posA.y - posB.y) < 50
      ) {
        return {
          spriteA,
          spriteB,
        };
      }
    }

    return { spriteA, spriteB: null };
  }, [sprite, currentPosition, spritesPositions]);

  const MAX_REPEAT = 5;
  const [executedActions, setExecutedActions] = useState<Actions[]>([]);

  const executeAnimation = useCallback(
    async (action: Actions) => {
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
          for (let count = 0; count < MAX_REPEAT; count++) {
            for (const executedAction of executedActions) {
              if (!isPlaying) return;
              executeAnimation(executedAction);
            }
          }
          setExecutedActions([]);
          break;
        default:
          break;
      }

      if (action !== Actions.Repeat) {
        setExecutedActions((executedActions) => [...executedActions, action]);
        try {
          const { spriteA, spriteB } = detectCollisions();
          if (spriteB) {
            dispatch(dispatchCollisionEvent({ spriteA, spriteB }));
            return false;
          }

          return false;
        } catch (err) {
          console.error(err);
          alert("error happened");
        }
      }

      return false;
    },
    [
      animations,
      setCurrentPosition,
      isPlaying,
      executedActions,
      setExecutedActions,
      dispatch,
      sprite,
    ]
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
