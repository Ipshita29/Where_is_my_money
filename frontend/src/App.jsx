import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Transactions from "./pages/Transactions";
import Anomalies from "./pages/Anomalies";
import "./index.css";

// Auth guard: redirect to /login if no token stored
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard dateRange={dateRange} onDateRangeChange={setDateRange} />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions dateRange={dateRange} onDateRangeChange={setDateRange} />
            </PrivateRoute>
          }
        />
        <Route
          path="/anomalies"
          element={
            <PrivateRoute>
              <Anomalies dateRange={dateRange} onDateRangeChange={setDateRange} />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;