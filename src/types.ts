import { Actions, Events } from "./constants";

export type Item = {
  type: Events | Actions;
  payload?: Record<string, string | number>;
};

export type SpriteItemList = { [spriteName: string]: Item[] };

export type SpritePositionType = {
  x: number;
  y: number;
  angle: number;
};

export type SpritesPositions = Record<string, SpritePositionType>;

export interface GlobalState {
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
