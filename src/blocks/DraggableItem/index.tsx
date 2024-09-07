import { DragEvent } from "react";

interface DraggableItemProps {
  children: React.ReactNode;
  type: "event" | "action";
  onDragStart: (e: DragEvent) => void;
}

export const DraggableItem = ({ children, type, onDragStart }: DraggableItemProps) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`flex flex-row items-center flex-wrap gap-2 ${
        type === "action" ? "bg-blue-500" : "bg-yellow-500"
      } text-white px-2 py-1 my-2 text-sm cursor-pointer`}
    >
      {children}
    </div>
  );
};
