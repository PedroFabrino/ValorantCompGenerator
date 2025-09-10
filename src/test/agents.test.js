import { describe, it, expect } from 'vitest'
import { agentsByRole, roles, availableRoles, agentIconMap } from '../data/agents.js'

describe('agents data structure', () => {
  describe('agentsByRole', () => {
    it('should have all required roles', () => {
      const expectedRoles = ['Duelist', 'Controller', 'Initiator', 'Sentinel']
      expectedRoles.forEach(role => {
        expect(agentsByRole).toHaveProperty(role)
        expect(Array.isArray(agentsByRole[role])).toBe(true)
      })
    })

    it('should have at least 4 agents per role for variety', () => {
      Object.keys(agentsByRole).forEach(role => {
        expect(agentsByRole[role].length).toBeGreaterThanOrEqual(4)
      })
    })

    it('should have valid agent structure', () => {
      Object.values(agentsByRole).flat().forEach(agent => {
        expect(agent).toHaveProperty('name')
        expect(agent).toHaveProperty('icon')
        expect(typeof agent.name).toBe('string')
        expect(agent.name.length).toBeGreaterThan(0)
      })
    })

    it('should not have duplicate agents within the same role', () => {
      Object.entries(agentsByRole).forEach(([role, agents]) => {
        const names = agents.map(agent => agent.name)
        const uniqueNames = [...new Set(names)]
        expect(names.length).toBe(uniqueNames.length)
      })
    })

    it('should not have the same agent in multiple roles', () => {
      const allAgents = Object.values(agentsByRole).flat()
      const allNames = allAgents.map(agent => agent.name)
      const uniqueNames = [...new Set(allNames)]
      expect(allNames.length).toBe(uniqueNames.length)
    })
  })

  describe('roles and availableRoles', () => {
    it('should have correct roles array', () => {
      expect(roles).toContain('Duelist')
      expect(roles).toContain('Controller')
      expect(roles).toContain('Initiator')
      expect(roles).toContain('Sentinel')
      expect(roles).toContain('Random')
      expect(roles).toHaveLength(5)
    })

    it('should have correct availableRoles array', () => {
      expect(availableRoles).toContain('Duelist')
      expect(availableRoles).toContain('Controller')
      expect(availableRoles).toContain('Initiator')
      expect(availableRoles).toContain('Sentinel')
      expect(availableRoles).toHaveLength(4)
      expect(availableRoles).not.toContain('Random')
    })

    it('should have availableRoles as subset of roles', () => {
      availableRoles.forEach(role => {
        expect(roles).toContain(role)
      })
    })
  })

  describe('agentIconMap', () => {
    it('should have icons for all agents', () => {
      const allAgents = Object.values(agentsByRole).flat()
      allAgents.forEach(agent => {
        expect(agentIconMap).toHaveProperty(agent.name)
      })
    })

    it('should have valid URL format for icons', () => {
      Object.values(agentIconMap).forEach(iconUrl => {
        expect(typeof iconUrl).toBe('string')
        expect(iconUrl.length).toBeGreaterThan(0)
        // Should be either a valid HTTP URL or placeholder URL
        expect(
          iconUrl.startsWith('http://') || 
          iconUrl.startsWith('https://') ||
          iconUrl.startsWith('data:')
        ).toBe(true)
      })
    })

    it('should have placeholder icons for newer agents', () => {
      const placeholderAgents = ['Iso', 'Waylay', 'Clove', 'Vyse']
      placeholderAgents.forEach(agent => {
        if (agentIconMap[agent]) {
          expect(agentIconMap[agent]).toContain('via.placeholder.com')
        }
      })
    })

    it('should have role-appropriate colors for placeholder icons', () => {
      // Check that Duelist agents have red placeholder
      if (agentIconMap['Iso']) {
        expect(agentIconMap['Iso']).toContain('FF4654') // Red for Duelist
      }
      
      // Check that Controller agents have teal placeholder
      if (agentIconMap['Clove']) {
        expect(agentIconMap['Clove']).toContain('00D4AA') // Teal for Controller
      }
      
      // Check that Sentinel agents have purple placeholder
      if (agentIconMap['Vyse']) {
        expect(agentIconMap['Vyse']).toContain('9C88FF') // Purple for Sentinel
      }
    })
  })

  describe('data consistency', () => {
    it('should have consistent agent counts across roles', () => {
      const roleCounts = Object.entries(agentsByRole).map(([role, agents]) => ({
        role,
        count: agents.length
      }))
      
      // Log for debugging
      console.log('Agent counts per role:', roleCounts)
      
      // Should have reasonable balance (not enforcing exact equality)
      const counts = roleCounts.map(r => r.count)
      const min = Math.min(...counts)
      const max = Math.max(...counts)
      
      // No role should have significantly fewer agents than others
      expect(max - min).toBeLessThanOrEqual(3)
    })

    it('should maintain expected Valorant agent count', () => {
      const totalAgents = Object.values(agentsByRole).flat().length
      
      // As of the implementation, should have around 25+ agents total
      expect(totalAgents).toBeGreaterThanOrEqual(20)
      expect(totalAgents).toBeLessThan(50) // Reasonable upper bound
    })
  })
})
