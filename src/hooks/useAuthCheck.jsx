import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../redux/rtk/features/auth/authSlice";

function UseAuthCheck() {
  const dispatch = useDispatch();

  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    if (localAuth) {
      const auth = JSON.parse(localAuth);
      if (auth?.accessToken && auth?.user) {
        dispatch(
          userLoggedIn({
            accessToken: auth.accessToken,
            user: auth.user,
          })
        );
      }
    }
    setAuthChecked(true);
  }, [dispatch]);

  return authChecked;
}

export default UseAuthCheck;
