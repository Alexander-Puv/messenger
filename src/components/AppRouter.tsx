import { Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../routes';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useContext } from 'react'
import { FirebaseContext } from '../MainConf'

const AppRouter = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)

  return (
    <Routes>
      {user ? privateRoutes.map(({path, element}) =>
        <Route path={path} element={element} key={path} />
      )
      : publicRoutes.map(({path, element}) =>
        <Route path={path} element={element} key={path} />
      )}
    </Routes>
  )
}

export default AppRouter