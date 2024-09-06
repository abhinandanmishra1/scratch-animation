import { Actions, Events } from "@app/constants";

import { DragEvent } from "react";
import { useScratchStore } from "@app/store";

const DragDropList = () => {
  const {
    spriteItemList,
    selectedSprite,
    addItem,
  } = useScratchStore(state => state);

  const spriteItems = spriteItemList[selectedSprite] || [];

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    // get id from data
    const id = e.dataTransfer?.getData("id") as Events | Actions;

    if (!id) return;

    addItem(selectedSprite, id);
  };

  const handleDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer.setData("index", index.toString());
    e.dataTransfer.setData("listName", selectedSprite);
  };

  return (
    <div className="w-1/2 mx-auto mt-10 p-4 border rounded shadow-md bg-gray-100">
      {spriteItems.map((animation, index) => (
        <div
          key={index}
          draggable={
            animation === Actions.GotoXY ||
            animation === Actions.Repeat ||
            animation === Actions.Move10Steps ||
            animation === Actions.Turn15Degrees ||
            spriteItems.length === 1   // this will make to remove the only remaining event item
          }
          onDragStart={(e) => handleDragStart(e, index)}
          className="p-2 border rounded shadow-md cursor-move"
        >
          {animation}
        </div>
      ))}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-green-100 w-full p-10"
      ></div>
    </div>
  );
};

export const DragDropListView = () => {
  const { selectedSprite } = useScratchStore();
  return (
    <div className="w-full">
      <h1 className="text-2xl text-center mt-8">
        Events and Actions List for <b className="text-green-700">{selectedSprite}</b>
      </h1>
      <DragDropList />
    </div>
  );
};
