import { Tooltip as ReactTooltip } from "react-tooltip";

interface TooltipProps {
  id: string;
  children: React.ReactNode;
  content: string;
}

export const Tooltip = ({ id, children, content }: TooltipProps) => {
  return <>
    <div data-tooltip-id={id} data-tooltip-content={content}>
        {children}
    </div>
    <ReactTooltip id={id} />
  </>;
};
