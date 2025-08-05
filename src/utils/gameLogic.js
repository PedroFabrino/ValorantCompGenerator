// Utility functions for Valorant Comp Randomizer

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
