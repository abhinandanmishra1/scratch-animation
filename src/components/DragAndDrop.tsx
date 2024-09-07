import { Actions, Events } from "@app/constants";
import { useAppDispatch, useAppSelector } from "@app/hooks";

import { ActionTypeWrapper } from "./ActionType";
import { DragEvent } from "react";
import { addItem } from "@app/store/slice";

const DragDropList = () => {
  const dispatch = useAppDispatch();

  const { spriteItemList, selectedSprite } = useAppSelector(
    (state) => state.global
  );

  const spriteItems = spriteItemList[selectedSprite] || [];

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const type = e.dataTransfer?.getData("type") as Events | Actions;
    const payload = JSON.parse(e.dataTransfer?.getData("payload") || "{}");
    if (!type) return;

    console.log({
      type,
      payload,
    });
    dispatch(
      addItem({
        spriteName: selectedSprite,
        item: {
          type,
          payload,
        },
      })
    );
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", index.toString());
    e.dataTransfer.setData("listName", selectedSprite);
    e.dataTransfer.setData("id", spriteItems[index].type); // Set the item ID here
  };

  return (
    <div className="w-2/3 mx-auto mt-10 p-4 border rounded shadow-md bg-gray-100">
      {spriteItems.map((animation, index) => (
        <ActionTypeWrapper
          draggable={
            (animation.type !== Events.OnStart &&
              animation.type !== Events.OnClick) ||
            spriteItems.length === 1
          }
          handleDragStart={handleDragStart}
          key={selectedSprite + animation.type + index.toString()}
          spriteName={selectedSprite}
          itemIndex={index}
          action={animation}
        />
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
  const selectedSprite = useAppSelector((state) => state.global.selectedSprite);

  return (
    <div className="w-full">
      <h1 className="text-2xl text-center mt-8">
        Events and Actions List for{" "}
        <b className="text-green-700">{selectedSprite}</b>
      </h1>
      <DragDropList />
    </div>
  );
};
