import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import App from './App'

type ObserverEntry = {
  isIntersecting: boolean
  target: Element
}

let observerCallback: ((entries: ObserverEntry[]) => void) | undefined

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(callback: (entries: ObserverEntry[]) => void) {
    observerCallback = callback
  }
}

beforeEach(() => {
  observerCallback = undefined
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function updatePurchasePanelVisibility(isIntersecting: boolean) {
  const purchasePanel = document.querySelector('.purchase-panel')
  const callback = observerCallback

  if (!purchasePanel || !callback) {
    throw new Error('Purchase panel observer was not initialized')
  }

  act(() => {
    callback([{ isIntersecting, target: purchasePanel }])
  })
}

describe('sticky add to cart', () => {
  test('appears after the primary purchase panel leaves the viewport', () => {
    render(<App />)

    updatePurchasePanelVisibility(true)

    expect(
      screen.getByRole('region', { name: /sticky add to cart/i }),
    ).not.toHaveClass('visible')

    updatePurchasePanelVisibility(false)

    expect(
      screen.getByRole('region', { name: /sticky add to cart/i }),
    ).toHaveClass('visible')
  })

  test('stays synchronized with selected size and quantity', async () => {
    const user = userEvent.setup()
    render(<App />)
    const purchasePanel = document.querySelector('.purchase-panel')

    if (!purchasePanel) {
      throw new Error('Purchase panel was not rendered')
    }

    await user.click(
      within(purchasePanel as HTMLElement).getByRole('button', {
        name: /3.4 oz/i,
      }),
    )
    await user.click(
      within(purchasePanel as HTMLElement).getByRole('button', {
        name: /increase quantity/i,
      }),
    )
    updatePurchasePanelVisibility(false)

    const stickyCart = screen.getByRole('region', {
      name: /sticky add to cart/i,
    })

    expect(within(stickyCart).getAllByText('3.4 oz').length).toBeGreaterThan(0)
    expect(within(stickyCart).getByText('2 items')).toBeInTheDocument()
    expect(
      within(stickyCart).getByRole('button', { name: /add to cart - \$208/i }),
    ).toBeInTheDocument()
  })
})
