import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

interface ButtonTooltipProps {
  content: string | ReactNode;
  children: ReactNode;
}

export function ButtonTooltip({ content, children }: ButtonTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            align="center"
            className="z-9999 rounded-md bg-gray-900 px-3 py-1 text-sm text-white shadow-lg animate-fade-in"
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
