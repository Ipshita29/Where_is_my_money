import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo-text">Where Is My Money?</h1>
        <p className="logo-subtext">Personal Finance AI</p>
      </div>

      <nav className="nav-links">
        <a className="nav-item active">
          <span className="material-symbols-outlined"></span>Dashboard
        </a>

        <a className="nav-item">
          <span className="material-symbols-outlined"></span>Transactions
        </a>

        <a className="nav-item">
          <span className="material-symbols-outlined"></span>Anomalies
        </a>

        <a className="nav-item">
          <span className="material-symbols-outlined"></span>Upload
        </a>
      </nav>

  
    </aside>
  );
}