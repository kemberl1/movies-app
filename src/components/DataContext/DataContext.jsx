import { createContext, useContext } from 'react'

const DataContext = createContext()

export const DataProvider = DataContext.Provider
export const DataConsumer = DataContext.Consumer
export const useData = () => useContext(DataContext)

export default DataContext
