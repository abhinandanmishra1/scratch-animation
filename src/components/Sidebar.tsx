import { Actions, Events } from "@app/constants";

import { DragEvent } from "react";
import { DraggableItem } from "@app/blocks";
import { FlagIcon } from "@app/assets";
import { removeItem } from "@app/store/slice";
import { useAppDispatch } from "@app/hooks";

export function Sidebar() {
  const dispatch = useAppDispatch();
  const removeItemOnDrag = (e: DragEvent<HTMLDivElement>) => {
    const index = e.dataTransfer?.getData("index");
    const listName = e.dataTransfer?.getData("listName");

    if (!index || !listName) return;

    dispatch(removeItem({ spriteName: listName, itemIndex: Number(index) }));
  };
  
  return (
    <div
      onDrop={removeItemOnDrag}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      id="sidebar"
      className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
    >
      <div className="font-bold"> {"Events"} </div>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Events.OnStart)} type="event">
        {"When "}
        <FlagIcon size={16} fill="green" />
        {"clicked"}
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Events.OnClick)} type="event">
        {"When this sprite clicked"}
      </DraggableItem>
      <div className="font-bold"> {"Motion"} </div>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Actions.MoveXStepsForward)} type="action">
        Move X steps forward
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Actions.MoveXStepsBackward)} type="action">
        Move X steps backward
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Actions.TurnXDegreesClockwise)} type="action">
        Turn X degrees clockwise
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Actions.TurnXDegreesAntiClockwise)} type="action">
        Turn X degrees anti-clockwise
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Actions.GotoXY)} type="action">
        Go to position X and Y
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("type", Actions.RepeatXTimes)} type="action">
        {"Repeat"}
      </DraggableItem>
    </div>
  );
}
