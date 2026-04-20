const squadTemplate = [
  ['GK', 'Starting goalkeeper', 1],
  ['GK', 'Cup goalkeeper', 2],
  ['CB', 'Defensive leader', 3],
  ['CB', 'Stopper', 4],
  ['CB', 'Cover defender', 5],
  ['LB', 'Left back', 6],
  ['RB', 'Right back', 7],
  ['CB', 'Young defender', 8],
  ['CDM', 'Holding midfielder', 9],
  ['CM', 'Box-to-box midfielder', 10],
  ['CM', 'Tempo midfielder', 11],
  ['CAM', 'Creative midfielder', 12],
  ['LM', 'Left midfielder', 13],
  ['RM', 'Right midfielder', 14],
  ['CM', 'Rotation midfielder', 15],
  ['LW', 'Wide forward', 16],
  ['ST', 'Main striker', 17],
  ['RW', 'Second forward', 18]
]

const opponentConfigs = [
  { name: 'Como', city: 'Como', tablePosition: 6, rating: 79, budget: 34 },
  { name: 'Lazio', city: 'Roma', tablePosition: 8, rating: 79, budget: 30 },
  { name: 'Bologna', city: 'Bologna', tablePosition: 9, rating: 78, budget: 28 },
  { name: 'Sassuolo', city: 'Sassuolo', tablePosition: 10, rating: 76, budget: 22 },
  { name: 'Udinese', city: 'Udine', tablePosition: 11, rating: 76, budget: 22 },
  { name: 'Cagliari', city: 'Cagliari', tablePosition: 12, rating: 75, budget: 18 },
  { name: 'Torino', city: 'Torino', tablePosition: 13, rating: 75, budget: 20 },
  { name: 'Genoa', city: 'Genova', tablePosition: 14, rating: 74, budget: 18 },
  { name: 'Cremonese', city: 'Cremona', tablePosition: 15, rating: 73, budget: 14 },
  { name: 'Parma', city: 'Parma', tablePosition: 16, rating: 73, budget: 16 },
  { name: 'Lecce', city: 'Lecce', tablePosition: 17, rating: 72, budget: 13 },
  { name: 'Fiorentina', city: 'Firenze', tablePosition: 18, rating: 76, budget: 24 },
  { name: 'Pisa', city: 'Pisa', tablePosition: 19, rating: 71, budget: 12 },
  { name: 'Verona', city: 'Verona', tablePosition: 20, rating: 71, budget: 12 }
]

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getLineRating(teamRating, position, index) {
  const starterBoost = index <= 4 ? 2 : 0
  const rotationDrop = index >= 14 ? -2 : 0
  const keeperBoost = position === 'GK' && index === 1 ? 1 : 0
  const strikerBoost = ['ST', 'LW', 'RW'].includes(position) ? 1 : 0

  return Math.max(
    62,
    Math.min(84, teamRating + starterBoost + rotationDrop + keeperBoost + strikerBoost)
  )
}

function getPlayerValue(rating, ageProfile) {
  const baseValue = Math.max(1, Math.round((rating - 62) * 1.8))

  if (ageProfile === 'young') {
    return Math.round(baseValue * 1.25)
  }

  if (ageProfile === 'veteran') {
    return Math.max(1, Math.round(baseValue * 0.55))
  }

  return baseValue
}

function createOpponentPlayer(team, [position, role, squadNumber]) {
  const ageProfile = squadNumber <= 8 ? 'prime' : squadNumber >= 15 ? 'young' : 'rotation'
  const age =
    ageProfile === 'prime'
      ? 27 + (squadNumber % 4)
      : ageProfile === 'young'
        ? 20 + (squadNumber % 4)
        : 24 + (squadNumber % 5)
  const rating = getLineRating(team.rating, position, squadNumber)

  return {
    id: `${slugify(team.name)}-${squadNumber}`,
    name: `${team.name} ${role}`,
    club: team.name,
    position,
    age,
    rating,
    potential: ageProfile === 'young' ? Math.min(86, rating + 5) : rating,
    value: getPlayerValue(rating, ageProfile),
    role
  }
}

const opponentTeams = opponentConfigs.map((team) => ({
  ...team,
  squad: squadTemplate.map((templateItem) => createOpponentPlayer(team, templateItem))
}))

export const opponentSquadRules = {
  totalPlayers: 18,
  GK: 2,
  DEF: 6,
  MID: 7,
  FWD: 3
}

export function getOpponentSquadBalance(squad) {
  return squad.reduce(
    (balance, player) => {
      if (player.position === 'GK') {
        balance.GK += 1
      } else if (['CB', 'LB', 'RB'].includes(player.position)) {
        balance.DEF += 1
      } else if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(player.position)) {
        balance.MID += 1
      } else if (['LW', 'RW', 'ST'].includes(player.position)) {
        balance.FWD += 1
      }

      balance.totalPlayers += 1
      return balance
    },
    {
      totalPlayers: 0,
      GK: 0,
      DEF: 0,
      MID: 0,
      FWD: 0
    }
  )
}

export default opponentTeams
