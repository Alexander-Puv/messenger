import { createContext } from "react"

type B = boolean
type SB = (isAuth: boolean) => void

interface AppContextProps {
  isAuth: B,
  setIsAuth: SB
}

const AppContext = createContext<AppContextProps | null>(null)
export default AppContext