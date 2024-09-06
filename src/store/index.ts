import { Actions, Events } from "@app/constants";

import { create } from "zustand";
import { createRef } from "react";
import { getRandomPositionForNewSprite } from "@app/utils/animation";

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
  addSprite: () => void;
  spritesPositions: SpritesPositions;
  setSpritesPosition: (
    spriteName: string,
    position: SpritePositionType
  ) => void;
  selectedSprite: string;
  setSelectedSprite: (sprite: string) => void;
  spriteItemList: SpriteItemList;
  addItem: (spriteName: string, item: Item) => void;
  removeItem: (spriteName: string, itemIndex: number) => void;
};

export const useScratchStore = create<Store>()((set) => ({
  ref: createRef<HTMLDivElement>(),
  sprites: ["sprite-1"],
  spritesPositions: {
    "sprite-1": { x: 0, y: 0, angle: 0 },
  },
  setSpritesPosition: (spriteName: string, position: SpritePositionType) => {
    console.log(spriteName, position);
    set((state) => ({
      spritesPositions: {
        ...state.spritesPositions,
        [spriteName]: position,
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

      console.log(state.spriteItemList[spriteName])
      const newList = [...state.spriteItemList[spriteName], item];

      console.log(newList)
      const newspriteItemList = {
        ...state.spriteItemList,
        [spriteName]: [...(state.spriteItemList[spriteName]), item],
      };


      console.log({
        spriteItemList: newspriteItemList,
      })
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
}));
