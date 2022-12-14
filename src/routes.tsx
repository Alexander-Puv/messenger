import { Navigate } from 'react-router-dom';
import { Chat, Login } from './pages/index';
import { CHAT_ROUTE, LOGIN_ROUTE } from './utils/consts';

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    element: <Login />
  },
  {
    path: '*',
    element: <Navigate to={LOGIN_ROUTE} replace={true} />
  },
]

export const privateRoutes = [
  {
    path: CHAT_ROUTE,
    element: <Chat />
  },
  {
    path: '*',
    element: <Navigate to={CHAT_ROUTE} replace={true} />
  },
]