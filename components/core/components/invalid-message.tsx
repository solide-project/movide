interface InvalidMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InvalidMessage({ children }: InvalidMessageProps) {
  return (
    <div className="flex h-32 items-center justify-center space-x-2 text-center text-xs md:text-sm lg:text-base">
      {children}
    </div>
  )
}
