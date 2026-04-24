function TopBar({ clubName, seasonStarted, seasonFinished, currentWeek }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">SA</span>
        <div>
          <p className="eyebrow">Serie A Transfer Manager</p>
          <h1>{clubName} career</h1>
        </div>
      </div>

      <div className="save-pill">
        {seasonStarted && !seasonFinished
          ? `Week ${currentWeek + 1} - Serie A season`
          : seasonFinished
            ? 'Season complete'
            : 'Pre-season - Summer window'}
      </div>
    </header>
  )
}

export default TopBar
