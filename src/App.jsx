import { useMemo, useState } from 'react'
import './App.css'
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

  const affordablePlayers = useMemo(() => {
    return marketPlayers.map((player) => ({
      ...player,
      canBuy: player.price <= remainingBudget,
      isSigned: signedPlayers.some((signedPlayer) => signedPlayer.name === player.name)
    }))
  }, [marketPlayers, remainingBudget, signedPlayers])

  const handleSelectClub = (club) => {
    setSelectedClub(club)
    setSignedPlayers([])
  }

  const handleSignPlayer = (player) => {
    if (player.value > remainingBudget) return
    if (signedPlayers.some((signedPlayer) => signedPlayer.name === player.name)) return

    setSignedPlayers((currentPlayers) => [...currentPlayers, player])
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

        <div className="save-pill">Week 1 · Summer window</div>
      </header>

      <main className="game-shell">
        <section className="club-stage">
          <div className="scoreboard">
            <div>
              <span>Budget</span>
              <strong>€{remainingBudget}M</strong>
            </div>
            <div>
              <span>Team rating</span>
              <strong>{selectedClub.rating}</strong>
            </div>
            <div>
              <span>Signed</span>
              <strong>{signedPlayers.length}</strong>
            </div>
            <div>
              <span>Database</span>
              <strong>{serieAPlayers.length}</strong>
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
          </div>

          <div className="club-picker" aria-label="Choose Serie A club">
            {clubs.map((club) => (
              <button
                className={club.name === selectedClub.name ? 'club-chip active' : 'club-chip'}
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
                    {player.isSigned ? 'Signed' : `€${player.value}M`}
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
              {[...corePlayers, ...signedPlayers].map(
                (player, index) => (
                  <div className="squad-slot" key={`${player.id}-${index}`}>
                    <span>{index + 1}</span>
                    <strong>{player.name}</strong>
                    <small>{player.position} - {player.rating}</small>
                  </div>
                )
              )}
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}

export default App
