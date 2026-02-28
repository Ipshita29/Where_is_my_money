import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <h2>Dashboard</h2>
        <p>Welcome back, your finances look healthy.</p>
      </div>

      <div className="header-actions">
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input className="search-input" placeholder="" />
        </div>

        <button className="upload-btn">
          <span className="material-symbols-outlined">Upload Statement</span>
          
        </button>

        <div className="user-profile">
          <img src="https://i.pinimg.com/1200x/14/1d/72/141d723eda2db833181f4de915fdd88f.jpg" />
        </div>
      </div>
    </header>
  );
}