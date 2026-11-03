import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TranslateTab } from '@/components/TranslateTab'

const mocks = vi.hoisted(() => ({
  translate: vi.fn(),
  speakKorean: vi.fn(),
  setTranscript: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
}))

vi.mock('@/api', () => ({ api: { translate: mocks.translate } }))
vi.mock('@/lib/speech', () => ({
  speakKorean: mocks.speakKorean,
  useSpeechRecognition: () => ({
    supported: true,
    listening: false,
    transcript: '',
    setTranscript: mocks.setTranscript,
    start: mocks.start,
    stop: mocks.stop,
  }),
}))
// Animation is unrelated to translation; keep the real translation and useAi logic.
vi.mock('@/components/Mascot', () => ({
  PageIntro: ({ title, tip }: { title: string; tip: string }) => (
    <header><h1>{title}</h1><p>{tip}</p></header>
  ),
}))

const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')

beforeEach(() => {
  vi.resetAllMocks()
  // Current Chromium returns a Promise; returning it from an effect crashes cleanup.
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: vi.fn().mockResolvedValue({ interrupted: false }),
  })
})

afterEach(() => {
  cleanup()
  if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll)
  else Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
})

function renderTranslator() {
  return render(<StrictMode><TranslateTab /></StrictMode>)
}

function typeAndSend(text: string) {
  fireEvent.change(screen.getByRole('textbox'), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: 'send' }))
}

describe('TranslateTab regression coverage', () => {
  it('keeps both translations visible and unmounts when scrolling returns a Promise', async () => {
    mocks.translate.mockResolvedValueOnce('안녕하세요.').mockResolvedValueOnce('위챗페이로 결제할 수 있나요?')
    const view = renderTranslator()

    typeAndSend('Hello')
    expect(await screen.findByText('안녕하세요.')).toBeTruthy()
    await waitFor(() => expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(''))

    typeAndSend('Can I pay with WeChat Pay?')
    expect(await screen.findByText('위챗페이로 결제할 수 있나요?')).toBeTruthy()
    expect(screen.getByText('안녕하세요.')).toBeTruthy()
    expect(mocks.translate.mock.calls).toEqual([
      ['Hello', 'en', 'ko'],
      ['Can I pay with WeChat Pay?', 'en', 'ko'],
    ])
    expect(mocks.speakKorean).toHaveBeenLastCalledWith('위챗페이로 결제할 수 있나요?')
    expect(() => view.unmount()).not.toThrow()
  })

  it.each([
    ['network failure', new Error('network failure')],
    ['null response', null],
    ['empty response', ''],
    ['blank response', '   '],
  ])('preserves the input and supports retry after %s', async (_name, failure) => {
    if (failure instanceof Error) mocks.translate.mockRejectedValueOnce(failure)
    else mocks.translate.mockResolvedValueOnce(failure)
    mocks.translate.mockResolvedValueOnce('안녕하세요.')
    renderTranslator()

    typeAndSend('Hello')
    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('Translation failed. Your text is still here. Try again.')
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Hello')
    expect(mocks.speakKorean).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('안녕하세요.')).toBeTruthy()
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull()
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
    })
    expect(mocks.translate).toHaveBeenCalledTimes(2)
    expect(mocks.translate).toHaveBeenLastCalledWith('Hello', 'en', 'ko')
  })

  it('submits once when two submit events arrive before the response', async () => {
    let resolveTranslation!: (translation: string) => void
    mocks.translate.mockReturnValue(new Promise<string>((resolve) => { resolveTranslation = resolve }))
    renderTranslator()
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Hello' } })
    const form = input.closest('form')!

    act(() => {
      fireEvent.submit(form)
      fireEvent.submit(form)
    })
    expect(mocks.translate).toHaveBeenCalledTimes(1)
    expect(input.disabled).toBe(true)
    expect(input.value).toBe('Hello')

    await act(async () => { resolveTranslation('안녕하세요.') })
    expect(await screen.findByText('안녕하세요.')).toBeTruthy()
    expect(screen.getAllByText('안녕하세요.')).toHaveLength(1)
    expect(input.disabled).toBe(false)
  })
})