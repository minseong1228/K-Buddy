import type { TransitLeg } from '@/api'

// Official Seoul-area line colors (data, not theme tokens) so the map matches station signs.
const SUBWAY: [RegExp, string][] = [
  [/1호선/, '#0052A4'],
  [/2호선/, '#00A84D'],
  [/3호선/, '#EF7C1C'],
  [/4호선/, '#00A5DE'],
  [/5호선/, '#996CAC'],
  [/6호선/, '#CD7C2F'],
  [/7호선/, '#747F00'],
  [/8호선/, '#E6186C'],
  [/9호선/, '#BDB092'],
  [/신분당/, '#D4003B'],
  [/공항/, '#0090D2'],
  [/경의|중앙/, '#77C4A3'],
  [/수인|분당/, '#F5A200'],
  [/경춘/, '#0C8E72'],
  [/우이/, '#B0CE18'],
  [/신림/, '#6789CA'],
]

export const WALK_COLOR = '#8a94a6'
export const START_COLOR = '#24359a'
export const END_COLOR = '#e0353b'

export function legColor(leg: TransitLeg) {
  if (leg.mode === 'walk') return WALK_COLOR
  if (leg.mode === 'bus') return '#3d6be0'
  return SUBWAY.find(([re]) => re.test(leg.line ?? ''))?.[1] ?? START_COLOR
}
