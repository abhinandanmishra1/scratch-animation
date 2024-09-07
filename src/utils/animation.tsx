import { Actions, Events } from "@app/constants";

export const AnimationText = (animation: Events | Actions) => {
  switch (animation) {
    case Events.OnClick:
      return "When this sprite clicked";
    case Actions.Move10Steps:
      return "Move 10 steps";
    case Actions.Turn15Degrees:
      return "Turn 15 degrees";
    case Events.OnStart:
      return <div> When <span></span> is clicked </div>;
    case Actions.GotoXY:
      return "Goto x:___ y:____";
    default:
      return "";
  }
};

export const getRandomPositionForNewSprite = (
  ref: React.RefObject<HTMLDivElement>
) => {
  if (!ref.current) return { x: 0, y: 0, angle: 0 };
  const {
    left = 0,
    top = 0,
    right = 0,
    bottom = 0,
  } = ref.current?.getBoundingClientRect() as {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  // set a position of new sprite at any random position greater inside ref object
  const randomX = left + 100 + Math.floor(Math.random() * (right - left - 200));
  const randomY = top + 100 + Math.floor(Math.random() * (bottom - top - 200));


  return { x: randomX, y: randomY, angle: 0};
};
