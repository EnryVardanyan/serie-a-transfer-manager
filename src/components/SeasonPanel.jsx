function SeasonPanel({
  seasonStarted,
  seasonFinished,
  seasonFixturesCount,
  currentWeek,
  selectedClubName,
  nextOpponent,
  matchResults,
  onPlayNextMatch
}) {
  return (
    <section className="panel-section opponent-section">
      <div className="section-heading">
        <p className="eyebrow">Season flow</p>
        <h3>Next fixture</h3>
      </div>

      {!seasonStarted ? (
        <div className="season-empty">
          Start the season to unlock fixtures and match results.
        </div>
      ) : seasonFinished ? (
        <div className="season-empty">
          All {seasonFixturesCount} league weeks are complete.
        </div>
      ) : (
        <>
          <article className="fixture-card">
            <div>
              <span>Week {currentWeek + 1}</span>
              <strong>
                {selectedClubName} vs {nextOpponent.name}
              </strong>
              <small>
                Opponent rating {nextOpponent.rating} - squad {nextOpponent.squad.length}
              </small>
            </div>
            <button onClick={onPlayNextMatch}>Play match</button>
          </article>

          <div className="results-list">
            {matchResults.length === 0 ? (
              <div className="season-empty small">No played matches yet.</div>
            ) : (
              matchResults
                .slice()
                .reverse()
                .map((match) => (
                  <article className="result-row" key={`${match.week}-${match.opponent}`}>
                    <span>W{match.week}</span>
                    <strong>
                      {selectedClubName} {match.homeGoals}-{match.awayGoals} {match.opponent}
                    </strong>
                  </article>
                ))
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default SeasonPanel
