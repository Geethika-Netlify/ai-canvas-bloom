
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
}

const ChatBubble = ({
  className,
  variant = "received",
  children,
  ...props
}: ChatBubbleProps) => (
  <div
    className={cn(
      "flex w-full gap-2 p-2",
      variant === "sent" ? "flex-row-reverse" : "flex-row",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const ChatBubbleAvatar = ({
  className,
  src,
  fallback,
  ...props
}: {
  className?: string
  src?: string
  fallback: string
}) => (
  <Avatar className={cn("h-8 w-8", className)} {...props}>
    <AvatarImage src={src} />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received"
  isLoading?: boolean
}

const ChatBubbleMessage = ({
  className,
  variant = "received",
  isLoading,
  children,
  ...props
}: ChatBubbleMessageProps) => (
  <div
    className={cn(
      "rounded-lg px-4 py-2 max-w-[80%] break-words",
      variant === "sent"
        ? "bg-primary text-primary-foreground"
        : "bg-muted",
      className
    )}
    {...props}
  >
    {isLoading ? (
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
      </div>
    ) : (
      children
    )}
  </div>
)

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage }
