function TopBar({ clubName, seasonNumber, seasonStarted, seasonFinished, careerFinished, currentWeek }) {
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
          ? `Season ${seasonNumber} - Week ${currentWeek + 1}`
          : seasonFinished
            ? careerFinished
              ? `Season ${seasonNumber} complete - Career finished`
              : `Season ${seasonNumber} complete`
            : `Pre-season - Season ${seasonNumber}`}
      </div>
    </header>
  )
}

export default TopBar
