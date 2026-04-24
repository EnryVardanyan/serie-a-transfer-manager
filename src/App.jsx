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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getInitialTeamCondition() {
  return Object.fromEntries(
    [...clubs.map((club) => club.name), ...opponentTeams.map((team) => team.name)].map((teamName) => [
      teamName,
      {
        form: 0,
        fatigue: 0
      }
    ])
  )
}

function tickUnavailablePlayers(currentUnavailablePlayers) {
  return Object.fromEntries(
    Object.entries(currentUnavailablePlayers).flatMap(([playerId, status]) => {
      if (status.matchesLeft <= 1) {
        return []
      }

      return [
        [
          playerId,
          {
            ...status,
            matchesLeft: status.matchesLeft - 1
          }
        ]
      ]
    })
  )
}

function generateRoundRobinSchedule(teamNames) {
  const teams = [...teamNames]

  if (teams.length % 2 !== 0) {
    teams.push(null)
  }

  const rounds = []
  let rotation = [...teams]
  const halfSize = rotation.length / 2

  for (let roundIndex = 0; roundIndex < rotation.length - 1; roundIndex += 1) {
    const fixtures = []

    for (let pairIndex = 0; pairIndex < halfSize; pairIndex += 1) {
      const firstTeam = rotation[pairIndex]
      const secondTeam = rotation[rotation.length - 1 - pairIndex]

      if (!firstTeam || !secondTeam) {
        continue
      }

      const reverseHomeAway = (roundIndex + pairIndex) % 2 === 1

      fixtures.push(
        reverseHomeAway
          ? { homeTeam: secondTeam, awayTeam: firstTeam }
          : { homeTeam: firstTeam, awayTeam: secondTeam }
      )
    }

    rounds.push(fixtures)
    rotation = [
      rotation[0],
      rotation[rotation.length - 1],
      ...rotation.slice(1, rotation.length - 1)
    ]
  }

  const secondLeg = rounds.map((fixtures) =>
    fixtures.map((fixture) => ({
      homeTeam: fixture.awayTeam,
      awayTeam: fixture.homeTeam
    }))
  )

  return [...rounds, ...secondLeg]
}

function balanceSelectedClubFixtures(rounds, clubName) {
  const balancedRounds = rounds.map((fixtures) => fixtures.map((fixture) => ({ ...fixture })))
  let previousWasHome = null
  let streak = 0

  balancedRounds.forEach((fixtures) => {
    const fixtureIndex = fixtures.findIndex(
      (fixture) => fixture.homeTeam === clubName || fixture.awayTeam === clubName
    )

    if (fixtureIndex === -1) {
      return
    }

    const fixture = fixtures[fixtureIndex]
    let isHome = fixture.homeTeam === clubName

    if (previousWasHome === isHome) {
      streak += 1
    } else {
      streak = 1
    }

    if (streak >= 3) {
      fixtures[fixtureIndex] = {
        homeTeam: fixture.awayTeam,
        awayTeam: fixture.homeTeam
      }

      isHome = !isHome
      streak = 1
    }

    previousWasHome = isHome
  })

  return balancedRounds
}

const emergencyCoverMap = {
  lb: ['CB', 'RB', 'LM', 'CDM'],
  cb1: ['LB', 'RB', 'CDM'],
  cb2: ['LB', 'RB', 'CDM'],
  rb: ['CB', 'LB', 'RM', 'CDM'],
  cdm: ['CB', 'CAM'],
  cm1: ['CDM', 'LW', 'RW', 'LM', 'RM'],
  cm2: ['CDM', 'LW', 'RW', 'LM', 'RM'],
  lw: ['RW', 'LM', 'CAM', 'CM'],
  st: ['CAM', 'RW', 'LW'],
  rw: ['LW', 'RM', 'CAM', 'CM']
}

