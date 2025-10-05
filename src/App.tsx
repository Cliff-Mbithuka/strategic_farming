import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import SatelliteView from "./components/SatelliteView";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/satellite" element={<SatelliteView />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}