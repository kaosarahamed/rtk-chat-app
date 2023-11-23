import PropTypes from "prop-types";
import UseAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const isLoggedIn = UseAuth();
  return !isLoggedIn ? children : <Navigate to="/inbox" />;
}

PublicRoute.propTypes = {
  children: PropTypes.any,
};

export default PublicRoute;
