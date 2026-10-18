export const categoryLabels = {
  knives: 'Ножарство',
  wood: 'Дървообработка',
  leather: 'Кожени изделия',
  jewelry: 'Бижута',
  ceramics: 'Керамика',
  textile: 'Текстил',
  metal: 'Металообработка',
  decoration: 'Декорация',
  other: 'Други',
}

export function getCategoryLabel(category) {
  return categoryLabels[category] || category
}