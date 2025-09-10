import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue Integration Tests', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App)
  })

  describe('Initial State', () => {
    it('should render the main title', () => {
      expect(wrapper.find('h1').text()).toBe('Valorant Comp Randomizer')
    })

    it('should show setup container initially', () => {
      expect(wrapper.find('.setup-container').exists()).toBe(true)
      expect(wrapper.find('.results-container').exists()).toBe(false)
    })

    it('should have 5 player input fields', () => {
      const playerInputs = wrapper.findAll('.player-input input')
      expect(playerInputs).toHaveLength(5)
    })

    it('should have generate button disabled initially', () => {
      const generateBtn = wrapper.find('.generate-btn')
      expect(generateBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('Player Input Validation', () => {
    it('should enable generate button when all players are named and role is selected', async () => {
      // Fill in all player names
      const playerInputs = wrapper.findAll('.player-input input')
      for (let i = 0; i < playerInputs.length; i++) {
        await playerInputs[i].setValue(`Player${i + 1}`)
      }

      // Select a role
      const roleInput = wrapper.find('input[value="Duelist"]')
      await roleInput.setChecked(true)

      // Button should now be enabled
      const generateBtn = wrapper.find('.generate-btn')
      expect(generateBtn.attributes('disabled')).toBeUndefined()
    })

    it('should keep generate button disabled if players are missing', async () => {
      // Fill only some players
      const playerInputs = wrapper.findAll('.player-input input')
      await playerInputs[0].setValue('Player1')
      await playerInputs[1].setValue('Player2')
      // Leave others empty

      // Select a role
      const roleInput = wrapper.find('input[value="Duelist"]')
      await roleInput.setChecked(true)

      // Button should still be disabled
      const generateBtn = wrapper.find('.generate-btn')
      expect(generateBtn.attributes('disabled')).toBeDefined()
    })

    it('should keep generate button disabled if no role is selected', async () => {
      // Fill in all player names
      const playerInputs = wrapper.findAll('.player-input input')
      for (let i = 0; i < playerInputs.length; i++) {
        await playerInputs[i].setValue(`Player${i + 1}`)
      }

      // Don't select a role

      // Button should still be disabled
      const generateBtn = wrapper.find('.generate-btn')
      expect(generateBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('Agent Selection Modes', () => {
    it('should show agent mode options when agent selection is expanded', async () => {
      const sectionHeader = wrapper.find('.section-header')
      await sectionHeader.trigger('click')

      expect(wrapper.find('.agent-mode-selection').exists()).toBe(true)
      expect(wrapper.find('input[value="none"]').exists()).toBe(true)
      expect(wrapper.find('input[value="random"]').exists()).toBe(true)
      expect(wrapper.find('input[value="lock"]').exists()).toBe(true)
    })

    it('should show lock agents section when lock mode is selected', async () => {
      const sectionHeader = wrapper.find('.section-header')
      await sectionHeader.trigger('click')

      const lockModeInput = wrapper.find('input[value="lock"]')
      await lockModeInput.setChecked(true)

      expect(wrapper.find('.lock-agents-section').exists()).toBe(true)
    })
  })

  describe('Composition Generation', () => {
    beforeEach(async () => {
      // Set up a valid state for generation
      const playerInputs = wrapper.findAll('.player-input input')
      for (let i = 0; i < playerInputs.length; i++) {
        await playerInputs[i].setValue(`Player${i + 1}`)
      }

      const roleInput = wrapper.find('input[value="Duelist"]')
      await roleInput.setChecked(true)
    })

    it('should generate composition and show results', async () => {
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      expect(wrapper.find('.results-container').exists()).toBe(true)
      expect(wrapper.find('.setup-container').exists()).toBe(false)
    })

    it('should display all 5 player assignments', async () => {
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      const playerAssignments = wrapper.findAll('.player-assignment')
      expect(playerAssignments).toHaveLength(5)
    })

    it('should show role distribution summary', async () => {
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      expect(wrapper.find('.role-summary').exists()).toBe(true)
      expect(wrapper.find('.role-counts').exists()).toBe(true)
    })

    it('should have reset button in results', async () => {
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      expect(wrapper.find('.reset-btn').exists()).toBe(true)
    })

    it('should have clear history button in results', async () => {
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      expect(wrapper.find('.clear-history-btn').exists()).toBe(true)
    })
  })

  describe('Role History System', () => {
    beforeEach(async () => {
      // Set up a valid state for generation
      const playerInputs = wrapper.findAll('.player-input input')
      for (let i = 0; i < playerInputs.length; i++) {
        await playerInputs[i].setValue(`Player${i + 1}`)
      }

      const roleInput = wrapper.find('input[value="Duelist"]')
      await roleInput.setChecked(true)
    })

    it('should track role history after generation', async () => {
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      // Check that role history is populated
      expect(wrapper.vm.roleHistory).toBeDefined()
      expect(Object.keys(wrapper.vm.roleHistory).length).toBeGreaterThan(0)
    })

    it('should clear role history when clear history button is clicked', async () => {
      // Generate composition first
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      // Verify history exists
      expect(Object.keys(wrapper.vm.roleHistory).length).toBeGreaterThan(0)

      // Clear history
      const clearHistoryBtn = wrapper.find('.clear-history-btn')
      await clearHistoryBtn.trigger('click')

      // Verify history is cleared
      expect(Object.keys(wrapper.vm.roleHistory).length).toBe(0)
    })

    it('should reset to setup screen when reset button is clicked', async () => {
      // Generate composition first
      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      expect(wrapper.find('.results-container').exists()).toBe(true)

      // Reset
      const resetBtn = wrapper.find('.reset-btn')
      await resetBtn.trigger('click')

      expect(wrapper.find('.setup-container').exists()).toBe(true)
      expect(wrapper.find('.results-container').exists()).toBe(false)
    })
  })

  describe('Role Distribution Validation', () => {
    it('should always generate exactly 5 role assignments', async () => {
      // Set up and generate multiple times
      const playerInputs = wrapper.findAll('.player-input input')
      for (let i = 0; i < playerInputs.length; i++) {
        await playerInputs[i].setValue(`Player${i + 1}`)
      }

      const roleInput = wrapper.find('input[value="Controller"]')
      await roleInput.setChecked(true)

      for (let i = 0; i < 5; i++) {
        const generateBtn = wrapper.find('.generate-btn')
        await generateBtn.trigger('click')

        expect(wrapper.vm.composition).toHaveLength(5)

        // Reset for next iteration
        const resetBtn = wrapper.find('.reset-btn')
        await resetBtn.trigger('click')
      }
    })

    it('should always have correct role distribution (4 unique + 1 double)', async () => {
      const playerInputs = wrapper.findAll('.player-input input')
      for (let i = 0; i < playerInputs.length; i++) {
        await playerInputs[i].setValue(`Player${i + 1}`)
      }

      const roleInput = wrapper.find('input[value="Initiator"]')
      await roleInput.setChecked(true)

      const generateBtn = wrapper.find('.generate-btn')
      await generateBtn.trigger('click')

      const roleCounts = wrapper.vm.roleCounts
      const totalRoles = Object.values(roleCounts).reduce((sum, count) => sum + count, 0)
      
      expect(totalRoles).toBe(5)
      
      // Should have exactly one role with count 2, others with count 1
      const counts = Object.values(roleCounts)
      const doubleRoles = counts.filter(count => count === 2)
      const singleRoles = counts.filter(count => count === 1)
      
      expect(doubleRoles).toHaveLength(1)
      expect(singleRoles).toHaveLength(3)
    })
  })
})
