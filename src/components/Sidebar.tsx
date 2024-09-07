import { Actions, Events } from "@app/constants";
import { DraggableItem, Tooltip } from "@app/blocks";
import { FlagIcon, GithubIcon } from "@app/assets";

import { DragEvent } from "react";
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
      className="w-60 relative shadow-zinc-400 shadow-lg flex-none h-full overflow-y-auto flex flex-col items-start pr-2 border-r border-gray-200 bg-gray-100"
    >
      <div className="font-bold ml-2"> {"Events"} </div>
      <DraggableItem
        onDragStart={(e) => e.dataTransfer.setData("type", Events.OnStart)}
        type="event"
      >
        {"When "}
        <FlagIcon size={16} fill="green" />
        {"clicked"}
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) => e.dataTransfer.setData("type", Events.OnClick)}
        type="event"
      >
        {"When this sprite clicked"}
      </DraggableItem>
      <div className="font-bold ml-2"> {"Motion"} </div>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.MoveXStepsForward)
        }
        type="action"
      >
        Move X steps forward
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.MoveXStepsBackward)
        }
        type="action"
      >
        Move X steps backward
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.MoveYStepsDownward)
        }
        type="action"
      >
        Move Y steps downward
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.MoveYStepsUpward)
        }
        type="action"
      >
        Move Y steps upward
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.TurnXDegreesClockwise)
        }
        type="action"
      >
        Turn X degrees clockwise
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.TurnXDegreesAntiClockwise)
        }
        type="action"
      >
        Turn X degrees anti-clockwise
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) => e.dataTransfer.setData("type", Actions.GotoXY)}
        type="action"
      >
        Go to position X and Y
      </DraggableItem>
      <DraggableItem
        onDragStart={(e) =>
          e.dataTransfer.setData("type", Actions.RepeatXTimes)
        }
        type="action"
      >
        {"Repeat"}
      </DraggableItem>

      <div className="border-t border-t-gray-400 w-full absolute bottom-3 flex gap-2 pt-2 items-center text-sm justify-center">
        <Tooltip id="github" content="See code">
          <a
            href="https://github.com/abhinandanmishra1/scratch-animation"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon size={20} />
          </a>
        </Tooltip>

        <div className="flex flex-col items-center text-gray-500">
          <span>Developed by</span>
          <p className="text-sm text-gray-700">Abhinandan Mishra</p>
        </div>
      </div>
    </div>
  );
}
