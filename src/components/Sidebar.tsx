import { Actions, Events } from "@app/constants";

import { DragEvent } from "react";
import { DraggableItem } from "@app/blocks";
import { FlagIcon } from "@app/assets";
import { useScratchStore } from "@app/store";

export function Sidebar() {
  const { removeItem } = useScratchStore(state => state);

  const removeItemOnDrag = (e: DragEvent<HTMLDivElement>) => {
    const index = e.dataTransfer?.getData("index");
    const listName = e.dataTransfer?.getData("listName");

    if (!index || !listName) return;

    removeItem(listName, Number(index));
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
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("id", Events.OnStart)} type="event">
        {"When "}
        <FlagIcon size={16} fill="green" />
        {"clicked"}
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("id", Events.OnClick)} type="event">
        {"When this sprite clicked"}
      </DraggableItem>
      <div className="font-bold"> {"Motion"} </div>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("id", Actions.Move10Steps)} type="motion">
        {"Move 10 steps"}
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("id", Actions.Turn15Degrees)} type="motion">
        {"Turn 15 degrees"}
      </DraggableItem>
      <DraggableItem onDragStart={(e) => e.dataTransfer.setData("id", Actions.Repeat)} type="motion">
        {"Repeat"}
      </DraggableItem>
    </div>
  );
}
