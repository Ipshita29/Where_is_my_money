import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Where Is My Money?</h2>

      <div className="menu">
        <p className="menu-title">NAVIGATION</p>
        <button className="menu-btn active">Dashboard</button>
        <button className="menu-btn">Analytics</button>
        <button className="menu-btn">Reports</button>
        <button className="menu-btn">Support</button>
      </div>

      <div className="settings">
        <button className="menu-btn small">Settings</button>
        <div className="user-info">
          <img
            src="https://i.pravatar.cc/40"
            className="avatar"
            alt="user"
          />
          <div>
            <p className="u-name">User</p>
            <small className="u-id">#2024</small>
          </div>
        </div>
      </div>
    </div>
  );
}