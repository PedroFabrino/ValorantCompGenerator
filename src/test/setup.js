// Test setup file for Vitest
import { vi } from 'vitest'

// Mock Math.random for predictable tests when needed
global.mockRandom = (values) => {
  let index = 0
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const value = values[index % values.length]
    index++
    return value
  })
}

global.restoreRandom = () => {
  vi.restoreAllMocks()
}
