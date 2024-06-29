import { createContext, useContext } from 'react'

const GenresContext = createContext([])

export function GenresProvider({ value, children }) {
  return <GenresContext.Provider value={value}>{children}</GenresContext.Provider>
}

export const useGenres = () => useContext(GenresContext)
