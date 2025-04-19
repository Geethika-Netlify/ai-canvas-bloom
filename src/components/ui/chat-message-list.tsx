
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChatMessageListProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 p-4", className)}
        {...props}
      />
    )
  }
)
ChatMessageList.displayName = "ChatMessageList"

export { ChatMessageList }
