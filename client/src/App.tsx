import { useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Homepage from "./Pages/Homepage";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import AuthRequired from "./Components/AuthRequired";
import useChatStore from "./store/useChatStore";

function App() {
  const { isLoggedIn } = useAuthStore();
  const { connect, disconnect } = useChatStore();
  useEffect(() => {
    if (isLoggedIn) {
      connect();
      return () => disconnect();
    } else {
      disconnect();
    }
  }, [isLoggedIn]);
  console.log("The value of log is", isLoggedIn);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Homepage /> : <Login />} />
        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Homepage />}
        />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Homepage />} />
        <Route path="/settings" element={<Settings />} />
        <Route element={<AuthRequired />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "mx-auto",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: "#22c55e",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
