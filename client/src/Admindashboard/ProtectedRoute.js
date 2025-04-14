import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const role =localStorage.getItem("role");

  return role=== "admin" ? children : <Navigate to="/home" />;
};

export default ProtectedRoute;
