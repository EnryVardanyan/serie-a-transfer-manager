import LeagueTable from './LeagueTable'
import SeasonLeaders from './SeasonLeaders'

function SeasonPanel({
  seasonStarted,
  seasonFinished,
  seasonFixturesCount,
  currentWeek,
  selectedClubName,
  nextOpponent,
  isHomeMatch,
  matchResults,
  onPlayNextMatch,
  homeRevenue,
  standings,
  seasonLeaders
}) {
  return (
    <section className="panel-section opponent-section">
      <div className="section-heading">
        <p className="eyebrow">Season flow</p>
        <h3>Next fixture</h3>
      </div>

      <div className="season-income">
        <span>Home match revenue</span>
        <strong>EUR {homeRevenue}M</strong>
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
                {isHomeMatch
                  ? `${selectedClubName} vs ${nextOpponent.name}`
                  : `${nextOpponent.name} vs ${selectedClubName}`}
              </strong>
              <small>
                {isHomeMatch ? 'Home match' : 'Away match'} - Opponent rating {nextOpponent.rating} - squad {nextOpponent.squad.length}
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
                  <article className="result-row" key={`${match.week}-${match.homeTeam}-${match.awayTeam}`}>
                    <span>W{match.week}</span>
                    <div className="result-copy">
                      <strong>
                        {match.homeTeam} {match.homeGoals}-{match.awayGoals} {match.awayTeam}
                      </strong>
                      <small>
                        {match.isHomeMatch
                          ? `Gate: EUR ${match.gateRevenue}M`
                          : 'No home revenue'}
                        {match.homeEvents.length > 0
                          ? ` - Scorers: ${match.homeEvents.map((event) => event.scorer).join(', ')}`
                          : ''}
                      </small>
                    </div>
                  </article>
                ))
            )}
          </div>
        </>
      )}

      <LeagueTable standings={standings} />
      <SeasonLeaders seasonLeaders={seasonLeaders} />
    </section>
  )
}

export default SeasonPanel
