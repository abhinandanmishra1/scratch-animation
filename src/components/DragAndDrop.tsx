import { Actions, Events } from "@app/constants";
import { useAppDispatch, useAppSelector } from "@app/hooks";

import { DragEvent } from "react";
import {
  addItem,
} from "@app/store/slice";

const DragDropList = () => {
  const dispatch = useAppDispatch();

  const {
    spriteItemList,
    selectedSprite,
  } = useAppSelector(state => state.global);

  const spriteItems = spriteItemList[selectedSprite] || [];

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const id = e.dataTransfer?.getData("id") as Events | Actions;

    if (!id) return;

    dispatch(addItem({ spriteName: selectedSprite, item: id }));
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", index.toString());
    e.dataTransfer.setData("listName", selectedSprite);
    e.dataTransfer.setData("id", spriteItems[index]); // Set the item ID here
  };

  return (
    <div className="w-2/3 mx-auto mt-10 p-4 border rounded shadow-md bg-gray-100">
      {spriteItems.map((animation, index) => (
        <div
          key={index}
          draggable={
            animation === Actions.GotoXY ||
            animation === Actions.Repeat ||
            animation === Actions.Move10Steps ||
            animation === Actions.Turn15Degrees ||
            spriteItems.length === 1
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
  const selectedSprite = useAppSelector(state => state.global.selectedSprite)

  return (
    <div className="w-full">
      <h1 className="text-2xl text-center mt-8">
        Events and Actions List for <b className="text-green-700">{selectedSprite}</b>
      </h1>
      <DragDropList />
    </div>
  );
};
