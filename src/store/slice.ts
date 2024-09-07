import { Actions, Events } from "@app/constants";
import { GlobalState, Item, SpritePositionType } from "@app/types";
// src/slices/globalSlice.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { createRef } from "react";

const initialState: GlobalState = {
  ref: createRef<HTMLDivElement>(),
  collisionTime: 0,
  sprites: ["sprite-1"],
  spritesPositions: { "sprite-1": { x: 1000, y: 100, angle: 0 } },
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
  selectedSprite: "sprite-1",
  spriteItemList: {},
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    togglePositionUpdate(state) {
      state.positionUpdateAllowed = !state.positionUpdateAllowed;
    },
    dispatchStartEvent(state) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnStart]: [...state.eventToSprites.onStart],
      };
    },
    completeStartEvent(state, action: PayloadAction<string>) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnStart]: state.effectiveEvents[Events.OnStart].filter(
          (s) => s !== action.payload
        ),
      };
    },
    cancelStartEvent(state) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnStart]: [],
      };
    },
    dispatchOnClickEvent(state, action: PayloadAction<string>) {
      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnClick]: [
          ...state.effectiveEvents.onClick.filter((s) => s !== action.payload),
          action.payload,
        ],
      };
    },
    dispatchCollisionEvent(
      state,
      action: PayloadAction<{
        spriteA: string;
        spriteB: string;
      }>
    ) {
      const currentTime = Date.now();
      const timeDiff = currentTime - state.collisionTime;

      if (timeDiff < 3000) {
        return;
      }

      state.collisionTime = currentTime;
      // add spriteA and spriteB only if they are not present in the array
      if (
        !state.effectiveEvents[Events.OnCollision].includes(
          action.payload.spriteA
        ) &&
        !state.effectiveEvents[Events.OnCollision].includes(
          action.payload.spriteB
        )
      ) {
        state.effectiveEvents = {
          ...state.effectiveEvents,
          [Events.OnCollision]: [
            ...state.effectiveEvents[Events.OnCollision],
            action.payload.spriteA,
            action.payload.spriteB,
          ],
        };
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
        ),
      };
    },
    setSpritePosition(
      state,
      action: PayloadAction<{
        spriteName: string;
        position: Partial<SpritePositionType>;
      }>
    ) {
      state.spritesPositions = {
        ...state.spritesPositions,
        [action.payload.spriteName]: {
          ...state.spritesPositions[action.payload.spriteName],
          ...action.payload.position,
        },
      };
    },
    addSprite(
      state,
      action: PayloadAction<{
        x: number;
        y: number;
        angle: number;
      }>
    ) {
      const newSpriteName = `sprite-${state.sprites.length + 1}`;
      state.sprites.push(newSpriteName);
      state.spritesPositions = {
        ...state.spritesPositions,
        [newSpriteName]: action.payload,
      };
    },
    setSelectedSprite(state, action: PayloadAction<string>) {
      state.selectedSprite = action.payload;
    },
    addItem(state, action: PayloadAction<{ spriteName: string; item: Item }>) {
      const { spriteName, item } = action.payload;
      const { type, payload } = item;
      if (
        !state.spriteItemList[spriteName] ||
        state.spriteItemList[spriteName].length === 0
      ) {
        if (type === Events.OnClick || type === Events.OnStart) {
          state.spriteItemList[spriteName] = [item];
          state.eventToSprites[type] = [
            ...state.eventToSprites[type],
            spriteName,
          ];
        } else {
          alert("First element should be an Event item not an action item");
        }

        return;
      }

      // checking that this item shouldn't be an event
      if (
        state.spriteItemList[spriteName].length > 0 &&
        (type === Events.OnClick || type === Events.OnStart)
      ) {
        alert("Only first item can be an event.");
        return;
      }

      state.spriteItemList[spriteName].push(item);
    },
    updateItem(state, action: PayloadAction<{
      spriteName: string;
      itemIndex: number;
      item: Item;
    }>) {
      const { spriteName, itemIndex, item } = action.payload;
      state.spriteItemList[spriteName][itemIndex] = item;
    },
    removeItem(
      state,
      action: PayloadAction<{ spriteName: string; itemIndex: number }>
    ) {
      const { spriteName, itemIndex } = action.payload;
      if (state.spriteItemList[spriteName]) {
        state.spriteItemList[spriteName].splice(itemIndex, 1);
      }
    },
    handleCollision(
      state,
      action: PayloadAction<{ spriteA: string; spriteB: string }>
    ) {
      const { spriteA, spriteB } = action.payload;
      const SpriteATriggerEvent = (state.spriteItemList[spriteA]?.[0].type ||
        Events.OnStart) as Events;
      const SpriteBTriggerEvent = (state.spriteItemList[spriteB]?.[0].type ||
        Events.OnStart) as Events;
      const spriteAItems = state.spriteItemList[spriteA]?.slice(1) || [];
      const spriteBItems = state.spriteItemList[spriteB]?.slice(1) || [];

      // swapping the subarray starting from index 1
      state.spriteItemList[spriteA] = [
        { type: SpriteATriggerEvent },
        ...spriteBItems,
      ];
      state.spriteItemList[spriteB] = [
        { type: SpriteBTriggerEvent },
        ...spriteAItems,
      ];

      state.effectiveEvents = {
        ...state.effectiveEvents,
        [Events.OnCollision]: [],
      };
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
  updateItem,
  removeItem,
  handleCollision,
} = globalSlice.actions;

export default globalSlice.reducer;
