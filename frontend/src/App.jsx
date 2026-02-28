import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./styles/dashboard.css";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;