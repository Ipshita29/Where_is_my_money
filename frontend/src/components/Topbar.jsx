import "../styles/topbar.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="left">
        <input
          className="search"
          type="text"
          placeholder="Search transactions..."
        />
      </div>

      <div className="right">
        <button className="icon-btn">
          🔔
        </button>

        <img
          className="profile-img"
          src="https://i.pravatar.cc/40"
          alt="profile"
        />
      </div>
    </div>
  );
}