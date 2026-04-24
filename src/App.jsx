import { useMemo, useState } from 'react'
import './App.css'
import ClubStage from './components/ClubStage'
import SeasonPanel from './components/SeasonPanel'
import SquadPanel from './components/SquadPanel'
import TopBar from './components/TopBar'
import TransferMarketPanel from './components/TransferMarketPanel'
import opponentTeams from './data/opponentTeams'
import { clubs, formationSlots } from './data/gameConfig'
import serieAPlayers from './data/serieAPlayers'

function App() {
  const [selectedClub, setSelectedClub] = useState(clubs[0])
  const [signedPlayers, setSignedPlayers] = useState([])
  const [seasonStarted, setSeasonStarted] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [matchResults, setMatchResults] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('st')

  const clubPlayers = useMemo(() => {
    return serieAPlayers
      .filter((player) => player.club === selectedClub.name)
      .sort((firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating)
  }, [selectedClub.name])

  const squadPool = useMemo(() => {
    return [...clubPlayers, ...signedPlayers].sort(
      (firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating
    )
  }, [clubPlayers, signedPlayers])

  const autoLineup = useMemo(() => {
    const usedIds = new Set()

    return formationSlots.reduce((lineup, slot) => {
      const candidate = squadPool.find(
        (player) => slot.allowed.includes(player.position) && !usedIds.has(player.id)
      )

      if (candidate) {
        usedIds.add(candidate.id)
        lineup[slot.key] = candidate
      }

      return lineup
    }, {})
  }, [squadPool])

  const selectedSlotConfig = formationSlots.find((slot) => slot.key === selectedSlot)

  const availableForSlot = useMemo(() => {
    return squadPool.filter((player) => selectedSlotConfig.allowed.includes(player.position))
  }, [selectedSlotConfig, squadPool])

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
    const activePlayers = formationSlots
      .map((slot) => autoLineup[slot.key])
      .filter(Boolean)

    if (!activePlayers.length) {
      return selectedClub.rating
    }

    const totalRating = activePlayers.reduce((sum, player) => sum + player.rating, 0)
    return Math.round(totalRating / activePlayers.length)
  }, [autoLineup, selectedClub.rating])

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
    setSelectedSlot('st')
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
      <TopBar
        clubName={selectedClub.name}
        seasonStarted={seasonStarted}
        seasonFinished={seasonFinished}
        currentWeek={currentWeek}
      />

      <main className="game-shell">
        <ClubStage
          selectedClub={selectedClub}
          remainingBudget={remainingBudget}
          selectedClubStrength={selectedClubStrength}
          signedPlayersCount={signedPlayers.length}
          databaseCount={serieAPlayers.length}
          opponentsCount={opponentTeams.length}
          seasonFixturesCount={seasonFixtures.length}
          seasonStarted={seasonStarted}
          onStartSeason={handleStartSeason}
          clubs={clubs}
          onSelectClub={handleSelectClub}
        />

        <aside className="manager-panel">
          <TransferMarketPanel players={affordablePlayers} onSignPlayer={handleSignPlayer} />
          <SquadPanel
            formationSlots={formationSlots}
            autoLineup={autoLineup}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            selectedSlotConfig={selectedSlotConfig}
            availableForSlot={availableForSlot}
          />
          <SeasonPanel
            seasonStarted={seasonStarted}
            seasonFinished={seasonFinished}
            seasonFixturesCount={seasonFixtures.length}
            currentWeek={currentWeek}
            selectedClubName={selectedClub.name}
            nextOpponent={nextOpponent}
            matchResults={matchResults}
            onPlayNextMatch={handlePlayNextMatch}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
