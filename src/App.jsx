import { useMemo, useState } from 'react'
import './App.css'

const clubs = [
  {
    name: 'Inter',
    city: 'Milano',
    budget: 72,
    rating: 86,
    objective: 'Fight for the Scudetto',
    colors: ['#101820', '#2f80ed'],
    squad: ['Sommer', 'Bastoni', 'Barella', 'Calhanoglu', 'Lautaro']
  },
  {
    name: 'Milan',
    city: 'Milano',
    budget: 58,
    rating: 83,
    objective: 'Return to the title race',
    colors: ['#151515', '#e11937'],
    squad: ['Maignan', 'Tomori', 'Modric', 'Pulisic', 'Leao']
  },
  {
    name: 'Juventus',
    city: 'Torino',
    budget: 62,
    rating: 84,
    objective: 'Rebuild the dynasty',
    colors: ['#111111', '#f5f7fa'],
    squad: ['Di Gregorio', 'Bremer', 'Locatelli', 'Yildiz', 'David']
  },
  {
    name: 'Napoli',
    city: 'Napoli',
    budget: 54,
    rating: 82,
    objective: 'Push back into Europe',
    colors: ['#0969da', '#12b5cb'],
    squad: ['Meret', 'Buongiorno', 'Lobotka', 'De Bruyne', 'Politano']
  },
  {
    name: 'Roma',
    city: 'Roma',
    budget: 44,
    rating: 80,
    objective: 'Build a Champions League squad',
    colors: ['#8e1f2f', '#f0b429'],
    squad: ['Svilar', 'Mancini', 'Cristante', 'Dybala', 'Soule']
  },
  {
    name: 'Atalanta',
    city: 'Bergamo',
    budget: 48,
    rating: 81,
    objective: 'Develop and sell smart',
    colors: ['#111827', '#18a0fb'],
    squad: ['Carnesecchi', 'Hien', 'Ederson', 'Lookman', 'Scamacca']
  }
]

const marketPlayers = [
  { name: 'Riccardo Calafiori', position: 'CB', club: 'Arsenal', price: 38, rating: 81 },
  { name: 'Nico Williams', position: 'LW', club: 'Athletic Club', price: 65, rating: 85 },
  { name: 'Giorgio Scalvini', position: 'CB', club: 'Atalanta', price: 34, rating: 80 },
  { name: 'Samuele Ricci', position: 'CDM', club: 'Milan', price: 28, rating: 79 },
  { name: 'Jonathan David', position: 'ST', club: 'Juventus', price: 42, rating: 83 }
]

function App() {
  const [selectedClub, setSelectedClub] = useState(clubs[0])
  const [signedPlayers, setSignedPlayers] = useState([])

  const spent = signedPlayers.reduce((total, player) => total + player.price, 0)
  const remainingBudget = selectedClub.budget - spent

  const affordablePlayers = useMemo(() => {
    return marketPlayers.map((player) => ({
      ...player,
      canBuy: player.price <= remainingBudget,
      isSigned: signedPlayers.some((signedPlayer) => signedPlayer.name === player.name)
    }))
  }, [remainingBudget, signedPlayers])

  const handleSelectClub = (club) => {
    setSelectedClub(club)
    setSignedPlayers([])
  }

  const handleSignPlayer = (player) => {
    if (player.price > remainingBudget) return
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
                    <span>{player.position} · {player.club}</span>
                  </div>
                  <button
                    disabled={!player.canBuy || player.isSigned}
                    onClick={() => handleSignPlayer(player)}
                  >
                    {player.isSigned ? 'Signed' : `€${player.price}M`}
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
              {[...selectedClub.squad, ...signedPlayers.map((player) => player.name)].map(
                (playerName, index) => (
                  <div className="squad-slot" key={`${playerName}-${index}`}>
                    <span>{index + 1}</span>
                    <strong>{playerName}</strong>
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
