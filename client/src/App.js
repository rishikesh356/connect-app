import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Login from "./pages/login/login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
//query client is alternate way of fetching asynchronus data without redux or useeffect
import { QueryClient, QueryClientProvider } from 'react-query'
function App() {
  const queryClient = new QueryClient()
  const { currentUser } = useContext(AuthContext)
  //const currentUser=true;
  const { darkMode } = useContext(DarkModeContext)
  console.log(darkMode)
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>

        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6, padding: '0px' }} >
              <Outlet />
            </div>

            <RightBar />

          </div>
        </div>
      </QueryClientProvider>
    )
  }
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }
    return children
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
