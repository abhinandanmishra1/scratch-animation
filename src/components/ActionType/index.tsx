import { Actions, Events } from "@app/constants";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";

import { Item } from "@app/types";
import { updateItem } from "@app/store";
import { useAppDispatch } from "@app/hooks";
import { useScratchStore } from "@app/store/zustand";

interface ActionTypeProps {
  action: Item;
  itemIndex: number;
  spriteName: string;
}

const ActionType = ({
  action,
  itemIndex,
  spriteName,
}: ActionTypeProps) => {
  const dispatch = useAppDispatch();
  const ref = useScratchStore((state) => state.ref);

  const getPayloadInitialState = (type: Actions | Events) => {
    const payload: Record<string, string | number> = {};
    if (
      type === Actions.MoveXStepsForward ||
      type === Actions.MoveXStepsBackward
    ) {
      payload.steps = action.payload?.steps || 1;
    }

    if (
      type === Actions.TurnXDegreesClockwise ||
      type === Actions.TurnXDegreesAntiClockwise
    ) {
      payload.degrees = action.payload?.degrees || 15;
    }

    if (type === Actions.GotoXY) {
      const boundingRect = ref.current?.getBoundingClientRect();
      payload.x = action.payload?.x || (boundingRect?.x || 0) + 10;
      payload.y = action.payload?.y || (boundingRect?.y || 0) + 10;
    }

    if (type === Actions.RepeatXTimes) {
      payload.times = action.payload?.times || 1;
    }

    return payload;
  };

  const [payload, setPayload] = useState<Record<string, string | number>>(
    getPayloadInitialState(action.type)
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPayload((payload) => ({
      ...payload,
      [name]: value,
    }));
  };

  useEffect(() => {
    dispatch(
      updateItem({
        spriteName,
        itemIndex,
        item: {
          ...action,
          payload,
        },
      })
    );
  }, [payload]);

  const { type } = action;

  const steps = Number(payload?.steps || "0");

  if (
    type === Actions.MoveXStepsForward ||
    type === Actions.MoveXStepsBackward
  ) {
    return (
      <div className="flex gap-2 items-center">
        Move{" "}
        <input
          type="number"
          className={`w-14 rounded  px-2 py-1 outline-none border-b text-sm ${
            steps <= 0
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
          name="steps"
          value={payload.steps}
          onChange={handleChange}
        />{" "}
        steps{" "}
        {type === Actions.MoveXStepsForward
          ? "in right direction"
          : "in left direction"}
      </div>
    );
  }

  const degrees = Number(payload?.degrees || "0");

  if (
    type === Actions.TurnXDegreesClockwise ||
    type === Actions.TurnXDegreesAntiClockwise
  ) {
    return (
      <div className="flex gap-2 items-center">
        Turn{" "}
        <input
          type="number"
          className={`
            w-14  rounded  px-2 py-1 outline-none border-b text-sm"
          name="degrees ${
            degrees <= 0
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }
            `}
          name="degrees"
          value={payload.degrees}
          onChange={handleChange}
        />{" "}
        degrees{" "}
        {type === Actions.TurnXDegreesClockwise
          ? "clockwise"
          : "anti-clockwise"}
      </div>
    );
  }

  const x = Number(payload.x || "-1");
  const y = Number(payload.y || "-1");

  if (type === Actions.GotoXY) {
    return (
      <div className="flex gap-2 items-center">
        Go to position
        {" ("}
        <input
          type="number"
          className={`w-14 rounded px-1.5 py-1 outline-none border-b text-sm ${
            x < 0 ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
          }`}
          name="x"
          value={payload.x}
          onChange={handleChange}
        />{" "}
        ,{" "}
        <input
          type="number"
          className={`w-14  rounded px-2 py-1.5 outline-none border-b text-sm ${
            y < 0 ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
          }`}
          name="y"
          value={payload.y}
          onChange={handleChange}
        />
        {")"}
      </div>
    );
  }

  const times = Number(payload?.times || "0");

  if (type === Actions.RepeatXTimes) {
    return (
      <div className="flex gap-2 items-center">
        Repeat
        <input
          type="number"
          max={15}
          min={1}
          className={`w-14 rounded  px-1.5 py-1 outline-none border-b text-sm ${
            times < 1 || times > 15
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
          name="times"
          value={payload.times}
          onChange={handleChange}
        />
        times
      </div>
    );
  }

  return <div>{action.type}</div>;
};

interface ActionTypeWrapperProps {
  itemIndex: number;
  spriteName: string;
  action: Item;
  draggable: boolean;
  handleDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
}
export const ActionTypeWrapper = ({
  action,
  spriteName,
  itemIndex,
  draggable,
  handleDragStart,
}: ActionTypeWrapperProps) => {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => handleDragStart(e, itemIndex)}
      className="p-2 border rounded shadow-md cursor-move"
    >
      <ActionType
        itemIndex={itemIndex}
        spriteName={spriteName}
        action={action}
      />
    </div>
  );
};
