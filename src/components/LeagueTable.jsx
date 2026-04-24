function LeagueTable({ standings }) {
  return (
    <div className="season-block">
      <div className="section-heading compact">
        <p className="eyebrow">Standings</p>
        <h3>Table</h3>
      </div>

      <div className="table-list">
        {standings.slice(0, 8).map((row) => (
          <article className="table-row" key={row.team}>
            <span>{row.rank}</span>
            <strong>{row.team}</strong>
            <small>{row.points} pts</small>
          </article>
        ))}
      </div>
    </div>
  )
}

export default LeagueTable
