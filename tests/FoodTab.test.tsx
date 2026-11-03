import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FoodTab } from '@/components/FoodTab'
import { ProfileContext, type Profile } from '@/lib/profile'

const mocks = vi.hoisted(() => ({ explain: vi.fn() }))
vi.mock('@/api', () => ({ api: { explain: mocks.explain } }))
vi.mock('@/lib/speech', () => ({ speakKorean: vi.fn() }))
vi.mock('@/components/Mascot', () => ({
  PageIntro: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
vi.mock('@/components/ApiWidgets', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/ApiWidgets')>()
  return { ...actual, PhotoButton: () => null, NearbyList: () => null }
})

beforeEach(() => { vi.resetAllMocks() })
afterEach(cleanup)

function labelChecker(allergies: string[] = []) {
  const profile: Profile = { onboarded: true, lang: 'en', buddy: 'bori', nickname: '', belief: '', diet: 'halal', allergies }
  render(<ProfileContext value={profile}><FoodTab /></ProfileContext>)
  const input = screen.getByRole('textbox')
  const card = input.closest('[data-slot="card"]') as HTMLElement
  return { input, card, result: within(card) }
}

describe('ingredient label regression coverage', () => {
  it.each(['원재료명: 알 수 없는 재료', '???', '사진을 읽을 수 없습니다', '원재료명: 쌀, 정제수'])('does not claim OK for an unrecognized label: %s', (text) => {
    const { input, result, card } = labelChecker()
    fireEvent.change(input, { target: { value: text } })
    expect(result.getByRole('status').textContent).toBe('Not enough information')
    expect(card.querySelector('.status-safe')).toBeNull()
    expect(result.getByText(/cannot confirm food safety/)).toBeTruthy()
  })

  it('shows no verdict for whitespace-only input', () => {
    const { input, result } = labelChecker()
    fireEvent.change(input, { target: { value: '   ' } })
    expect(result.queryByRole('status')).toBeNull()
  })

  it('requires confirmation even when recognized milk is permitted by the diet', () => {
    const { input, result } = labelChecker()
    fireEvent.change(input, { target: { value: '원재료명: 우유' } })
    expect(result.getByRole('status').textContent).toBe('Confirmation needed')
  })

  it.each([
    ['원재료명: 돼지고기', []],
    ['원재료명: 닭고기', []],
    ['원재료명: 우유', ['milk']],
    ['원재료명: 땅콩', ['peanut']],
  ])('flags diet or allergy matches without a green OK: %s', (text, allergies) => {
    const { input, result, card } = labelChecker(allergies)
    fireEvent.change(input, { target: { value: text } })
    expect(result.getByRole('status').textContent).toBe('Caution ingredients found')
    expect(card.querySelector('.status-safe')).toBeNull()
  })

  it('does not let an AI safe verdict turn an unreadable label into a green OK', async () => {
    mocks.explain.mockResolvedValue({ verdict: 'safe', summary: 'No matching keyword.', points: [], replies: [] })
    const { input, result, card } = labelChecker()
    fireEvent.change(input, { target: { value: '원재료명: 알 수 없는 재료' } })
    fireEvent.click(result.getByRole('button', { name: 'Ask AI' }))
    expect(await result.findByText('No matching keyword.')).toBeTruthy()
    expect(result.getByRole('status').textContent).toBe('Not enough information')
    expect(card.querySelector('.status-safe')).toBeNull()
  })

  it('updates the verdict when label text changes and ignores stale AI output', async () => {
    mocks.explain.mockResolvedValue({ verdict: 'danger', summary: 'Previous label analysis', points: [], replies: [] })
    const { input, result } = labelChecker()
    fireEvent.change(input, { target: { value: '돼지고기' } })
    fireEvent.click(result.getByRole('button', { name: 'Ask AI' }))
    expect(await result.findByText('Previous label analysis')).toBeTruthy()
    fireEvent.change(input, { target: { value: '알 수 없는 재료' } })
    expect(result.getByRole('status').textContent).toBe('Not enough information')
    expect(result.queryByText('Previous label analysis')).toBeNull()
  })
})
