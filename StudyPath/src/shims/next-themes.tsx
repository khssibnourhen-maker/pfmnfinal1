import React, { createContext, useContext } from 'react'

const ThemeContext = createContext({ theme: 'light', setTheme: (_t: string) => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

export type ThemeProviderProps = { children: React.ReactNode }
