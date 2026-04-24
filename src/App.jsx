import { useMemo, useState } from 'react'
import './App.css'
import opponentTeams from './data/opponentTeams'
import serieAPlayers from './data/serieAPlayers'

const clubs = [
  {
    name: 'Inter',
    city: 'Milano',
    budget: 72,
    rating: 86,
    objective: 'Fight for the Scudetto',
    colors: ['#101820', '#2f80ed']
  },
  {
    name: 'Milan',
    city: 'Milano',
    budget: 58,
    rating: 83,
    objective: 'Return to the title race',
    colors: ['#151515', '#e11937']
  },
  {
    name: 'Juventus',
    city: 'Torino',
    budget: 62,
    rating: 84,
    objective: 'Rebuild the dynasty',
    colors: ['#111111', '#f5f7fa']
  },
  {
    name: 'Napoli',
    city: 'Napoli',
    budget: 54,
    rating: 82,
    objective: 'Push back into Europe',
    colors: ['#0969da', '#12b5cb']
  },
  {
    name: 'Roma',
    city: 'Roma',
    budget: 44,
    rating: 80,
    objective: 'Build a Champions League squad',
    colors: ['#8e1f2f', '#f0b429']
  },
  {
    name: 'Atalanta',
    city: 'Bergamo',
    budget: 48,
    rating: 81,
    objective: 'Develop and sell smart',
    colors: ['#111827', '#18a0fb']
  }
]

