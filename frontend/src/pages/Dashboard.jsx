import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Metrics from "../components/Metrics";
import SpendingChart from "../components/SpendingChart";
import CategoryChart from "../components/CategoryChart";
import AnomaliesSection from "../components/AnomaliesSection";

import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="dashboard-grid">
          <Metrics />

          <div className="content-grid">
            <SpendingChart />
            <CategoryChart />
          </div>

          <AnomaliesSection />
        </div>
      </main>
    </div>
  );
}