function getSlotCandidatePool(slot, players) {
  if (!slot) {
    return []
  }

  const primaryPlayers = players
    .filter((player) => slot.allowed.includes(player.position))
    .map((player) => ({
      ...player,
      isEmergencyCover: false
    }))

  if (primaryPlayers.length > 0) {
    return primaryPlayers
  }

  const emergencyPositions = emergencyCoverMap[slot.key] || []

  return players
    .filter((player) => emergencyPositions.includes(player.position))
    .map((player) => ({
      ...player,
      isEmergencyCover: true
    }))
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
  const [matchRewards, setMatchRewards] = useState(0)
  const [playerSeasonStats, setPlayerSeasonStats] = useState({})
  const [teamCondition, setTeamCondition] = useState(getInitialTeamCondition)
  const [unavailablePlayers, setUnavailablePlayers] = useState({})

  const clubPlayers = useMemo(() => {
    return serieAPlayers
      .filter((player) => player.club === selectedClub.name)
      .sort((firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating)
  }, [selectedClub.name])

  const teamSquads = useMemo(() => {
    return Object.fromEntries([
      ...clubs.map((club) => [
        club.name,
        serieAPlayers.filter((player) => player.club === club.name)
      ]),
      ...opponentTeams.map((team) => [team.name, team.squad])
    ])
  }, [])
  const teamDirectory = useMemo(() => {
    return Object.fromEntries([
      ...clubs.map((club, index) => [
        club.name,
        {
          name: club.name,
          city: club.city,
          rating: club.rating,
          squad: teamSquads[club.name] || [],
          tablePosition: index + 1
        }
      ]),
      ...opponentTeams.map((team) => [team.name, team])
    ])
  }, [teamSquads])

  const squadPool = useMemo(() => {
    return [...clubPlayers, ...signedPlayers].sort(
      (firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating
    )
  }, [clubPlayers, signedPlayers])

  const availableSquadPool = useMemo(() => {
    return squadPool.filter((player) => !unavailablePlayers[player.id])
  }, [squadPool, unavailablePlayers])

  const autoLineup = useMemo(() => {
    const usedIds = new Set()

    return formationSlots.reduce((lineup, slot) => {
      const candidate = getSlotCandidatePool(
        slot,
        availableSquadPool.filter((player) => !usedIds.has(player.id))
      )[0]

      if (candidate) {
        usedIds.add(candidate.id)
        lineup[slot.key] = candidate
      }

      return lineup
    }, {})
  }, [availableSquadPool])

  const finalLineup = useMemo(() => {
    const lineup = { ...autoLineup }

    Object.entries(lineupOverrides).forEach(([slotKey, playerId]) => {
      const slot = formationSlots.find((item) => item.key === slotKey)
      const player = getSlotCandidatePool(slot, availableSquadPool).find(
        (item) => item.id === playerId
      )

      if (!slot || !player) {
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
  }, [autoLineup, availableSquadPool, lineupOverrides])

  const selectedSlotConfig = formationSlots.find((slot) => slot.key === selectedSlot)

  const availableForSlot = useMemo(() => {
    return getSlotCandidatePool(selectedSlotConfig, availableSquadPool)
      .map((player) => ({
        ...player,
        isSelected: finalLineup[selectedSlot]?.id === player.id,
        assignedSlot: formationSlots.find((slot) => finalLineup[slot.key]?.id === player.id)?.label || null
      }))
  }, [availableSquadPool, finalLineup, selectedSlot, selectedSlotConfig])

  const unavailableClubPlayers = useMemo(() => {
    return squadPool
      .filter((player) => unavailablePlayers[player.id])
      .map((player) => ({
        ...player,
        ...unavailablePlayers[player.id]
      }))
      .sort((firstPlayer, secondPlayer) => secondPlayer.matchesLeft - firstPlayer.matchesLeft)
  }, [squadPool, unavailablePlayers])

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
  const remainingBudget = selectedClub.budget + homeRevenue + matchRewards - spent

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

  const leagueTeams = useMemo(() => {
    return [...clubs.map((club) => club.name), ...opponentTeams.map((team) => team.name)]
  }, [])
  const fullSeasonSchedule = useMemo(() => {
    return balanceSelectedClubFixtures(generateRoundRobinSchedule(leagueTeams), selectedClub.name)
  }, [leagueTeams, selectedClub.name])
  const currentRoundFixtures = seasonStarted ? fullSeasonSchedule[currentWeek] || null : null
  const nextFixture = currentRoundFixtures?.find(
    (fixture) => fixture.homeTeam === selectedClub.name || fixture.awayTeam === selectedClub.name
  )
  const nextOpponent = nextFixture
    ? teamDirectory[nextFixture.homeTeam === selectedClub.name ? nextFixture.awayTeam : nextFixture.homeTeam]
    : null
  const seasonFinished = seasonStarted && currentWeek >= fullSeasonSchedule.length
  const isHomeMatch = seasonStarted && !seasonFinished ? nextFixture?.homeTeam === selectedClub.name : false

  const affordablePlayers = useMemo(() => {
    return marketPlayers.map((player) => ({
      ...player,
      canBuy: player.value <= remainingBudget,
      isSigned: signedPlayers.some((signedPlayer) => signedPlayer.name === player.name),
      valueLabel: player.value >= 50 ? 'Star deal' : player.value >= 25 ? 'First-team move' : 'Rotation deal'
    }))
  }, [marketPlayers, remainingBudget, signedPlayers])

  const selectedClubCondition = teamCondition[selectedClub.name] || { form: 0, fatigue: 0 }
  const nextOpponentCondition = nextOpponent
    ? teamCondition[nextOpponent.name] || { form: 0, fatigue: 0 }
    : { form: 0, fatigue: 0 }
  const selectedClubUnavailableCount = unavailableClubPlayers.length
  const nextOpponentUnavailableCount = nextOpponent
    ? (teamSquads[nextOpponent.name] || []).filter((player) => unavailablePlayers[player.id]).length
    : 0

  const buildAvailableLineup = (teamName) => {
    const availablePlayers = [...(teamSquads[teamName] || [])]
      .filter((player) => !unavailablePlayers[player.id])
      .sort((firstPlayer, secondPlayer) => secondPlayer.rating - firstPlayer.rating)
    const usedIds = new Set()
    const lineup = []

    formationSlots.forEach((slot) => {
      const candidate = getSlotCandidatePool(
        slot,
        availablePlayers.filter((player) => !usedIds.has(player.id))
      )[0]

      if (candidate) {
        usedIds.add(candidate.id)
        lineup.push(candidate)
      }
    })

    availablePlayers.forEach((player) => {
      if (lineup.length < 11 && !usedIds.has(player.id)) {
        usedIds.add(player.id)
        lineup.push(player)
      }
    })

    return lineup
  }

  const handleSelectClub = (club) => {
    setSelectedClub(club)
    setSignedPlayers([])
    setSeasonStarted(false)
    setCurrentWeek(0)
    setMatchResults([])
    setSelectedSlot('st')
    setLineupOverrides({})
    setHomeRevenue(0)
    setMatchRewards(0)
    setPlayerSeasonStats({})
    setTeamCondition(getInitialTeamCondition())
    setUnavailablePlayers({})
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
    setMatchRewards(0)
    setPlayerSeasonStats({})
    setTeamCondition(getInitialTeamCondition())
    setUnavailablePlayers({})
  }

  const handleAssignPlayerToSlot = (playerId) => {
    setLineupOverrides((currentOverrides) => ({
      ...currentOverrides,
      [selectedSlot]: playerId
    }))
  }

  const handlePlayNextMatch = () => {
    if (!nextOpponent || !nextFixture || !currentRoundFixtures) return

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

    const simulateFixture = (homeTeam, awayTeam) => {
      const homeLineup =
        homeTeam === selectedClub.name
          ? formationSlots.map((slot) => finalLineup[slot.key]).filter(Boolean)
          : buildAvailableLineup(homeTeam)
      const awayLineup =
        awayTeam === selectedClub.name
          ? formationSlots.map((slot) => finalLineup[slot.key]).filter(Boolean)
          : buildAvailableLineup(awayTeam)

      const homeCondition = teamCondition[homeTeam] || { form: 0, fatigue: 0 }
      const awayCondition = teamCondition[awayTeam] || { form: 0, fatigue: 0 }
      const homeBaseStrength =
        homeTeam === selectedClub.name
          ? selectedClubStrength
          : Math.round(
              homeLineup.reduce((sum, player) => sum + player.rating, 0) / Math.max(homeLineup.length, 1)
            )
      const awayBaseStrength =
        awayTeam === selectedClub.name
          ? selectedClubStrength
          : Math.round(
              awayLineup.reduce((sum, player) => sum + player.rating, 0) / Math.max(awayLineup.length, 1)
            )

      const homeEffectiveStrength =
        homeBaseStrength + homeCondition.form * 0.7 - homeCondition.fatigue * 0.65 + 0.35
      const awayEffectiveStrength =
        awayBaseStrength + awayCondition.form * 0.7 - awayCondition.fatigue * 0.65
      const strengthGap = homeEffectiveStrength - awayEffectiveStrength
      const homeExpected = 1.05 + strengthGap / 18 + nextRandom() * 0.85
      const awayExpected = 0.9 - strengthGap / 20 + nextRandom() * 0.8

      let homeGoals = clamp(Math.round(homeExpected + nextRandom() * 0.7 - 0.35), 0, 4)
      let awayGoals = clamp(Math.round(awayExpected + nextRandom() * 0.7 - 0.35), 0, 4)

      if (Math.abs(strengthGap) < 4 && nextRandom() > 0.45) {
        const drawGoals = clamp(Math.round(((homeExpected + awayExpected) / 2) * 0.75), 0, 3)
        homeGoals = drawGoals
        awayGoals = drawGoals
      } else if (Math.abs(homeGoals - awayGoals) > 2 && nextRandom() > 0.55) {
        if (homeGoals > awayGoals) {
          homeGoals -= 1
        } else {
          awayGoals -= 1
        }
      }

      return {
        homeTeam,
        awayTeam,
        homeLineup,
        awayLineup,
        homeGoals,
        awayGoals
      }
    }

    const selectedMatch = simulateFixture(nextFixture.homeTeam, nextFixture.awayTeam)
    const homeLineup = selectedMatch.homeLineup
    const awayLineup = selectedMatch.awayLineup
    const homeGoals = selectedMatch.homeGoals
    const awayGoals = selectedMatch.awayGoals
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
    const selectedClubGoals =
      selectedMatch.homeTeam === selectedClub.name ? selectedMatch.homeGoals : selectedMatch.awayGoals
    const opponentGoals =
      selectedMatch.homeTeam === selectedClub.name ? selectedMatch.awayGoals : selectedMatch.homeGoals
    const resultReward =
      selectedClubGoals > opponentGoals ? 4 : selectedClubGoals === opponentGoals ? 2 : 0
    const totalReward = gateRevenue + resultReward

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
      if (fallback.length === 0) {
        return null
      }

      return fallback[Math.floor(nextRandom() * fallback.length)]
    }

    const createGoalEvents = (goals, lineup) => {
      if (goals === 0 || lineup.length === 0) {
        return []
      }

      const scorerPool = getWeightedContributors(lineup, true)
      const assistPool = getWeightedContributors(lineup, false)

      return Array.from({ length: goals }, () => {
        const scorer = pickRandomPlayer(scorerPool, lineup)
        if (!scorer) {
          return null
        }
        const assisted = nextRandom() > 0.18
        const assister = assisted
          ? pickRandomPlayer(assistPool, lineup, scorer.id)
          : null

        return {
          scorer,
          assister
        }
      }).filter(Boolean)
    }

    const homeEvents = createGoalEvents(homeGoals, homeLineup)
    const awayEvents = createGoalEvents(awayGoals, awayLineup)
    const otherFixtures = currentRoundFixtures
      .filter(
        (fixture) =>
          !(fixture.homeTeam === nextFixture.homeTeam && fixture.awayTeam === nextFixture.awayTeam)
      )
      .map((fixture) => simulateFixture(fixture.homeTeam, fixture.awayTeam))

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

    const registerFixtureStats = (homeLineupPlayers, awayLineupPlayers, homeFixtureEvents, awayFixtureEvents, goalsForHome, goalsForAway) => {
      registerGoalEvents(homeFixtureEvents)
      registerGoalEvents(awayFixtureEvents)

      buildRatingMap(homeLineupPlayers, homeFixtureEvents, goalsForHome, goalsForAway).forEach(
        ({ player, rating }) => {
          registerLineupAppearance(player, rating)
        }
      )
      buildRatingMap(awayLineupPlayers, awayFixtureEvents, goalsForAway, goalsForHome).forEach(
        ({ player, rating }) => {
          registerLineupAppearance(player, rating)
        }
      )
    }

    registerFixtureStats(homeLineup, awayLineup, homeEvents, awayEvents, homeGoals, awayGoals)

    otherFixtures.forEach((fixture) => {
      const fixtureHomeEvents = createGoalEvents(fixture.homeGoals, fixture.homeLineup)
      const fixtureAwayEvents = createGoalEvents(fixture.awayGoals, fixture.awayLineup)

      fixture.homeEvents = fixtureHomeEvents.map((event) => ({
        scorer: event.scorer.name,
        assister: event.assister?.name || null
      }))
      fixture.awayEvents = fixtureAwayEvents.map((event) => ({
        scorer: event.scorer.name,
        assister: event.assister?.name || null
      }))

      registerFixtureStats(
        fixture.homeLineup,
        fixture.awayLineup,
        fixtureHomeEvents,
        fixtureAwayEvents,
        fixture.homeGoals,
        fixture.awayGoals
      )
    })

    const nextCondition = { ...teamCondition }
    const nextUnavailablePlayers = tickUnavailablePlayers(unavailablePlayers)
    const availabilityNews = []

    const updateTeamCondition = (teamName, goalsFor, goalsAgainst) => {
      const currentCondition = nextCondition[teamName] || { form: 0, fatigue: 0 }
      const margin = goalsFor - goalsAgainst
      const resultBoost = margin > 0 ? 0.75 : margin < 0 ? -0.75 : 0.05
      const goalSwing = clamp(margin * 0.14, -0.4, 0.4)
      const variance = nextRandom() * 0.18 - 0.09
      const intensity = Math.max(0, goalsFor + goalsAgainst - 2) * 0.08

      nextCondition[teamName] = {
        form: clamp(currentCondition.form * 0.45 + resultBoost + goalSwing + variance, -3.5, 3.5),
        fatigue: clamp(currentCondition.fatigue * 0.55 + 0.72 + intensity + nextRandom() * 0.18, 0, 3.8)
      }
    }

    const addAvailabilityIssue = (player, type, matchesLeft) => {
      if (!player) {
        return
      }

      const currentIssue = nextUnavailablePlayers[player.id]
      nextUnavailablePlayers[player.id] = {
        type,
        matchesLeft: Math.max(currentIssue?.matchesLeft || 0, matchesLeft),
        label: type === 'injury' ? 'Injured' : 'Suspended',
        club: player.club,
        name: player.name
      }
    }

    const rollAvailabilityEvents = (lineup, clubName, includeNews = false) => {
      if (lineup.length === 0) {
        return
      }

      const outfieldPlayers = lineup.filter((player) => player.position !== 'GK')

      if (outfieldPlayers.length > 0 && nextRandom() > 0.88) {
        const injuredPlayer = pickRandomPlayer(outfieldPlayers, lineup)
        const injuryLength = 1 + Math.floor(nextRandom() * 3)
        addAvailabilityIssue(injuredPlayer, 'injury', injuryLength)

        if (includeNews) {
          availabilityNews.push(`${injuredPlayer.name} injured for ${injuryLength} match${injuryLength > 1 ? 'es' : ''}`)
        }
      }

      if (outfieldPlayers.length > 0 && nextRandom() > 0.9) {
        const suspendedPlayer = pickRandomPlayer(outfieldPlayers, lineup)
        addAvailabilityIssue(suspendedPlayer, 'suspension', 1)

        if (includeNews) {
          availabilityNews.push(`${suspendedPlayer.name} suspended for next match`)
        }
      }
    }

    updateTeamCondition(selectedMatch.homeTeam, selectedMatch.homeGoals, selectedMatch.awayGoals)
    updateTeamCondition(selectedMatch.awayTeam, selectedMatch.awayGoals, selectedMatch.homeGoals)
    rollAvailabilityEvents(
      homeLineup,
      selectedMatch.homeTeam,
      selectedMatch.homeTeam === selectedClub.name || selectedMatch.awayTeam === selectedClub.name
    )
    rollAvailabilityEvents(
      awayLineup,
      selectedMatch.awayTeam,
      selectedMatch.homeTeam === selectedClub.name || selectedMatch.awayTeam === selectedClub.name
    )
    otherFixtures.forEach((fixture) => {
      updateTeamCondition(fixture.homeTeam, fixture.homeGoals, fixture.awayGoals)
      updateTeamCondition(fixture.awayTeam, fixture.awayGoals, fixture.homeGoals)
      rollAvailabilityEvents(fixture.homeLineup, fixture.homeTeam)
      rollAvailabilityEvents(fixture.awayLineup, fixture.awayTeam)
    })

    setMatchResults((currentResults) => [
      ...currentResults,
      {
        week: currentWeek + 1,
        homeTeam: selectedMatch.homeTeam,
        awayTeam: selectedMatch.awayTeam,
        homeGoals: selectedMatch.homeGoals,
        awayGoals: selectedMatch.awayGoals,
        gateRevenue,
        resultReward,
        totalReward,
        isHomeMatch,
        homeEvents: homeEvents.map((event) => ({
          scorer: event.scorer.name,
          assister: event.assister?.name || null
        })),
        awayEvents: awayEvents.map((event) => ({
          scorer: event.scorer.name,
          assister: event.assister?.name || null
        })),
        otherFixtures,
        availabilityNews
      }
    ])
    setPlayerSeasonStats(nextStats)
    setTeamCondition(nextCondition)
    setUnavailablePlayers(nextUnavailablePlayers)
    if (gateRevenue > 0) {
      setHomeRevenue((currentRevenue) => currentRevenue + gateRevenue)
    }
    if (resultReward > 0) {
      setMatchRewards((currentRewards) => currentRewards + resultReward)
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
          selectedClubCondition={selectedClubCondition}
          signedPlayersCount={signedPlayers.length}
          databaseCount={serieAPlayers.length}
          opponentsCount={opponentTeams.length}
          homeRevenue={homeRevenue}
          matchRewards={matchRewards}
          seasonFixturesCount={fullSeasonSchedule.length}
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
            unavailablePlayers={unavailableClubPlayers}
            onAssignPlayer={handleAssignPlayerToSlot}
          />
          <SeasonPanel
            seasonStarted={seasonStarted}
            seasonFinished={seasonFinished}
            seasonFixturesCount={fullSeasonSchedule.length}
            currentWeek={currentWeek}
            selectedClubName={selectedClub.name}
            selectedClubCondition={selectedClubCondition}
            selectedClubUnavailableCount={selectedClubUnavailableCount}
            nextOpponent={nextOpponent}
            nextOpponentCondition={nextOpponentCondition}
            nextOpponentUnavailableCount={nextOpponentUnavailableCount}
            isHomeMatch={isHomeMatch}
            matchResults={matchResults}
            onPlayNextMatch={handlePlayNextMatch}
            homeRevenue={homeRevenue}
            matchRewards={matchRewards}
            standings={standings}
            seasonLeaders={seasonLeaders}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
