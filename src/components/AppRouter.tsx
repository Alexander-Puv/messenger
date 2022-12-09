import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { privateRoutes, publicRoutes } from '../routes';

const AppRouter = () => {
  const context = useContext(AppContext);

  return (
    <Routes>
      {context?.isAuth ? privateRoutes.map(({path, element}) =>
        <Route path={path} element={element} key={path} />
      )
      : publicRoutes.map(({path, element}) =>
        <Route path={path} element={element} key={path} />
      )}
    </Routes>
  )
}

export default AppRouter