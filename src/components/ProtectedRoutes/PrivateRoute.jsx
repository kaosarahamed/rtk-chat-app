import PropTypes from "prop-types";
import UseAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = UseAuth();

  return isLoggedIn ? children : <Navigate to="/" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.any,
};

export default PrivateRoute;
