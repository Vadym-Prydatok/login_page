import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../app/authSlice";
import { RootState } from "../app/store";

export const RequaireAuth = () => {
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );

  if (!isAuthenticated) {
    return <Navigate to={'/'} />
  }

  return <Outlet />;
};
