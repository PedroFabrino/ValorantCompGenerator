import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  shuffleArray, 
  getAgentIcon, 
  calculateRoleCounts, 
  assignAgentForRole, 
  assignRolesWithHistory 
} from '../utils/gameLogic.js'
import { agentsByRole, agentIconMap } from '../data/agents.js'

describe('gameLogic utilities', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect(result).toHaveLength(input.length)
    })

    it('should contain all original elements', () => {
      const input = ['a', 'b', 'c', 'd']
      const result = shuffleArray(input)
      expect(result.sort()).toEqual(input.sort())
    })

    it('should not modify the original array', () => {
      const input = [1, 2, 3]
      const original = [...input]
      shuffleArray(input)
      expect(input).toEqual(original)
    })

    it('should handle empty array', () => {
      const result = shuffleArray([])
      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const input = ['single']
      const result = shuffleArray(input)
      expect(result).toEqual(['single'])
    })
  })

  describe('getAgentIcon', () => {
    it('should return correct icon for known agents', () => {
      const jettIcon = getAgentIcon('Jett', agentIconMap)
      expect(jettIcon).toBe(agentIconMap['Jett'])
      
      const sageIcon = getAgentIcon('Sage', agentIconMap)
      expect(sageIcon).toBe(agentIconMap['Sage'])
    })

    it('should return placeholder for unknown agents', () => {
      const unknownIcon = getAgentIcon('UnknownAgent', agentIconMap)
      expect(unknownIcon).toBe('https://via.placeholder.com/50/FF4654/FFFFFF?text=U')
    })

    it('should handle empty agent name', () => {
      const emptyIcon = getAgentIcon('', agentIconMap)
      expect(emptyIcon).toBe('https://via.placeholder.com/50/FF4654/FFFFFF?text=')
    })

    it('should handle agents with special characters', () => {
      const kayoIcon = getAgentIcon('KAY/O', agentIconMap)
      expect(kayoIcon).toBe(agentIconMap['KAY/O'])
    })
  })

  describe('calculateRoleCounts', () => {
    it('should correctly count roles in composition', () => {
      const composition = [
        { player: 'Player1', role: 'Duelist', agent: 'Jett' },
        { player: 'Player2', role: 'Controller', agent: 'Omen' },
        { player: 'Player3', role: 'Initiator', agent: 'Sova' },
        { player: 'Player4', role: 'Sentinel', agent: 'Sage' },
        { player: 'Player5', role: 'Duelist', agent: 'Reyna' }
      ]

      const result = calculateRoleCounts(composition)
      expect(result).toEqual({
        'Duelist': 2,
        'Controller': 1,
        'Initiator': 1,
        'Sentinel': 1
      })
    })

    it('should handle empty composition', () => {
      const result = calculateRoleCounts([])
      expect(result).toEqual({})
    })

    it('should handle single role composition', () => {
      const composition = [
        { player: 'Player1', role: 'Duelist', agent: 'Jett' }
      ]
      const result = calculateRoleCounts(composition)
      expect(result).toEqual({ 'Duelist': 1 })
    })
  })

  describe('assignAgentForRole', () => {
    let usedAgents

    beforeEach(() => {
      usedAgents = new Set()
    })

    it('should return null for "none" mode', () => {
      const result = assignAgentForRole('Duelist', 'none', agentsByRole, {}, usedAgents)
      expect(result).toBeNull()
    })

    it('should assign random agent and track usage in "random" mode', () => {
      const result = assignAgentForRole('Duelist', 'random', agentsByRole, {}, usedAgents)
      
      expect(result).toBeTruthy()
      expect(usedAgents.has(result)).toBe(true)
      expect(agentsByRole['Duelist'].some(agent => agent.name === result)).toBe(true)
    })

    it('should avoid already used agents in "random" mode', () => {
      usedAgents.add('Jett')
      usedAgents.add('Reyna')
      
      const result = assignAgentForRole('Duelist', 'random', agentsByRole, {}, usedAgents)
      
      expect(result).toBeTruthy()
      expect(result).not.toBe('Jett')
      expect(result).not.toBe('Reyna')
      expect(usedAgents.has(result)).toBe(true)
    })

    it('should fall back to any agent when all are used in "random" mode', () => {
      // Add all duelist agents to used set
      agentsByRole['Duelist'].forEach(agent => usedAgents.add(agent.name))
      
      const result = assignAgentForRole('Duelist', 'random', agentsByRole, {}, usedAgents)
      
      expect(result).toBeTruthy()
      expect(agentsByRole['Duelist'].some(agent => agent.name === result)).toBe(true)
    })

    it('should assign locked agent in "lock" mode', () => {
      const lockedAgents = { 'Duelist': 'Jett' }
      
      const result = assignAgentForRole('Duelist', 'lock', agentsByRole, lockedAgents, usedAgents)
      
      expect(result).toBe('Jett')
      expect(usedAgents.has('Jett')).toBe(true)
    })

    it('should return null if locked agent is already used', () => {
      const lockedAgents = { 'Duelist': 'Jett' }
      usedAgents.add('Jett')
      
      const result = assignAgentForRole('Duelist', 'lock', agentsByRole, lockedAgents, usedAgents)
      
      expect(result).toBeNull()
    })

    it('should return null if no agent is locked for role in "lock" mode', () => {
      const lockedAgents = { 'Controller': 'Omen' } // No duelist locked
      
      const result = assignAgentForRole('Duelist', 'lock', agentsByRole, lockedAgents, usedAgents)
      
      expect(result).toBeNull()
    })
  })

  describe('assignRolesWithHistory', () => {
    const players = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']
    const rolePool = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Duelist'] // Standard 4+1 composition

    it('should assign exactly the roles from the role pool', () => {
      const roleHistory = {}
      const result = assignRolesWithHistory(players, rolePool, roleHistory)
      
      expect(result).toHaveLength(5)
      
      // Count assigned roles
      const assignedCounts = {}
      result.forEach(role => {
        assignedCounts[role] = (assignedCounts[role] || 0) + 1
      })
      
      expect(assignedCounts['Duelist']).toBe(2)
      expect(assignedCounts['Controller']).toBe(1)
      expect(assignedCounts['Initiator']).toBe(1)
      expect(assignedCounts['Sentinel']).toBe(1)
    })

    it('should avoid assigning recently played roles when possible', () => {
      const roleHistory = {
        'Alice': ['Duelist', 'Duelist', 'Duelist'], // Alice played Duelist 3 times recently
        'Bob': ['Controller'],
        'Charlie': [],
        'Diana': ['Sentinel'],
        'Eve': []
      }
      
      const result = assignRolesWithHistory(players, rolePool, roleHistory)
      
      // Alice should be less likely to get Duelist (though not impossible)
      // Bob should be less likely to get Controller
      // Test multiple times to check tendency
      let aliceNotDuelist = 0
      let bobNotController = 0
      
      for (let i = 0; i < 10; i++) {
        const testResult = assignRolesWithHistory(players, rolePool, roleHistory)
        if (testResult[0] !== 'Duelist') aliceNotDuelist++
        if (testResult[1] !== 'Controller') bobNotController++
      }
      
      // At least some of the time, they should get different roles
      expect(aliceNotDuelist + bobNotController).toBeGreaterThan(0)
    })

    it('should handle empty role history', () => {
      const roleHistory = {}
      const result = assignRolesWithHistory(players, rolePool, roleHistory)
      
      expect(result).toHaveLength(5)
      expect(result.every(role => role !== null && role !== undefined)).toBe(true)
    })

    it('should handle players with no history', () => {
      const roleHistory = {
        'Alice': ['Duelist'],
        // Other players have no history
      }
      
      const result = assignRolesWithHistory(players, rolePool, roleHistory)
      
      expect(result).toHaveLength(5)
      expect(result.every(role => ['Duelist', 'Controller', 'Initiator', 'Sentinel'].includes(role))).toBe(true)
    })

    it('should maintain role pool composition with different doubled roles', () => {
      const controllerDoublePool = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Controller']
      const roleHistory = {}
      
      const result = assignRolesWithHistory(players, controllerDoublePool, roleHistory)
      
      const assignedCounts = {}
      result.forEach(role => {
        assignedCounts[role] = (assignedCounts[role] || 0) + 1
      })
      
      expect(assignedCounts['Controller']).toBe(2)
      expect(assignedCounts['Duelist']).toBe(1)
      expect(assignedCounts['Initiator']).toBe(1)
      expect(assignedCounts['Sentinel']).toBe(1)
    })

    it('should handle edge case where all players have extensive history', () => {
      const roleHistory = {
        'Alice': ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Duelist'],
        'Bob': ['Controller', 'Initiator', 'Sentinel', 'Duelist', 'Controller'],
        'Charlie': ['Initiator', 'Sentinel', 'Duelist', 'Controller', 'Initiator'],
        'Diana': ['Sentinel', 'Duelist', 'Controller', 'Initiator', 'Sentinel'],
        'Eve': ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Duelist']
      }
      
      const result = assignRolesWithHistory(players, rolePool, roleHistory)
      
      expect(result).toHaveLength(5)
      expect(result.every(role => role !== null)).toBe(true)
      
      // Should still maintain correct role distribution
      const assignedCounts = {}
      result.forEach(role => {
        assignedCounts[role] = (assignedCounts[role] || 0) + 1
      })
      
      expect(assignedCounts['Duelist']).toBe(2)
      expect(assignedCounts['Controller']).toBe(1)
      expect(assignedCounts['Initiator']).toBe(1)
      expect(assignedCounts['Sentinel']).toBe(1)
    })
  })
})
