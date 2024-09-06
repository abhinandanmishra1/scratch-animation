import { Actions, Events } from "@app/constants";

import { create } from "zustand";
import { createRef } from "react";
import { getRandomPositionForNewSprite } from "@app/utils";

type Item = Events | Actions;

type SpriteItemList = { [spriteName: string]: Item[] };
type SpritePositionType = {
  x: number;
  y: number;
  angle: number;
};
type SpritesPositions = Record<string, SpritePositionType>;

type Store = {
  sprites: string[];
  ref: React.RefObject<HTMLDivElement>;
  eventToSprites: {
    [key in Events]: string[];
  };
  effectiveEvents: {
    [key in Events]: string[];
  };
  positionUpdateAllowed: boolean;
  togglePositionUpdateAllowed: () => void;
  dispatchStartEvent: () => void;
  cancelStartEvent: () => void;
  dispatchOnClickEvent: (sprite: string) => void;
  completeOnlickEvent: (sprite: string) => void;
  completeStartEvent: (sprite: string) => void;
  cancelAllEvents: () => void;
  addSprite: () => void;
  spritesPositions: SpritesPositions;
  setSpritesPosition: (
    spriteName: string,
    position: Partial<SpritePositionType>
  ) => void;
  selectedSprite: string;
  setSelectedSprite: (sprite: string) => void;
  spriteItemList: SpriteItemList;
  addItem: (spriteName: string, item: Item) => void;
  removeItem: (spriteName: string, itemIndex: number) => void;
  detectCollisions: () => Promise<{
    spriteA: string | null,
    spriteB: string |  null
  }>;
  handleCollision: (spriteA: string, spriteB: string) => void;
};

