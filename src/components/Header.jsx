import { useDispatch } from "react-redux";
import Logo from "../assets/lws-logo-dark.svg";
import { userLoggedOut } from "../redux/rtk/features/auth/authSlice";
import { Link } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem("auth");
  };

  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link to="/inbox">
            <img className="h-10" src={Logo} />
          </Link>
          <ul>
            <li className="text-white">
              <span onClick={logout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
