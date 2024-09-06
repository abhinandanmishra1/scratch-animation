import { Events } from "@app/constants";
import { FlagIcon } from "@app/assets";

interface EventBlockProps {
  eventType: Events;
}

export const EventBlock = ({ eventType }: EventBlockProps) => {
  if (eventType === Events.OnClick) {
    return (
      <div>
        When
        <FlagIcon  />
        clicked
      </div>
    );
  }

  return <div></div>;
};