export const useScratchStore = create<Store>()((set) => ({
  ref: createRef<HTMLDivElement>(),
  sprites: ["sprite-1"],
  spritesPositions: {
    "sprite-1": { x: 0, y: 0, angle: 0 },
  },
  positionUpdateAllowed: true,
  togglePositionUpdateAllowed: () =>
    set((state) => ({ positionUpdateAllowed: !state.positionUpdateAllowed })),
  eventToSprites: {
    [Events.OnClick]: [],
    [Events.OnStart]: [],
    [Events.OnCollision]: [],
    [Events.None]: [],
  },
  effectiveEvents: {
    [Events.OnClick]: [],
    [Events.OnStart]: [],
    [Events.OnCollision]: [],
    [Events.None]: [],
  },
  dispatchStartEvent: () => {
    set({
      effectiveEvents: {
        ...useScratchStore.getState().effectiveEvents,
        [Events.OnStart]: useScratchStore.getState().eventToSprites.onStart,
      },
    });
  },
  completeStartEvent: (sprite: string) => {
    set({
      effectiveEvents: {
        ...useScratchStore.getState().effectiveEvents,
        [Events.OnStart]: useScratchStore
          .getState()
          .effectiveEvents.onStart.filter((s:string) => s !== sprite),
      },
    });
  },
  cancelStartEvent: () => {
    set({
      effectiveEvents: {
        ...useScratchStore.getState().effectiveEvents,
        [Events.OnStart]: [],
      },
    });
  },
  dispatchOnClickEvent: (sprite: string) => {
    set({
      effectiveEvents: {
        ...useScratchStore.getState().effectiveEvents,
        [Events.OnClick]: [
          ...useScratchStore
            .getState()
            .effectiveEvents.onClick.filter((s: string) => s !== sprite),
          sprite,
        ],
      },
    });
  },
  cancelAllEvents: () => {
    set({
      effectiveEvents: {
        [Events.OnClick]: [],
        [Events.OnStart]: [],
        [Events.OnCollision]: [],
        [Events.None]: [],
      }
    })
  },
  completeOnlickEvent: (sprite: string) => {
    set({
      effectiveEvents: {
        ...useScratchStore.getState().effectiveEvents,
        [Events.OnClick]: useScratchStore
          .getState()
          .effectiveEvents.onClick.filter((s:string) => s !== sprite),
      },
    });
  },
  setSpritesPosition: (
    spriteName: string,
    position: Partial<SpritePositionType>
  ) => {
    set((state) => ({
      spritesPositions: {
        ...state.spritesPositions,
        [spriteName]: {
          ...state.spritesPositions[spriteName],
          ...position,
        },
      },
    }));
  },
  addSprite: () => {
    set((state) => {
      const spriteName = `sprite-${state.sprites.length + 1}`;
      const newSprites = [...state.sprites, spriteName];
      return {
        sprites: newSprites,
        spritesPositions: {
          ...state.spritesPositions,
          [spriteName]: getRandomPositionForNewSprite(state.ref),
        },
      };
    });
  },
  selectedSprite: "sprite-1",
  setSelectedSprite: (sprite: string) => {
    set({ selectedSprite: sprite });
  },
  spriteItemList: {},
  addItem: (spriteName: string, item: Item) => {
    set((state) => {
      // first element of the list must be onClick or onStart either of them
      if (!state.spriteItemList[spriteName]) {
        if (item === Events.OnClick || item === Events.OnStart) {
          return {
            spriteItemList: {
              ...state.spriteItemList,
              [spriteName]: [item],
            },
            eventToSprites: {
              ...state.eventToSprites,
              [item]: [...state.eventToSprites[item], spriteName],
            },
          };
        } else {
          alert("First element should be an Event item not an action item");
          return state;
        }
      }

      // if list is not empty and item is of events type then return
      if (
        state.spriteItemList[spriteName]?.length > 0 &&
        (item === Events.OnClick || item === Events.OnStart)
      ) {
        alert("Only first item can be an event.");
        return state;
      }

      const newspriteItemList = {
        ...state.spriteItemList,
        [spriteName]: [...state.spriteItemList[spriteName], item],
      };

      return {
        spriteItemList: newspriteItemList,
      };
    });
  },
  removeItem: (spriteName: string, itemIndex: number) => {
    set((state) => {
      const newspriteItemList = {
        ...state.spriteItemList,
        [spriteName]: state.spriteItemList[spriteName].filter(
          (_, i) => i !== itemIndex
        ),
      };
      return {
        spriteItemList: newspriteItemList,
      };
    });
  },
  detectCollisions: async () => {
    const { spritesPositions, sprites } =
      useScratchStore.getState() as Store;

    // Detect collisions between all sprites
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const spriteA = sprites[i];
        const spriteB = sprites[j];

        const posA = spritesPositions[spriteA];
        const posB = spritesPositions[spriteB];

        // Basic bounding box collision detection
        if (
          Math.abs(posA.x - posB.x) < 50 && // Assuming 50 as sprite width
          Math.abs(posA.y - posB.y) < 50 // Assuming 50 as sprite height
        ) {
          return {
            spriteA,
            spriteB
          };
        }
      }
    }

    return {
      spriteA: null,
      spriteB: null
    };
  },
    
  //   set((state) => {
  //     const spriteAItems = state.spriteItemList[spriteA] || [];
  //     const spriteBItems = state.spriteItemList[spriteB] || [];

  //     const SpriteATriggerEvent = (spriteAItems?.[0] || Events.None) as Events;
  //     const SpriteBTriggerEvent = (spriteBItems?.[0] || Events.None) as Events;

  //     const spriteItemList = {
  //       ...state.spriteItemList,
  //       [spriteA]: spriteBItems,
  //       [spriteB]: spriteAItems,
  //     };

  //     // we need to remove the sprite from it's original effective events and add to new swapped ones

  //     // Update the effective events
  //     console.log("before");
  //     console.log(state.effectiveEvents);
  //     // const effectiveEvents = {
  //     //   ...state.effectiveEvents,
  //     //   [SpriteATriggerEvent]: [
  //     //     ...(state.effectiveEvents[SpriteATriggerEvent]?.filter(
  //     //       (s) => s !== spriteA
  //     //     ) || []),
  //     //     spriteB,
  //     //   ],
  //     //   [SpriteBTriggerEvent]: [
  //     //     ...(state.effectiveEvents[SpriteBTriggerEvent]?.filter(
  //     //       (s) => s !== spriteB
  //     //     ) || []),
  //     //     spriteA,
  //     //   ],
  //     // };


  //     console.log({
  //       spriteItemList,
  //       // effectiveEvents,
  //     })
  //     // after handling the collisons the position should be changed
  //     // otherwise it would make the colliison forevr
  //     return {
  //       spriteItemList,
  //       // effectiveEvents,
  //     };
  //   });
  // },
  handleCollision: (spriteA: string, spriteB: string) => {
    set((state) => {
      const SpriteATriggerEvent = (state.spriteItemList[spriteA]?.[0] || Events.OnStart) as Events;
      const SpriteBTriggerEvent = (state.spriteItemList[spriteB]?.[0] || Events.OnStart) as Events;
      const spriteAItems = state.spriteItemList[spriteA]?.slice(1) || [];
      const spriteBItems = state.spriteItemList[spriteB]?.slice(1) || [];
      
      return {
        spriteItemList: {
          ...state.spriteItemList,
          [spriteA]: [SpriteATriggerEvent, ...spriteBItems],
          [spriteB]: [SpriteBTriggerEvent, ...spriteAItems],
        }
      };
    });
  },
  
}));
