import { Actions, Events } from '@app/constants';
// src/slices/globalSlice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RefObject, createRef } from 'react';

import { getRandomPositionForNewSprite } from '@app/utils';

type Item = Events | Actions;

type SpriteItemList = { [spriteName: string]: Item[] };
type SpritePositionType = {
  x: number;
  y: number;
  angle: number;
};
type SpritesPositions = Record<string, SpritePositionType>;

interface GlobalState {
  sprites: string[];
  collisionTime: number;
  ref: React.RefObject<HTMLDivElement>;
  eventToSprites: { [key in Events]: string[] };
  effectiveEvents: { [key in Events]: string[] };
  positionUpdateAllowed: boolean;
  spritesPositions: SpritesPositions;
  selectedSprite: string;
  spriteItemList: SpriteItemList;
}

const initialState: GlobalState = {
  ref: createRef<HTMLDivElement>(),
  collisionTime: 0,
  sprites: ['sprite-1'],
  spritesPositions: { 'sprite-1': { x: 0, y: 0, angle: 0 } },
  positionUpdateAllowed: true,
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
  selectedSprite: 'sprite-1',
  spriteItemList: {},
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    togglePositionUpdate(state) {
      state.positionUpdateAllowed = !state.positionUpdateAllowed;
    },
    // updateRef(state, action: PayloadAction<RefObject<HTMLDivElement>>) {
    //   state.ref.current = action.payload.current;
    // },
    dispatchStartEvent(state) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnStart]: [...state.eventToSprites.onStart],
      }
    },
    completeStartEvent(state, action: PayloadAction<string>) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnStart]: state.effectiveEvents[Events.OnStart].filter((s) => s !== action.payload),
      }
    },
    cancelStartEvent(state) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnStart]: [],
      }
    },
    dispatchOnClickEvent(state, action: PayloadAction<string>) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnClick]: [...state.effectiveEvents.onClick.filter(s => s!==action.payload), action.payload],
      }
    },
    dispatchCollisionEvent(state, action: PayloadAction<{
      spriteA: string;
      spriteB: string
    }>) {
      const currentTime = Date.now();
      const timeDiff = currentTime - state.collisionTime;

      if(timeDiff < 3000) {
        return;
      }

      state.collisionTime = currentTime;
      // add spriteA and spriteB only if they are not present in the array
      if (!state.effectiveEvents[Events.OnCollision].includes(action.payload.spriteA) && !state.effectiveEvents[Events.OnCollision].includes(action.payload.spriteB)) {
        state.effectiveEvents = {
          ...state.effectiveEvents,
          [Events.OnCollision]: [...state.effectiveEvents[Events.OnCollision], action.payload.spriteA, action.payload.spriteB],
        }
      }
    },
    cancelAllEvents(state) {
      state.effectiveEvents = {
        [Events.OnClick]: [],
        [Events.OnStart]: [],
        [Events.OnCollision]: [],
        [Events.None]: [],
      };
    },
    completeOnClickEvent(state, action: PayloadAction<string>) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnClick]: state.effectiveEvents.onClick.filter(
          (s) => s !== action.payload
        )
      };
    },
    setSpritePosition(
      state,
      action: PayloadAction<{ spriteName: string; position: Partial<SpritePositionType> }>
    ) {
      state.spritesPositions ={
        ...state.spritesPositions,
        [action.payload.spriteName]: {
          ...state.spritesPositions[action.payload.spriteName],
          ...action.payload.position,
        },
      };
    },
    addSprite(state) {
      const newSpriteName = `sprite-${state.sprites.length + 1}`;
      state.sprites.push(newSpriteName);
      state.spritesPositions = {
        ...state.spritesPositions,
        [newSpriteName]: getRandomPositionForNewSprite(state.ref as RefObject<HTMLDivElement>),
      }
    },
    setSelectedSprite(state, action: PayloadAction<string>) {
      state.selectedSprite = action.payload;
    },
    addItem(state, action: PayloadAction<{ spriteName: string; item: Item }>) {
      const { spriteName, item } = action.payload;
      if (!state.spriteItemList[spriteName] || state.spriteItemList[spriteName].length === 0) {
        if(item === Events.OnClick || item === Events.OnStart) {
          state.spriteItemList[spriteName] = [item];
          state.eventToSprites[item] = [
            ...state.eventToSprites[item],
            spriteName,
          ];
        }else {
          alert("First element should be an Event item not an action item");
        }

        return;
      }
      // the first item should be an event and update the eventToSprites as well



      // now check that this item shouldn't be an event
      if(state.spriteItemList[spriteName].length>0 && (item === Events.OnClick || item === Events.OnStart)) {
        alert("Only first item can be an event.");
        return;
      }

      state.spriteItemList[spriteName].push(item);
    },
    removeItem(state, action: PayloadAction<{ spriteName: string; itemIndex: number }>) {
      const { spriteName, itemIndex } = action.payload;
      if (state.spriteItemList[spriteName]) {
        state.spriteItemList[spriteName].splice(itemIndex, 1);
      }
    },
    handleCollision(state, action: PayloadAction<{ spriteA: string; spriteB: string }>) {
      const { spriteA, spriteB } = action.payload;
      console.log("handling collision between", {
        spriteA,
        spriteB
      })
      const SpriteATriggerEvent = (state.spriteItemList[spriteA]?.[0] || Events.OnStart) as Events;
      const SpriteBTriggerEvent = (state.spriteItemList[spriteB]?.[0] || Events.OnStart) as Events;
      const spriteAItems = state.spriteItemList[spriteA]?.slice(1) || [];
      const spriteBItems = state.spriteItemList[spriteB]?.slice(1) || [];

      console.log("before", {
        spriteA: [SpriteATriggerEvent, ...spriteBItems],
        spriteB: [SpriteBTriggerEvent, ...spriteAItems],
      })
      // swapping the subarray starting from index 1
      state.spriteItemList[spriteA] = [SpriteATriggerEvent, ...spriteBItems];
      state.spriteItemList[spriteB] = [SpriteBTriggerEvent, ...spriteAItems];

      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnCollision]: [],
      }
      console.log("after", {
        spriteA: state.spriteItemList[spriteA],
        spriteB: state.spriteItemList[spriteB],
      })
    },
  },
});

export const {
  togglePositionUpdate,
  dispatchStartEvent,
  completeStartEvent,
  cancelStartEvent,
  dispatchOnClickEvent,
  dispatchCollisionEvent,
  cancelAllEvents,
  completeOnClickEvent,
  setSpritePosition,
  addSprite,
  setSelectedSprite,
  addItem,
  removeItem,
  handleCollision,
} = globalSlice.actions;

export default globalSlice.reducer;
