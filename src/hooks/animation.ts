import { Actions, Events } from "@app/constants";
import { useCallback, useEffect, useState } from "react";

import { useScratchStore } from "@app/store";

interface UseAnimationsProps {
  sprite: string;
  dragged: boolean;
}

export const useAnimations = ({
  sprite,
  dragged,
}: UseAnimationsProps) => {
  const { spriteItemList, spritesPositions, effectiveEvents,
    positionUpdateAllowed,
    togglePositionUpdateAllowed,
    dispatchOnClickEvent,
    completeOnlickEvent,
    completeStartEvent,
    setSpritesPosition,
    detectCollisions,
    cancelAllEvents,
    handleCollision
   } = useScratchStore(
    (state) => state
  );
  const [TriggerEvent, setTriggerEvent] = useState<Events>();
  const [animations, setAnimations] = useState<Actions[]>([]);

  console.log({
    spriteItemList
  })
  // const animations = useMemo(() => {
  //   return (spriteItemList[sprite]?.slice(1) || []) as Actions[]
  // }, [spriteItemList[sprite]]);

  useEffect(() => {
    console.log({
      [sprite]: spriteItemList[sprite]
    })
    const TriggerEvent = spriteItemList[sprite]?.[0] as Events;
    setTriggerEvent(TriggerEvent);
    const animations = spriteItemList[sprite]?.slice(1) as Actions[];
    setAnimations(animations);
  }, [spriteItemList, sprite])

  const [isPlaying, setIsPlaying] = useState(false);

  const completeEvent = useCallback(() => {
    if(TriggerEvent === Events.OnClick) {
      completeOnlickEvent(sprite);
    }else if(TriggerEvent === Events.OnStart) {
      completeStartEvent(sprite);
    }
  }, [completeOnlickEvent, completeStartEvent, TriggerEvent]);

  const togglePlayingOnClick = useCallback(() => {
    if(TriggerEvent === Events.OnClick) {
      dispatchOnClickEvent(sprite);
    }
  }, [TriggerEvent, dispatchOnClickEvent, sprite]);

  useEffect(() => {
    if(TriggerEvent === Events.OnClick && effectiveEvents.onClick.includes(sprite)) {
      setIsPlaying(true);
    }else if(TriggerEvent === Events.OnStart && effectiveEvents.onStart.includes(sprite)) {
      setIsPlaying(true);
    }else {
      setIsPlaying(false);
    }
  }, [TriggerEvent, effectiveEvents]);

  const [currentPosition, setCurrentPosition] = useState({
    x: spritesPositions[sprite].x,
    y: spritesPositions[sprite].y,
    angle: spritesPositions[sprite].angle,
  });

  useEffect(() => {
    if (dragged) {
      setCurrentPosition(spritesPositions[sprite]);
    }
  }, [dragged, spritesPositions, sprite]);

  // This runAllowed state is for updating the currentPosition for first time only

  useEffect(() => {
    if (positionUpdateAllowed) {
      togglePositionUpdateAllowed();
      console.log({currentPosition, newPosition: spritesPositions[sprite]})
      setCurrentPosition(spritesPositions[sprite]);
      console.log("position updated for", sprite)
    }
  }, [spritesPositions[sprite]]);

  const MAX_REPEAT = 5;
  const [executedActions, setExecutedActions]  = useState<Actions[]>([]);
  
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
          for(let count = 0; count < MAX_REPEAT; count++) {
            for (const executedAction of executedActions) {
              if (!isPlaying) return;
              executeAnimation(executedAction); // Ensure to wait for each repeated action
            }
          }
          
          setExecutedActions([]);  // clearing the executed actions
          break;
        default:
          break;
      }

      if(action !== Actions.Repeat) {
        setExecutedActions(executedActions => [...executedActions, action]);
        try {
          const {spriteA, spriteB} = await detectCollisions();
          if (spriteA === sprite) {
            setCurrentPosition(currentPosition => (
              { ...currentPosition, x: currentPosition.x - 100 }
            ))
            // cancelAllEvents();
            // completeEvent();
            if(spriteB)
            handleCollision(spriteA, spriteB);
            // setSpritesPosition(sprite, currentPosition);
            return true;
          }
          
          return false; // collision doesn't happened
        }catch(err) {
          console.error(err);
          alert("error happened")
        }
      }

      return false; // no collision
    },
    [animations, currentPosition, isPlaying, handleCollision]
  );

  return {
    executeAnimation,
    animations,
    currentPosition,
    isPlaying,
    togglePlayingOnClick,
    completeEvent
  };
};