function App() {
  const [selectedClub, setSelectedClub] = useState(clubs[0])
  const [signedPlayers, setSignedPlayers] = useState([])
  const [seasonStarted, setSeasonStarted] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [matchResults, setMatchResults] = useState([])

  const clubPlayers = useMemo(() => {
    return serieAPlayers
      .filter((player) => player.club === selectedClub.name)
      .sort((firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating)
  }, [selectedClub.name])

  const corePlayers = clubPlayers.slice(0, 6)

  const marketPlayers = useMemo(() => {
    return serieAPlayers
      .filter((player) => player.club !== selectedClub.name)
      .sort((firstPlayer, secondPlayer) => {
        if (secondPlayer.rating !== firstPlayer.rating) {
          return secondPlayer.rating - firstPlayer.rating
        }

        return firstPlayer.value - secondPlayer.value
      })
      .slice(0, 10)
  }, [selectedClub.name])

  const spent = signedPlayers.reduce((total, player) => total + player.value, 0)
  const remainingBudget = selectedClub.budget - spent

  const selectedClubStrength = useMemo(() => {
    const activePlayers = [...clubPlayers, ...signedPlayers]
      .sort((firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating)
      .slice(0, 11)

    if (!activePlayers.length) {
      return selectedClub.rating
    }

    const totalRating = activePlayers.reduce((sum, player) => sum + player.rating, 0)
    return Math.round(totalRating / activePlayers.length)
  }, [clubPlayers, signedPlayers, selectedClub.rating])

  const seasonFixtures = useMemo(() => {
    return [...opponentTeams].sort(
      (firstTeam, secondTeam) => firstTeam.tablePosition - secondTeam.tablePosition
    )
  }, [])

  const nextOpponent = seasonStarted ? seasonFixtures[currentWeek] : null
  const seasonFinished = seasonStarted && currentWeek >= seasonFixtures.length

  const affordablePlayers = useMemo(() => {
    return marketPlayers.map((player) => ({
      ...player,
      canBuy: player.value <= remainingBudget,
      isSigned: signedPlayers.some((signedPlayer) => signedPlayer.name === player.name)
    }))
  }, [marketPlayers, remainingBudget, signedPlayers])

  const handleSelectClub = (club) => {
    setSelectedClub(club)
    setSignedPlayers([])
    setSeasonStarted(false)
    setCurrentWeek(0)
    setMatchResults([])
  }

  const handleSignPlayer = (player) => {
    if (player.value > remainingBudget) return
    if (signedPlayers.some((signedPlayer) => signedPlayer.name === player.name)) return

    setSignedPlayers((currentPlayers) => [...currentPlayers, player])
  }

  const handleStartSeason = () => {
    setSeasonStarted(true)
    setCurrentWeek(0)
    setMatchResults([])
  }

  const handlePlayNextMatch = () => {
    if (!nextOpponent) return

    const opponentStrength = Math.round(
      nextOpponent.squad.reduce((sum, player) => sum + player.rating, 0) /
        nextOpponent.squad.length
    )
    const strengthGap = selectedClubStrength - opponentStrength
    const homeGoals = Math.max(
      0,
      Math.min(4, Math.round(1.6 + strengthGap / 6 + ((currentWeek % 3) - 1)))
    )
    const awayGoals = Math.max(
      0,
      Math.min(4, Math.round(1.1 - strengthGap / 7 + ((currentWeek + 1) % 2)))
    )

    setMatchResults((currentResults) => [
      ...currentResults,
      {
        week: currentWeek + 1,
        opponent: nextOpponent.name,
        homeGoals,
        awayGoals
      }
    ])
    setCurrentWeek((week) => week + 1)
  }

  return (
    <div
      className="app"
      style={{
        '--club-primary': selectedClub.colors[0],
        '--club-accent': selectedClub.colors[1]
      }}
    >
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SA</span>
          <div>
            <p className="eyebrow">Serie A Transfer Manager</p>
            <h1>{selectedClub.name} career</h1>
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

      <main className="game-shell">
        <section className="club-stage">
          <div className="scoreboard">
            <div>
              <span>Budget</span>
              <strong>EUR {remainingBudget}M</strong>
            </div>
            <div>
              <span>Team rating</span>
              <strong>{selectedClubStrength}</strong>
            </div>
            <div>
              <span>Signed</span>
              <strong>{signedPlayers.length}</strong>
            </div>
            <div>
              <span>Database</span>
              <strong>{serieAPlayers.length}</strong>
            </div>
            <div>
              <span>Opponents</span>
              <strong>{opponentTeams.length}</strong>
            </div>
          </div>

          <div className="club-crest">{selectedClub.name.slice(0, 3)}</div>

          <div className="club-copy">
            <p className="eyebrow">Choose your story</p>
            <h2>{selectedClub.objective}</h2>
            <p>
              Control transfers, protect the wage room, and build a squad that
              can handle the Serie A season.
            </p>
            <div className="hero-actions">
              <button onClick={handleStartSeason}>
                {seasonStarted ? 'Restart season' : 'Start season'}
              </button>
              <span>{seasonFixtures.length} league matches ready</span>
            </div>
          </div>

          <div className="club-picker" aria-label="Choose Serie A club">
            {clubs.map((club) => (
              <button
                className={
                  club.name === selectedClub.name ? 'club-chip active' : 'club-chip'
                }
                key={club.name}
                onClick={() => handleSelectClub(club)}
              >
                <span>{club.name}</span>
                <small>{club.city}</small>
              </button>
            ))}
          </div>
        </section>

        <aside className="manager-panel">
          <section className="panel-section">
            <div className="section-heading">
              <p className="eyebrow">Transfer list</p>
              <h3>Market targets</h3>
            </div>

            <div className="market-list">
              {affordablePlayers.map((player) => (
                <article className="player-row" key={player.name}>
                  <div className="player-rating">{player.rating}</div>
                  <div className="player-main">
                    <strong>{player.name}</strong>
                    <span>{player.position} - {player.club} - {player.role}</span>
                  </div>
                  <button
                    disabled={!player.canBuy || player.isSigned}
                    onClick={() => handleSignPlayer(player)}
                  >
                    {player.isSigned ? 'Signed' : `EUR ${player.value}M`}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="panel-section squad-section">
            <div className="section-heading">
              <p className="eyebrow">Squad room</p>
              <h3>Core players</h3>
            </div>

            <div className="squad-list">
              {[...corePlayers, ...signedPlayers].map((player, index) => (
                <div className="squad-slot" key={`${player.id}-${index}`}>
                  <span>{index + 1}</span>
                  <strong>{player.name}</strong>
                  <small>{player.position} - {player.rating}</small>
                </div>
              ))}
            </div>
          </section>

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
                All {seasonFixtures.length} league weeks are complete.
              </div>
            ) : (
              <>
                <article className="fixture-card">
                  <div>
                    <span>Week {currentWeek + 1}</span>
                    <strong>
                      {selectedClub.name} vs {nextOpponent.name}
                    </strong>
                    <small>
                      Opponent rating {nextOpponent.rating} - squad{' '}
                      {nextOpponent.squad.length}
                    </small>
                  </div>
                  <button onClick={handlePlayNextMatch}>Play match</button>
                </article>

                <div className="results-list">
                  {matchResults.length === 0 ? (
                    <div className="season-empty small">No played matches yet.</div>
                  ) : (
                    matchResults
                      .slice()
                      .reverse()
                      .map((match) => (
                        <article
                          className="result-row"
                          key={`${match.week}-${match.opponent}`}
                        >
                          <span>W{match.week}</span>
                          <strong>
                            {selectedClub.name} {match.homeGoals}-{match.awayGoals}{' '}
                            {match.opponent}
                          </strong>
                        </article>
                      ))
                  )}
                </div>
              </>
            )}
          </section>
        </aside>
      </main>
    </div>
  )
}

export default App
