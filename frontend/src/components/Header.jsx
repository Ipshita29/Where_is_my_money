import { useNavigate } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header-title">
        <h2>Dashboard</h2>
        <p>
          {user
            ? `Welcome back, ${user.name || "there"}!`
            : "Your personal finance tracker."}
        </p>
      </div>

      <div className="header-actions">
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input className="search-input" placeholder="" />
        </div>

        {token ? (
          <>
            <button
              className="upload-btn"
              onClick={() => navigate("/upload")}
            >
              <span className="material-symbols-outlined">Upload Statement</span>
              
            </button>

            <div className="user-profile" title={user?.email}>
              <img
                src="https://i.pinimg.com/1200x/14/1d/72/141d723eda2db833181f4de915fdd88f.jpg"
                alt="avatar"
              />
            </div>

            <button className="auth-header-btn logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <div className="auth-header-btns">
            <button
              className="auth-header-btn"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button
              className="auth-header-btn btn-primary-sm"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}