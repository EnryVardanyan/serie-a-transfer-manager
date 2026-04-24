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

function seededNumber(seed) {
  const value = Math.sin(seed) * 10000
  return value - Math.floor(value)
}

function getRandomSeasonSeed() {
  return Math.floor(Math.random() * 1000000000)
}

function stringSeed(value) {
  return [...value].reduce((sum, character, index) => {
    return sum + character.charCodeAt(0) * (index + 1)
  }, 0)
}

function App() {
  const [selectedClub, setSelectedClub] = useState(clubs[0])
  const [signedPlayers, setSignedPlayers] = useState([])
  const [seasonStarted, setSeasonStarted] = useState(false)
  const [seasonSeed, setSeasonSeed] = useState(getRandomSeasonSeed)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [matchResults, setMatchResults] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('st')
  const [lineupOverrides, setLineupOverrides] = useState({})
  const [homeRevenue, setHomeRevenue] = useState(0)
  const [playerSeasonStats, setPlayerSeasonStats] = useState({})

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

  const finalLineup = useMemo(() => {
    const lineup = { ...autoLineup }

    Object.entries(lineupOverrides).forEach(([slotKey, playerId]) => {
      const slot = formationSlots.find((item) => item.key === slotKey)
      const player = squadPool.find((item) => item.id === playerId)

      if (!slot || !player || !slot.allowed.includes(player.position)) {
        return
      }

      Object.keys(lineup).forEach((existingSlotKey) => {
        if (lineup[existingSlotKey]?.id === player.id) {
          delete lineup[existingSlotKey]
        }
      })

      lineup[slotKey] = player
    })

    return lineup
  }, [autoLineup, lineupOverrides, squadPool])

  const selectedSlotConfig = formationSlots.find((slot) => slot.key === selectedSlot)

  const availableForSlot = useMemo(() => {
    return squadPool
      .filter((player) => selectedSlotConfig.allowed.includes(player.position))
      .map((player) => ({
        ...player,
        isSelected: finalLineup[selectedSlot]?.id === player.id,
        assignedSlot: formationSlots.find((slot) => finalLineup[slot.key]?.id === player.id)?.label || null
      }))
  }, [finalLineup, selectedSlot, selectedSlotConfig, squadPool])

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
  const remainingBudget = selectedClub.budget + homeRevenue - spent

  const selectedClubStrength = useMemo(() => {
    const activePlayers = formationSlots
      .map((slot) => finalLineup[slot.key])
      .filter(Boolean)

    if (!activePlayers.length) {
      return selectedClub.rating
    }

    const totalRating = activePlayers.reduce((sum, player) => sum + player.rating, 0)
    return Math.round(totalRating / activePlayers.length)
  }, [finalLineup, selectedClub.rating])

  const seasonFixtures = useMemo(() => {
    return [...opponentTeams].sort(
      (firstTeam, secondTeam) => firstTeam.tablePosition - secondTeam.tablePosition
    )
  }, [])

  const nextOpponent = seasonStarted ? seasonFixtures[currentWeek] : null
  const seasonFinished = seasonStarted && currentWeek >= seasonFixtures.length
  const isHomeMatch = seasonStarted && !seasonFinished ? currentWeek % 2 === 0 : false
  const leagueTeams = useMemo(() => {
    return [...clubs.map((club) => club.name), ...opponentTeams.map((team) => team.name)]
  }, [])
  const teamRatings = useMemo(() => {
    return Object.fromEntries([
      ...clubs.map((club) => [club.name, club.rating]),
      ...opponentTeams.map((team) => [team.name, team.rating])
    ])
  }, [])

  const affordablePlayers = useMemo(() => {
    return marketPlayers.map((player) => ({
      ...player,
      canBuy: player.value <= remainingBudget,
      isSigned: signedPlayers.some((signedPlayer) => signedPlayer.name === player.name),
      valueLabel: player.value >= 50 ? 'Star deal' : player.value >= 25 ? 'First-team move' : 'Rotation deal'
    }))
  }, [marketPlayers, remainingBudget, signedPlayers])

  const handleSelectClub = (club) => {
    setSelectedClub(club)
    setSignedPlayers([])
    setSeasonStarted(false)
    setCurrentWeek(0)
    setMatchResults([])
    setSelectedSlot('st')
    setLineupOverrides({})
    setHomeRevenue(0)
    setPlayerSeasonStats({})
  }

  const handleSignPlayer = (player) => {
    if (player.value > remainingBudget) return
    if (signedPlayers.some((signedPlayer) => signedPlayer.name === player.name)) return

    setSignedPlayers((currentPlayers) => [...currentPlayers, player])
  }

  const handleStartSeason = () => {
    setSeasonStarted(true)
    setSeasonSeed(getRandomSeasonSeed())
    setCurrentWeek(0)
    setMatchResults([])
    setHomeRevenue(0)
    setPlayerSeasonStats({})
  }

  const handleAssignPlayerToSlot = (playerId) => {
    setLineupOverrides((currentOverrides) => ({
      ...currentOverrides,
      [selectedSlot]: playerId
    }))
  }

  const handlePlayNextMatch = () => {
    if (!nextOpponent) return

    const matchupSeed =
      stringSeed(selectedClub.name) * 11 +
      stringSeed(nextOpponent.name) * 7 +
      currentWeek * 131
    const matchSeedBase =
      seasonSeed +
      matchupSeed +
      selectedClubStrength * 13 +
      nextOpponent.rating * 7
    let randomCursor = 0
    const nextRandom = () => {
      randomCursor += 1
      return seededNumber(matchSeedBase + randomCursor)
    }

    const opponentStrength = Math.round(
      nextOpponent.squad.reduce((sum, player) => sum + player.rating, 0) /
        nextOpponent.squad.length
    )
    const homeLineup = formationSlots.map((slot) => finalLineup[slot.key]).filter(Boolean)
    const awayLineup = [...nextOpponent.squad]
      .sort((firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating)
      .slice(0, 11)
    const strengthGap = selectedClubStrength - opponentStrength
    const attackSwing = nextRandom() * 1.4 - 0.7
    const defendingSwing = nextRandom() * 1.2 - 0.6
    const finishingSwing = nextRandom() * 1.1 - 0.55
    const opponentFinishingSwing = nextRandom() * 1.1 - 0.55
    const momentumBoost = nextRandom() > 0.72 ? 0.45 : 0
    const opponentMomentumBoost = nextRandom() > 0.76 ? 0.4 : 0
    const homeAdvantage = isHomeMatch ? 0.32 : -0.12
    const homeGoals = Math.max(
      0,
      Math.min(
        5,
        Math.round(
          1.05 +
            strengthGap / 7 +
            homeAdvantage +
            attackSwing +
            finishingSwing +
            nextRandom() * 1.35 +
            momentumBoost
        )
      )
    )
    const awayGoals = Math.max(
      0,
      Math.min(
        5,
        Math.round(
          0.9 -
            strengthGap / 8 +
            defendingSwing +
            opponentFinishingSwing +
            nextRandom() * 1.25 +
            opponentMomentumBoost -
            homeAdvantage * 0.65
        )
      )
    )
    const gateRevenue = isHomeMatch
      ? Math.max(
          1,
          Math.round(
            2 +
              selectedClubStrength / 18 +
              (nextOpponent.rating >= 78 ? 1 : 0) +
              nextRandom() * 1.5
          )
        )
      : 0

    const buildOtherFixtures = () => {
      const remainingTeams = leagueTeams.filter(
        (teamName) => teamName !== selectedClub.name && teamName !== nextOpponent.name
      )
      const rotatedTeams = remainingTeams.map((teamName, index) => {
        return remainingTeams[(index + currentWeek) % remainingTeams.length]
      })
      const fixtures = []

      for (let index = 0; index < rotatedTeams.length; index += 2) {
        const homeTeam = rotatedTeams[index]
        const awayTeam = rotatedTeams[index + 1]

        if (!awayTeam) continue

        const ratingGap = (teamRatings[homeTeam] || 74) - (teamRatings[awayTeam] || 74)
        const fixtureSwing = nextRandom() * 1.2 - 0.6
        const awaySwing = nextRandom() * 1.1 - 0.55
        const homeScore = Math.max(
          0,
          Math.min(5, Math.round(0.95 + ratingGap / 9 + fixtureSwing + nextRandom() * 1.2))
        )
        const awayScore = Math.max(
          0,
          Math.min(5, Math.round(0.8 - ratingGap / 10 + awaySwing + nextRandom() * 1.1))
        )

        fixtures.push({
          homeTeam,
          awayTeam,
          homeGoals: homeScore,
          awayGoals: awayScore
        })
      }

      return fixtures
    }

    const getWeightedContributors = (players, scorerMode = false) => {
      return players.flatMap((player) => {
        const multiplier =
          player.position === 'ST'
            ? scorerMode
              ? 5
              : 2
            : ['LW', 'RW', 'CF'].includes(player.position)
              ? scorerMode
                ? 4
                : 3
              : ['CAM', 'CM'].includes(player.position)
                ? scorerMode
                  ? 2
                  : 4
                : player.position === 'CDM'
                  ? 1
                  : 1

        return Array.from({ length: multiplier }, () => player)
      })
    }

    const pickRandomPlayer = (players, fallbackPlayers, excludedId = null) => {
      const availablePlayers = players.filter((player) => player.id !== excludedId)

      if (availablePlayers.length > 0) {
        return availablePlayers[Math.floor(nextRandom() * availablePlayers.length)]
      }

      const fallback = fallbackPlayers.filter((player) => player.id !== excludedId)
      return fallback[Math.floor(nextRandom() * fallback.length)]
    }

    const createGoalEvents = (goals, lineup) => {
      const scorerPool = getWeightedContributors(lineup, true)
      const assistPool = getWeightedContributors(lineup, false)

      return Array.from({ length: goals }, () => {
        const scorer = pickRandomPlayer(scorerPool, lineup)
        const assisted = nextRandom() > 0.18
        const assister = assisted
          ? pickRandomPlayer(assistPool, lineup, scorer.id)
          : null

        return {
          scorer,
          assister
        }
      })
    }

    const homeEvents = createGoalEvents(homeGoals, homeLineup)
    const awayEvents = createGoalEvents(awayGoals, awayLineup)

    const nextStats = { ...playerSeasonStats }

    const ensurePlayerSeasonStats = (player) => {
      if (!nextStats[player.id]) {
        nextStats[player.id] = {
          id: player.id,
          name: player.name,
          club: player.club,
          position: player.position,
          matches: 0,
          goals: 0,
          assists: 0,
          ratingTotal: 0
        }
      }

      return nextStats[player.id]
    }

    const registerLineupAppearance = (player, rating) => {
      const stats = ensurePlayerSeasonStats(player)
      stats.matches += 1
      stats.ratingTotal += rating
    }

    const registerGoalEvents = (events) => {
      events.forEach(({ scorer, assister }) => {
        ensurePlayerSeasonStats(scorer).goals += 1

        if (assister) {
          ensurePlayerSeasonStats(assister).assists += 1
        }
      })
    }

    const buildRatingMap = (lineup, eventsFor, goalsFor, goalsAgainst) => {
      const goalCounts = new Map()
      const assistCounts = new Map()

      eventsFor.forEach(({ scorer, assister }) => {
        goalCounts.set(scorer.id, (goalCounts.get(scorer.id) || 0) + 1)

        if (assister) {
          assistCounts.set(assister.id, (assistCounts.get(assister.id) || 0) + 1)
        }
      })

      return lineup.map((player) => {
        const goals = goalCounts.get(player.id) || 0
        const assists = assistCounts.get(player.id) || 0
        const cleanSheetBonus =
          player.position === 'GK' || ['CB', 'LB', 'RB'].includes(player.position)
            ? goalsAgainst === 0
              ? 0.5
              : 0
            : 0
        const rating = Math.max(
          6.0,
          Math.min(
            9.8,
            6.4 +
              (goalsFor > goalsAgainst ? 0.35 : goalsFor === goalsAgainst ? 0.1 : -0.15) +
              goals * 1.1 +
              assists * 0.6 +
              cleanSheetBonus
          )
        )

        return {
          player,
          rating: Number(rating.toFixed(1))
        }
      })
    }

    registerGoalEvents(homeEvents)
    registerGoalEvents(awayEvents)

    buildRatingMap(homeLineup, homeEvents, homeGoals, awayGoals).forEach(({ player, rating }) => {
      registerLineupAppearance(player, rating)
    })
    buildRatingMap(awayLineup, awayEvents, awayGoals, homeGoals).forEach(({ player, rating }) => {
      registerLineupAppearance(player, rating)
    })

    setMatchResults((currentResults) => [
      ...currentResults,
      {
        week: currentWeek + 1,
        homeTeam: isHomeMatch ? selectedClub.name : nextOpponent.name,
        awayTeam: isHomeMatch ? nextOpponent.name : selectedClub.name,
        homeGoals: isHomeMatch ? homeGoals : awayGoals,
        awayGoals: isHomeMatch ? awayGoals : homeGoals,
        gateRevenue,
        isHomeMatch,
        homeEvents: homeEvents.map((event) => ({
          scorer: event.scorer.name,
          assister: event.assister?.name || null
        })),
        awayEvents: awayEvents.map((event) => ({
          scorer: event.scorer.name,
          assister: event.assister?.name || null
        })),
        otherFixtures: buildOtherFixtures()
      }
    ])
    setPlayerSeasonStats(nextStats)
    if (gateRevenue > 0) {
      setHomeRevenue((currentRevenue) => currentRevenue + gateRevenue)
    }
    setCurrentWeek((week) => week + 1)
  }

  const standings = useMemo(() => {
    const initialRows = leagueTeams.map((teamName) => ({
      team: teamName,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    }))

    const table = new Map(initialRows.map((row) => [row.team, { ...row }]))

    const applyResult = (homeTeam, awayTeam, homeGoals, awayGoals) => {
      const homeRow = table.get(homeTeam)
      const awayRow = table.get(awayTeam)

      homeRow.played += 1
      awayRow.played += 1
      homeRow.goalsFor += homeGoals
      homeRow.goalsAgainst += awayGoals
      awayRow.goalsFor += awayGoals
      awayRow.goalsAgainst += homeGoals

      if (homeGoals > awayGoals) {
        homeRow.wins += 1
        awayRow.losses += 1
        homeRow.points += 3
      } else if (homeGoals < awayGoals) {
        awayRow.wins += 1
        homeRow.losses += 1
        awayRow.points += 3
      } else {
        homeRow.draws += 1
        awayRow.draws += 1
        homeRow.points += 1
        awayRow.points += 1
      }

      homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst
      awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst
    }

    matchResults.forEach((match) => {
      applyResult(match.homeTeam, match.awayTeam, match.homeGoals, match.awayGoals)
      match.otherFixtures.forEach((fixture) => {
        applyResult(fixture.homeTeam, fixture.awayTeam, fixture.homeGoals, fixture.awayGoals)
      })
    })

    return [...table.values()]
      .sort((firstRow, secondRow) => {
        if (secondRow.points !== firstRow.points) {
          return secondRow.points - firstRow.points
        }

        if (secondRow.goalDifference !== firstRow.goalDifference) {
          return secondRow.goalDifference - firstRow.goalDifference
        }

        return secondRow.goalsFor - firstRow.goalsFor
      })
      .map((row, index) => ({
        ...row,
        rank: index + 1
      }))
  }, [leagueTeams, matchResults])

  const seasonLeaders = useMemo(() => {
    const stats = Object.values(playerSeasonStats).map((player) => ({
      ...player,
      averageRating:
        player.matches > 0 ? Number((player.ratingTotal / player.matches).toFixed(2)) : 0
    }))

    return {
      scorers: stats
        .filter((player) => player.goals > 0)
        .sort((firstPlayer, secondPlayer) => secondPlayer.goals - firstPlayer.goals || secondPlayer.averageRating - firstPlayer.averageRating)
        .slice(0, 5),
      assists: stats
        .filter((player) => player.assists > 0)
        .sort((firstPlayer, secondPlayer) => secondPlayer.assists - firstPlayer.assists || secondPlayer.averageRating - firstPlayer.averageRating)
        .slice(0, 5),
      ratings: stats
        .filter((player) => player.matches > 0)
        .sort((firstPlayer, secondPlayer) => secondPlayer.averageRating - firstPlayer.averageRating)
        .slice(0, 5)
    }
  }, [playerSeasonStats])

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
          homeRevenue={homeRevenue}
          seasonFixturesCount={seasonFixtures.length}
          seasonStarted={seasonStarted}
          onStartSeason={handleStartSeason}
          clubs={clubs}
          onSelectClub={handleSelectClub}
        />

        <aside className="manager-panel">
          <TransferMarketPanel
            players={affordablePlayers}
            onSignPlayer={handleSignPlayer}
            remainingBudget={remainingBudget}
          />
          <SquadPanel
            formationSlots={formationSlots}
            autoLineup={finalLineup}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            selectedSlotConfig={selectedSlotConfig}
            availableForSlot={availableForSlot}
            onAssignPlayer={handleAssignPlayerToSlot}
          />
          <SeasonPanel
            seasonStarted={seasonStarted}
            seasonFinished={seasonFinished}
            seasonFixturesCount={seasonFixtures.length}
            currentWeek={currentWeek}
            selectedClubName={selectedClub.name}
            nextOpponent={nextOpponent}
            isHomeMatch={isHomeMatch}
            matchResults={matchResults}
            onPlayNextMatch={handlePlayNextMatch}
            homeRevenue={homeRevenue}
            standings={standings}
            seasonLeaders={seasonLeaders}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
