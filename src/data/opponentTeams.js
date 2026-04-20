const rawOpponentTeams = [
  {
    name: 'Como',
    city: 'Como',
    tablePosition: 6,
    rating: 79,
    budget: 34,
    players: [
      ['Jean Butez', 'GK', 30, 78, 'Starting goalkeeper'],
      ['Noel Tornqvist', 'GK', 24, 74, 'Cup goalkeeper'],
      ['Jacobo Ramon', 'CB', 21, 79, 'Young ball-playing defender'],
      ['Diego Carlos', 'CB', 32, 78, 'Veteran stopper'],
      ['Marc Oliver Kempf', 'CB', 31, 76, 'Left center back'],
      ['Edoardo Goldaniga', 'CB', 32, 75, 'Defensive rotation'],
      ['Alex Valle', 'LB', 21, 78, 'Attacking fullback'],
      ['Ignace Van der Brempt', 'RB', 23, 76, 'Quick right back'],
      ['Maximo Perrone', 'CDM', 23, 80, 'Deep playmaker'],
      ['Maxence Caqueret', 'CM', 25, 79, 'Tempo midfielder'],
      ['Lucas Da Cunha', 'CM', 24, 79, 'Technical midfielder'],
      ['Sergi Roberto', 'CM', 33, 76, 'Veteran organizer'],
      ['Nico Paz', 'CAM', 21, 83, 'Star creator'],
      ['Martin Baturina', 'CAM', 22, 80, 'Creative midfielder'],
      ['Mergim Vojvoda', 'RM', 31, 75, 'Wide utility player'],
      ['Jesus Rodriguez', 'LW', 20, 79, 'Direct winger'],
      ['Jayden Addai', 'RW', 20, 78, 'Young wide forward'],
      ['Anastasios Douvikas', 'ST', 26, 78, 'Penalty-box striker']
    ]
  },
  {
    name: 'Lazio',
    city: 'Roma',
    tablePosition: 8,
    rating: 79,
    budget: 30,
    players: [
      ['Christos Mandas', 'GK', 24, 78, 'Starting goalkeeper'],
      ['Ivan Provedel', 'GK', 31, 77, 'Experienced goalkeeper'],
      ['Mario Gila', 'CB', 25, 80, 'Defensive leader'],
      ['Alessio Romagnoli', 'CB', 31, 79, 'Left center back'],
      ['Oliver Provstgaard', 'CB', 22, 76, 'Developing defender'],
      ['Samuel Gigot', 'CB', 32, 75, 'Physical stopper'],
      ['Nuno Tavares', 'LB', 25, 79, 'Attacking fullback'],
      ['Adam Marusic', 'RB', 33, 76, 'Veteran fullback'],
      ['Nicolo Rovella', 'CDM', 24, 82, 'Midfield anchor'],
      ['Reda Belahyane', 'CDM', 21, 78, 'Pressing midfielder'],
      ['Danilo Cataldi', 'CDM', 31, 76, 'Deep midfielder'],
      ['Kenneth Taylor', 'CM', 23, 80, 'Box-to-box midfielder'],
      ['Toma Basic', 'CM', 29, 75, 'Rotation midfielder'],
      ['Matias Vecino', 'CM', 34, 75, 'Veteran midfielder'],
      ['Fisayo Dele-Bashiru', 'CAM', 24, 77, 'Attacking midfielder'],
      ['Mattia Zaccagni', 'LW', 30, 81, 'Captain winger'],
      ['Gustav Isaksen', 'RW', 24, 80, 'Direct winger'],
      ['Boulaye Dia', 'ST', 29, 79, 'Mobile striker']
    ]
  },
  {
    name: 'Bologna',
    city: 'Bologna',
    tablePosition: 9,
    rating: 78,
    budget: 28,
    players: [
      ['Lukasz Skorupski', 'GK', 34, 78, 'Starting goalkeeper'],
      ['Federico Ravaglia', 'GK', 26, 75, 'Backup goalkeeper'],
      ['Jhon Lucumi', 'CB', 27, 81, 'Defensive leader'],
      ['Torbjorn Heggem', 'CB', 27, 79, 'Strong center back'],
      ['Martin Vitik', 'CB', 23, 78, 'Young defender'],
      ['Nicolo Casale', 'CB', 27, 77, 'Rotation center back'],
      ['Juan Miranda', 'LB', 26, 79, 'Attacking left back'],
      ['Emil Holm', 'RB', 25, 78, 'Direct right back'],
      ['Nikola Moro', 'CDM', 27, 77, 'Holding midfielder'],
      ['Lewis Ferguson', 'CM', 26, 81, 'Box-to-box captain'],
      ['Tommaso Pobega', 'CM', 26, 78, 'Physical midfielder'],
      ['Simon Sohm', 'CM', 24, 78, 'Ball carrier'],
      ['Remo Freuler', 'CM', 33, 77, 'Experienced organizer'],
      ['Giovanni Fabbian', 'CAM', 23, 78, 'Arriving midfielder'],
      ['Jens Odgaard', 'CAM', 27, 77, 'Second striker'],
      ['Riccardo Orsolini', 'RW', 29, 81, 'Star winger'],
      ['Santiago Castro', 'ST', 21, 80, 'Young striker'],
      ['Nicolo Cambiaghi', 'LW', 25, 78, 'Wide forward']
    ]
  },
  {
    name: 'Sassuolo',
    city: 'Sassuolo',
    tablePosition: 10,
    rating: 76,
    budget: 22,
    players: [
      ['Arijanet Muric', 'GK', 27, 77, 'Starting goalkeeper'],
      ['Stefano Turati', 'GK', 24, 75, 'Backup goalkeeper'],
      ['Tarik Muharemovic', 'CB', 22, 78, 'Young center back'],
      ['Jay Idzes', 'CB', 25, 77, 'Defensive leader'],
      ['Fali Cande', 'CB', 28, 74, 'Physical defender'],
      ['Cas Odenthal', 'CB', 25, 73, 'Rotation defender'],
      ['Josh Doig', 'LB', 23, 76, 'Attacking fullback'],
      ['Sebastian Walukiewicz', 'RB', 25, 75, 'Defensive fullback'],
      ['Daniel Boloca', 'CDM', 27, 76, 'Holding midfielder'],
      ['Luca Lipani', 'CDM', 20, 75, 'Young midfielder'],
      ['Nemanja Matic', 'CDM', 37, 75, 'Veteran anchor'],
      ['Ismael Kone', 'CM', 23, 78, 'Ball carrier'],
      ['Kristian Thorstvedt', 'CM', 26, 78, 'Box-to-box midfielder'],
      ['Aster Vranckx', 'CM', 23, 77, 'Dynamic midfielder'],
      ['Cristian Volpato', 'CAM', 22, 78, 'Creative midfielder'],
      ['Armand Lauriente', 'LW', 27, 80, 'Explosive winger'],
      ['Domenico Berardi', 'RW', 31, 80, 'Club star'],
      ['Andrea Pinamonti', 'ST', 26, 80, 'Main striker']
    ]
  },
  {
    name: 'Udinese',
    city: 'Udine',
    tablePosition: 11,
    rating: 76,
    budget: 22,
    players: [
      ['Maduka Okoye', 'GK', 26, 78, 'Starting goalkeeper'],
      ['Razvan Sava', 'GK', 23, 75, 'Backup goalkeeper'],
      ['Oumar Solet', 'CB', 25, 80, 'Defensive leader'],
      ['Thomas Kristensen', 'CB', 24, 78, 'Tall defender'],
      ['Nicolo Bertola', 'CB', 22, 77, 'Young center back'],
      ['Saba Goglichidze', 'CB', 21, 76, 'Developing defender'],
      ['Jordan Zemura', 'LB', 26, 76, 'Left wingback'],
      ['Alessandro Zanoli', 'RB', 25, 76, 'Right wingback'],
      ['Jesper Karlstrom', 'CDM', 30, 76, 'Holding midfielder'],
      ['Arthur Atta', 'CM', 23, 79, 'Ball carrier'],
      ['Lennon Miller', 'CM', 19, 78, 'Young playmaker'],
      ['Jurgen Ekkelenkamp', 'CM', 25, 77, 'Technical midfielder'],
      ['Sandi Lovric', 'CM', 27, 77, 'Creative midfielder'],
      ['Jakub Piotrowski', 'CM', 28, 76, 'Rotation midfielder'],
      ['Nicolo Zaniolo', 'CAM', 26, 79, 'Attacking creator'],
      ['Idrissa Gueye', 'ST', 19, 76, 'Young striker'],
      ['Keinan Davis', 'ST', 27, 77, 'Power striker'],
      ['Adam Buksa', 'ST', 29, 77, 'Target striker']
    ]
  },
  {
    name: 'Cagliari',
    city: 'Cagliari',
    tablePosition: 12,
    rating: 75,
    budget: 18,
    players: [
      ['Elia Caprile', 'GK', 24, 78, 'Starting goalkeeper'],
      ['Boris Radunovic', 'GK', 29, 73, 'Backup goalkeeper'],
      ['Sebastiano Luperto', 'CB', 29, 76, 'Defensive leader'],
      ['Juan Rodriguez', 'CB', 20, 74, 'Young defender'],
      ['Yerry Mina', 'CB', 31, 75, 'Physical stopper'],
      ['Ze Pedro', 'CB', 28, 74, 'Rotation center back'],
      ['Riyad Idrissi', 'LB', 20, 73, 'Young fullback'],
      ['Marco Palestra', 'RB', 20, 76, 'Attacking right back'],
      ['Matteo Prati', 'CDM', 21, 76, 'Deep midfielder'],
      ['Michel Adopo', 'CM', 25, 76, 'Ball winner'],
      ['Michael Folorunsho', 'CM', 27, 76, 'Power midfielder'],
      ['Alessandro Deiola', 'CM', 30, 74, 'Club midfielder'],
      ['Luca Mazzitelli', 'CM', 30, 74, 'Rotation midfielder'],
      ['Gianluca Gaetano', 'CAM', 25, 76, 'Creative midfielder'],
      ['Nicolo Cavuoti', 'CAM', 22, 73, 'Young creator'],
      ['Mattia Felici', 'LW', 24, 75, 'Wide forward'],
      ['Sebastiano Esposito', 'CF', 23, 77, 'Second striker'],
      ['Semih Kilicsoy', 'ST', 20, 78, 'Young striker']
    ]
  },
  {
    name: 'Torino',
    city: 'Torino',
    tablePosition: 13,
    rating: 75,
    budget: 20,
    players: [
      ['Franco Israel', 'GK', 25, 76, 'Starting goalkeeper'],
      ['Alberto Paleari', 'GK', 33, 73, 'Backup goalkeeper'],
      ['Saul Coco', 'CB', 26, 77, 'Defensive leader'],
      ['Ardian Ismajli', 'CB', 29, 76, 'Center back'],
      ['Guillermo Maripan', 'CB', 31, 75, 'Veteran stopper'],
      ['Adam Masina', 'CB', 32, 74, 'Left center back'],
      ['Niels Nkounkou', 'LB', 25, 75, 'Attacking fullback'],
      ['Valentino Lazaro', 'RB', 29, 76, 'Wide fullback'],
      ['Kristjan Asllani', 'CDM', 23, 78, 'Deep playmaker'],
      ['Adrien Tameze', 'CDM', 31, 74, 'Holding midfielder'],
      ['Cesare Casadei', 'CM', 23, 78, 'Box-to-box midfielder'],
      ['Ivan Ilic', 'CM', 24, 77, 'Tempo midfielder'],
      ['Gvidas Gineitis', 'CM', 21, 75, 'Young midfielder'],
      ['Nikola Vlasic', 'CAM', 28, 77, 'Creative midfielder'],
      ['Tino Anjorin', 'CAM', 24, 76, 'Attacking midfielder'],
      ['Zakaria Aboukhlal', 'RW', 25, 77, 'Direct winger'],
      ['Che Adams', 'ST', 29, 77, 'Main striker'],
      ['Giovanni Simeone', 'ST', 30, 76, 'Penalty-box striker']
    ]
  },
  {
    name: 'Genoa',
    city: 'Genova',
    tablePosition: 14,
    rating: 74,
    budget: 18,
    players: [
      ['Justin Bijlow', 'GK', 28, 77, 'Starting goalkeeper'],
      ['Nicola Leali', 'GK', 32, 74, 'Backup goalkeeper'],
      ['Johan Vasquez', 'CB', 27, 78, 'Defensive leader'],
      ['Leo Ostigard', 'CB', 26, 76, 'Aggressive defender'],
      ['Mattia Bani', 'CB', 32, 74, 'Veteran center back'],
      ['Sebastian Otoa', 'CB', 21, 73, 'Young defender'],
      ['Aaron Martin', 'LB', 28, 75, 'Left fullback'],
      ['Brooke Norton-Cuffy', 'RB', 22, 75, 'Athletic right back'],
      ['Morten Frendrup', 'CDM', 24, 79, 'Ball-winning midfielder'],
      ['Patrizio Masini', 'CM', 24, 74, 'Rotation midfielder'],
      ['Morten Thorsby', 'CM', 29, 75, 'Physical midfielder'],
      ['Nicolae Stanciu', 'CM', 32, 75, 'Experienced creator'],
      ['Ruslan Malinovskyi', 'CAM', 32, 76, 'Long-shot creator'],
      ['Junior Messias', 'RM', 34, 74, 'Wide veteran'],
      ['Vitinha', 'LM', 26, 76, 'Wide midfielder'],
      ['Caleb Ekuban', 'ST', 31, 74, 'Rotation striker'],
      ['Lorenzo Colombo', 'ST', 24, 76, 'Main striker'],
      ['Jeff Ekhator', 'ST', 19, 73, 'Young striker']
    ]
  },
  {
    name: 'Cremonese',
    city: 'Cremona',
    tablePosition: 15,
    rating: 73,
    budget: 14,
    players: [
      ['Emil Audero', 'GK', 28, 76, 'Starting goalkeeper'],
      ['Marco Silvestri', 'GK', 34, 73, 'Backup goalkeeper'],
      ['Mikayil Faye', 'CB', 21, 76, 'Young center back'],
      ['Federico Baschirotto', 'CB', 29, 75, 'Defensive leader'],
      ['Matteo Bianchetti', 'CB', 32, 73, 'Veteran defender'],
      ['Francesco Folino', 'CB', 23, 72, 'Rotation defender'],
      ['Giuseppe Pezzella', 'LB', 28, 74, 'Left fullback'],
      ['Filippo Terracciano', 'RB', 22, 74, 'Right fullback'],
      ['Alberto Grassi', 'CDM', 30, 73, 'Holding midfielder'],
      ['Warren Bondo', 'CM', 22, 77, 'Ball carrier'],
      ['Martin Payero', 'CM', 27, 75, 'Technical midfielder'],
      ['Jari Vandeputte', 'CM', 29, 74, 'Creator'],
      ['Michele Collocolo', 'CM', 26, 74, 'Box-to-box midfielder'],
      ['Alessio Zerbin', 'RM', 26, 75, 'Wide runner'],
      ['Franco Vazquez', 'CAM', 36, 74, 'Veteran playmaker'],
      ['Jeremy Sarmiento', 'LW', 23, 76, 'Wide forward'],
      ['Faris Moumbagna', 'ST', 25, 75, 'Power striker'],
      ['Antonio Sanabria', 'ST', 29, 75, 'Experienced striker']
    ]
  },
  {
    name: 'Parma',
    city: 'Parma',
    tablePosition: 16,
    rating: 73,
    budget: 16,
    players: [
      ['Zion Suzuki', 'GK', 23, 78, 'Starting goalkeeper'],
      ['Vicente Guaita', 'GK', 38, 72, 'Veteran backup'],
      ['Alessandro Circati', 'CB', 22, 75, 'Young leader'],
      ['Abdoulaye Ndiaye', 'CB', 23, 75, 'Center back'],
      ['Mariano Troilo', 'CB', 22, 74, 'Developing defender'],
      ['Lautaro Valenti', 'CB', 26, 72, 'Rotation defender'],
      ['Mathias Lovik', 'LB', 22, 74, 'Left fullback'],
      ['Enrico Delprato', 'RB', 26, 75, 'Right back captain'],
      ['Mandela Keita', 'CDM', 23, 77, 'Ball winner'],
      ['Nahuel Estevez', 'CDM', 30, 73, 'Holding midfielder'],
      ['Adrian Bernabe', 'CM', 24, 78, 'Creative midfielder'],
      ['Oliver Sorensen', 'CM', 23, 76, 'Box-to-box midfielder'],
      ['Christian Ordonez', 'CM', 21, 75, 'Young midfielder'],
      ['Benja Cremaschi', 'CM', 20, 74, 'Developing midfielder'],
      ['Gaetano Oristanio', 'CAM', 23, 75, 'Attacking creator'],
      ['Jacob Ondrejka', 'LW', 23, 76, 'Wide forward'],
      ['Matija Frigan', 'ST', 22, 75, 'Young striker'],
      ['Mateo Pellegrino', 'ST', 24, 75, 'Main striker']
    ]
  },
  {
    name: 'Lecce',
    city: 'Lecce',
    tablePosition: 17,
    rating: 72,
    budget: 13,
    players: [
      ['Wladimiro Falcone', 'GK', 30, 76, 'Starting goalkeeper'],
      ['Christian Fruchtl', 'GK', 26, 72, 'Backup goalkeeper'],
      ['Tiago Gabriel', 'CB', 21, 76, 'Young leader'],
      ['Jamil Siebert', 'CB', 23, 73, 'Center back'],
      ['Gaspar', 'CB', 28, 73, 'Physical defender'],
      ['Gaby Jean', 'CB', 25, 72, 'Rotation defender'],
      ['Antonino Gallo', 'LB', 26, 74, 'Left fullback'],
      ['Danilo Veiga', 'RB', 23, 72, 'Right fullback'],
      ['Ylber Ramadani', 'CDM', 29, 73, 'Holding midfielder'],
      ['Sadik Fofana', 'CDM', 22, 71, 'Young ball winner'],
      ['Medon Berisha', 'CM', 22, 75, 'Technical midfielder'],
      ['Lassana Coulibaly', 'CM', 29, 73, 'Physical midfielder'],
      ['Thorir Helgason', 'CM', 25, 73, 'Rotation midfielder'],
      ['Omri Gandelman', 'CAM', 25, 75, 'Attacking midfielder'],
      ['Filip Marchwinski', 'CAM', 24, 73, 'Creative option'],
      ['Riccardo Sottil', 'LW', 26, 75, 'Wide forward'],
      ['Santiago Pierotti', 'RW', 24, 74, 'Direct winger'],
      ['Francesco Camarda', 'ST', 17, 76, 'Wonderkid striker']
    ]
  },
  {
    name: 'Fiorentina',
    city: 'Firenze',
    tablePosition: 18,
    rating: 76,
    budget: 24,
    players: [
      ['David de Gea', 'GK', 35, 80, 'Starting goalkeeper'],
      ['Oliver Christensen', 'GK', 26, 73, 'Backup goalkeeper'],
      ['Pietro Comuzzo', 'CB', 20, 79, 'Young defender'],
      ['Marin Pongracic', 'CB', 28, 76, 'Center back'],
      ['Luca Ranieri', 'CB', 26, 76, 'Left center back'],
      ['Daniele Rugani', 'CB', 31, 74, 'Veteran defender'],
      ['Robin Gosens', 'LB', 31, 77, 'Attacking fullback'],
      ['Dodo', 'RB', 27, 79, 'Attacking right back'],
      ['Rolando Mandragora', 'CDM', 28, 77, 'Holding midfielder'],
      ['Nicolo Fagioli', 'CM', 24, 78, 'Deep creator'],
      ['Jacopo Fazzini', 'CM', 22, 77, 'Young midfielder'],
      ['Marco Brescianini', 'CM', 26, 76, 'Box-to-box midfielder'],
      ['Cher Ndour', 'CM', 21, 75, 'Developing midfielder'],
      ['Antonin Barak', 'CAM', 31, 76, 'Attacking midfielder'],
      ['Abdelhamid Sabiri', 'CAM', 29, 74, 'Creative option'],
      ['Jack Harrison', 'LW', 29, 77, 'Wide forward'],
      ['Moise Kean', 'ST', 25, 81, 'Main striker'],
      ['Roberto Piccoli', 'ST', 25, 78, 'Penalty-box striker']
    ]
  },
  {
    name: 'Pisa',
    city: 'Pisa',
    tablePosition: 19,
    rating: 71,
    budget: 12,
    players: [
      ['Adrian Semper', 'GK', 28, 74, 'Starting goalkeeper'],
      ['Simone Scuffet', 'GK', 29, 73, 'Backup goalkeeper'],
      ['Antonio Caracciolo', 'CB', 35, 71, 'Veteran defender'],
      ['Simone Canestrelli', 'CB', 25, 73, 'Center back'],
      ['Giovanni Bonfanti', 'CB', 23, 72, 'Young defender'],
      ['Arturo Calabresi', 'CB', 30, 71, 'Rotation defender'],
      ['Samuele Angori', 'LB', 22, 72, 'Left fullback'],
      ['Idrissa Toure', 'RB', 28, 72, 'Right side runner'],
      ['Marius Marin', 'CDM', 27, 73, 'Midfield anchor'],
      ['Michel Aebischer', 'CM', 29, 74, 'Experienced midfielder'],
      ['Malthe Hojholt', 'CM', 24, 72, 'Tempo midfielder'],
      ['Emanuel Vignato', 'CAM', 25, 73, 'Creative midfielder'],
      ['Ebenezer Akinsanmiro', 'CM', 21, 72, 'Young midfielder'],
      ['Matteo Tramoni', 'CAM', 26, 74, 'Attacking creator'],
      ['Gabriele Piccinini', 'CM', 24, 72, 'Rotation midfielder'],
      ['Stefano Moreo', 'ST', 32, 72, 'Experienced forward'],
      ['MBala Nzola', 'ST', 29, 75, 'Main striker'],
      ['Henrik Meister', 'ST', 22, 72, 'Young striker']
    ]
  },
  {
    name: 'Verona',
    city: 'Verona',
    tablePosition: 20,
    rating: 71,
    budget: 12,
    players: [
      ['Lorenzo Montipo', 'GK', 29, 75, 'Starting goalkeeper'],
      ['Simone Perilli', 'GK', 31, 71, 'Backup goalkeeper'],
      ['Victor Nelsson', 'CB', 27, 76, 'Defensive leader'],
      ['Nicolas Valentini', 'CB', 24, 73, 'Left center back'],
      ['Diego Coppola', 'CB', 22, 74, 'Young defender'],
      ['Martin Frese', 'LB', 28, 72, 'Left fullback'],
      ['Domagoj Bradaric', 'LB', 26, 72, 'Attacking fullback'],
      ['Jackson Tchatchoua', 'RB', 24, 74, 'Right wingback'],
      ['Suat Serdar', 'CM', 28, 74, 'Midfield leader'],
      ['Antoine Bernede', 'CDM', 26, 72, 'Holding midfielder'],
      ['Jean-Daniel Akpa Akpro', 'CM', 33, 71, 'Experienced midfielder'],
      ['Ondrej Duda', 'CAM', 31, 73, 'Creative midfielder'],
      ['Daniel Silva', 'CM', 25, 72, 'Rotation midfielder'],
      ['Tomas Suslov', 'CAM', 23, 75, 'Technical creator'],
      ['Grigoris Kastanos', 'CM', 28, 72, 'Rotation midfielder'],
      ['Giovane', 'LW', 22, 73, 'Wide forward'],
      ['Daniel Mosquera', 'ST', 26, 73, 'Power striker'],
      ['Amin Sarr', 'ST', 25, 72, 'Rotation striker']
    ]
  }
]

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getPlayerValue(rating, age) {
  const baseValue = Math.max(1, Math.round((rating - 62) * 1.8))

  if (age <= 22) {
    return Math.round(baseValue * 1.25)
  }

  if (age >= 32) {
    return Math.max(1, Math.round(baseValue * 0.55))
  }

  return baseValue
}

function getPotential(rating, age) {
  if (age <= 20) return Math.min(88, rating + 6)
  if (age <= 23) return Math.min(86, rating + 4)
  if (age <= 26) return Math.min(84, rating + 2)
  return rating
}

const opponentTeams = rawOpponentTeams.map((team) => ({
  name: team.name,
  city: team.city,
  tablePosition: team.tablePosition,
  rating: team.rating,
  budget: team.budget,
  squad: team.players.map(([name, position, age, rating, role]) => ({
    id: `${slugify(team.name)}-${slugify(name)}`,
    name,
    club: team.name,
    position,
    age,
    rating,
    potential: getPotential(rating, age),
    value: getPlayerValue(rating, age),
    role
  }))
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
      } else if (['LW', 'RW', 'ST', 'CF'].includes(player.position)) {
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
