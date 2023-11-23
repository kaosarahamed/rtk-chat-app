import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UseAuthCheck from "./hooks/useAuthCheck";
import PrivateRoute from "./components/ProtectedRoutes/PrivateRoute";
import PublicRoute from "./components/ProtectedRoutes/PublicRoute";
import Convertions from "./pages/Convertions";

function App() {
  const authChecked = UseAuthCheck();

  return !authChecked ? (
    <div
      style={{
        color: "red",
        textAlign: "center",
        marginTop: "200px",
        fontSize: "60px",
      }}
    >
      checking authontication...
    </div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <PrivateRoute>
              <Convertions />
            </PrivateRoute>
          }
        />
        <Route
          path="/inbox/:id"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
