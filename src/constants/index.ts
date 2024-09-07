export enum Events {
  OnClick = "onClick",
  OnCollision = "onCollision",
  OnStart = "onStart",
  None = "None"
}

export enum Actions {
  MoveXStepsForward = "Move X steps in right direction",
  MoveXStepsBackward = "Move X steps in left direction",
  TurnXDegreesClockwise = "Turn X degrees in clockwise direction",
  TurnXDegreesAntiClockwise = "Turn X degrees in anti-clockwise direction",
  GotoXY = "Goto x:___ y:____",
  RepeatXTimes = "Repeat",
}
