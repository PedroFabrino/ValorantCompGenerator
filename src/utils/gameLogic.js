// Utility functions for Valorant Comp Randomizer

/**
 * Assign roles to players with history-based weighting to reduce repetition
 * @param {Array} players - Array of player names
 * @param {Array} rolePool - Array of roles to assign (should have exactly 5 roles: 4 unique + 1 duplicate)
 * @param {Object} roleHistory - Object mapping player names to role history arrays
 * @returns {Array} - Array of role assignments for each player
 */
export function assignRolesWithHistory(players, rolePool, roleHistory) {
  // Create a pool of available roles to assign
  const availableRoles = [...rolePool];
  const assignments = new Array(players.length);
  
  // Create player preference scores for each role
  const playerPreferences = players.map((player, index) => {
    const playerName = player.trim();
    const history = roleHistory[playerName] || [];
    
    // Calculate preference scores for each unique role
    const roleScores = {};
    const uniqueRoles = [...new Set(rolePool)];
    
    uniqueRoles.forEach(role => {
      // Find how recently this role was played (lower = more recent = worse score)
      const lastPlayedIndex = history.lastIndexOf(role);
      const recencyPenalty = lastPlayedIndex >= 0 ? Math.max(0, 4 - (history.length - 1 - lastPlayedIndex)) : 0;
      
      // Base score is random, with penalty for recent roles
      roleScores[role] = Math.random() * 10 - recencyPenalty * 3;
    });
    
    return {
      playerIndex: index,
      playerName,
      roleScores,
      history
    };
  });
  
  // Sort players by their overall preference scores (most flexible first)
  playerPreferences.sort((a, b) => {
    const aFlexibility = Object.values(a.roleScores).reduce((sum, score) => sum + Math.max(0, score), 0);
    const bFlexibility = Object.values(b.roleScores).reduce((sum, score) => sum + Math.max(0, score), 0);
    return bFlexibility - aFlexibility;
  });
  
  // Assign roles one by one, considering preferences and availability
  playerPreferences.forEach(({ playerIndex, roleScores }) => {
    let bestRole = null;
    let bestScore = -Infinity;
    
    // Find the best available role for this player
    availableRoles.forEach((role, rolePoolIndex) => {
      if (role !== null) { // Role is still available
        const score = roleScores[role] || 0;
        if (score > bestScore) {
          bestScore = score;
          bestRole = role;
        }
      }
    });
    
    // Assign the best role and remove it from available pool
    if (bestRole !== null) {
      assignments[playerIndex] = bestRole;
      // Remove the first occurrence of this role from available pool
      const roleIndex = availableRoles.indexOf(bestRole);
      if (roleIndex !== -1) {
        availableRoles[roleIndex] = null; // Mark as used
      }
    }
  });
  
  // Fill any remaining assignments with any leftover roles (fallback)
  let availableIndex = 0;
  assignments.forEach((assignment, index) => {
    if (!assignment) {
      // Find next available role
      while (availableIndex < availableRoles.length && availableRoles[availableIndex] === null) {
        availableIndex++;
      }
      if (availableIndex < availableRoles.length) {
        assignments[index] = availableRoles[availableIndex];
        availableRoles[availableIndex] = null;
        availableIndex++;
      }
    }
  });
  
  return assignments;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get agent icon URL with fallback placeholder
 * @param {string} agentName - The name of the agent
 * @param {Object} agentIconMap - Map of agent names to icon URLs
 * @returns {string} - The icon URL
 */
export function getAgentIcon(agentName, agentIconMap) {
  return agentIconMap[agentName] || `https://via.placeholder.com/50/FF4654/FFFFFF?text=${agentName.charAt(0)}`;
}

/**
 * Calculate role distribution from composition
 * @param {Array} composition - Array of player assignments
 * @returns {Object} - Object with role counts
 */
export function calculateRoleCounts(composition) {
  const roleCounts = {};
  composition.forEach(assignment => {
    const role = assignment.role;
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });
  return roleCounts;
}

/**
 * Assign agent for a specific role based on agent mode
 * @param {string} role - The role to assign agent for
 * @param {string} agentMode - The agent assignment mode ('none', 'random', 'lock')
 * @param {Object} agentsByRole - Object mapping roles to agent arrays
 * @param {Object} lockedAgents - Object mapping roles to locked agent names
 * @param {Set} usedAgents - Set of already used agents (for both locked and random modes)
 * @returns {string|null} - The assigned agent name or null
 */
export function assignAgentForRole(role, agentMode, agentsByRole, lockedAgents, usedAgents) {
  // If agent mode is 'none', don't assign any agents
  if (agentMode === 'none') {
    return null;
  }
  
  // If agent mode is 'random', pick a random agent from the role that hasn't been used yet
  if (agentMode === 'random') {
    const availableAgents = agentsByRole[role].filter(agent => !usedAgents.has(agent.name));
    
    // If no agents are available (all used), fall back to any agent from the role
    if (availableAgents.length === 0) {
      const allAgents = agentsByRole[role];
      const randomIndex = Math.floor(Math.random() * allAgents.length);
      return allAgents[randomIndex].name;
    }
    
    const randomIndex = Math.floor(Math.random() * availableAgents.length);
    const selectedAgent = availableAgents[randomIndex].name;
    usedAgents.add(selectedAgent);
    return selectedAgent;
  }
  
  // If agent mode is 'lock', use the locked agent logic
  if (agentMode === 'lock') {
    const lockedAgent = lockedAgents[role];
    
    // If there's a locked agent for this role and it hasn't been used yet
    if (lockedAgent && !usedAgents.has(lockedAgent)) {
      usedAgents.add(lockedAgent);
      return lockedAgent;
    }
  }
  
  // If no agent is locked for this role, return null (just show role)
  return null;
}
