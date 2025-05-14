import { Navigate, useLocation } from 'react-router-dom';
import type { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token'); // O lo que uses para almacenar el token
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }} // Usando la ubicación actual
    />
  );
};

export default PrivateRoute;
