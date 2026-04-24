function LeaderGroup({ title, rows, statKey, emptyLabel, decimals = false }) {
  return (
    <div className="leader-card">
      <strong>{title}</strong>
      {rows.length === 0 ? (
        <small>{emptyLabel}</small>
      ) : (
        rows.map((player) => (
          <div className="leader-row" key={`${statKey}-${player.id}`}>
            <span>{decimals ? player[statKey].toFixed(2) : player[statKey]}</span>
            <p>{player.name}</p>
          </div>
        ))
      )}
    </div>
  )
}

function SeasonLeaders({ seasonLeaders }) {
  return (
    <div className="season-block">
      <div className="section-heading compact">
        <p className="eyebrow">Leaders</p>
        <h3>WhoScored</h3>
      </div>

      <div className="leaders-grid">
        <LeaderGroup
          title="Top scorers"
          rows={seasonLeaders.scorers}
          statKey="goals"
          emptyLabel="No goals yet."
        />
        <LeaderGroup
          title="Top assists"
          rows={seasonLeaders.assists}
          statKey="assists"
          emptyLabel="No assists yet."
        />
        <LeaderGroup
          title="WhoScored rating"
          rows={seasonLeaders.ratings}
          statKey="averageRating"
          emptyLabel="No ratings yet."
          decimals
        />
      </div>
    </div>
  )
}

export default SeasonLeaders
