"use client"

import { NavItemLoader } from "@/components/move/navbar/nav-item-loader"

interface LoadContractPageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function LoadContractPage({ message }: LoadContractPageProps) {
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center">
        <NavItemLoader message={message} forceOpen={true} />
      </div>
    </div>
  )
}
