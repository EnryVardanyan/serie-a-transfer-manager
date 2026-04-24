export const clubs = [
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

export const formationSlots = [
  { key: 'gk', label: 'GK', allowed: ['GK'] },
  { key: 'lb', label: 'LB', allowed: ['LB'] },
  { key: 'cb1', label: 'CB', allowed: ['CB'] },
  { key: 'cb2', label: 'CB', allowed: ['CB'] },
  { key: 'rb', label: 'RB', allowed: ['RB'] },
  { key: 'cdm', label: 'CDM', allowed: ['CDM', 'CM'] },
  { key: 'cm1', label: 'CM', allowed: ['CM', 'CAM', 'CDM'] },
  { key: 'cm2', label: 'CM', allowed: ['CM', 'CAM', 'CDM'] },
  { key: 'lw', label: 'LW', allowed: ['LW', 'LM', 'RW'] },
  { key: 'st', label: 'ST', allowed: ['ST', 'CF'] },
  { key: 'rw', label: 'RW', allowed: ['RW', 'RM', 'LW'] }
]
