"use client"

import React, { createContext, useContext, useState } from "react"

export const CODE_KEY = "code"
export const EDITOR_KEY = "editor"
export const FILE_KEY = "file"
export const CONSOLE_KEY = "console"

export const NavProvider = ({ children }: NavProviderProps) => {
  const [navActive, setNavActive] = useState<Record<string, boolean>>({})

  const setNavItemActive = (name: string, value: boolean = false) => {
    setNavActive((prev) => ({
      ...prev,
      [name]: !prev[name] || value,
    }))
  }

  const isNavItemActive = (name: string): boolean => {
    return navActive[name] || false
  }

  return (
    <NavContext.Provider
      value={{
        setNavItemActive,
        isNavItemActive,
      }}
    >
      {children}
    </NavContext.Provider>
  )
}

interface NavProviderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavContext = createContext({
  setNavItemActive: (name: string, value: boolean = false) => {},
  isNavItemActive: (name: string) => false as boolean,
})

export const useNav = () => useContext(NavContext)
