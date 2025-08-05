<template>
  <div class="app">
    <h1>Valorant Comp Randomizer</h1>
    
    <div v-if="!showResults" class="setup-container">
      <!-- Player Names Input -->
      <div class="section">
        <h2>Enter Player Names</h2>
        <div class="players-input">
          <div v-for="(player, index) in players" :key="index" class="player-input">
            <input 
              :id="`player-${index}`"
              v-model="players[index]" 
              type="text" 
              :placeholder="`Player ${index + 1}`"
              required
            />
          </div>
        </div>
      </div>

      <!-- Role Selection -->
      <div class="section">
        <h2>Select Double Role</h2>
        <div class="role-selection">
          <div v-for="role in roles" :key="role" class="role-option">
            <input 
              :id="role" 
              v-model="selectedRole" 
              :value="role" 
              type="radio" 
              name="role"
            />
            <label :for="role" class="role-label">{{ role }}</label>
          </div>
        </div>
      </div>

      <!-- Agent Selection -->
      <div class="section">
        <div class="section-header" @click="showAgentLocks = !showAgentLocks">
          <h2>Agent Selection (Optional)</h2>
          <span class="toggle-icon" :class="{ 'expanded': showAgentLocks }">▼</span>
        </div>
        <div v-if="showAgentLocks" class="collapsible-content">
          <div class="agent-mode-selection">
            <div class="mode-option">
              <input 
                id="no-agents" 
                v-model="agentMode" 
                value="none" 
                type="radio" 
                name="agentMode"
              />
              <label for="no-agents" class="mode-label">No Agents (Roles Only)</label>
            </div>
            <div class="mode-option">
              <input 
                id="random-agents" 
                v-model="agentMode" 
                value="random" 
                type="radio" 
                name="agentMode"
              />
              <label for="random-agents" class="mode-label">Random Agents for All</label>
            </div>
            <div class="mode-option">
              <input 
                id="lock-agents" 
                v-model="agentMode" 
                value="lock" 
                type="radio" 
                name="agentMode"
              />
              <label for="lock-agents" class="mode-label">Lock Specific Agents</label>
            </div>
          </div>
          
          <div v-if="agentMode === 'lock'" class="lock-agents-section">
            <p class="section-description">Select specific agents that must be included in the composition</p>
            <div class="agent-locks">
              <div v-for="role in availableRoles" :key="role" class="role-lock-section">
                <h3 class="role-lock-title">{{ role }}</h3>
                <div class="agent-selection">
                  <div v-for="agent in agentsByRole[role]" :key="agent.name" class="agent-option">
                    <input 
                      :id="`agent-${agent.name}`"
                      v-model="lockedAgents[role]"
                      :value="agent.name"
                      type="radio"
                      :name="`agent-${role}`"
                    />
                    <label :for="`agent-${agent.name}`" class="agent-label">
                      <img :src="getAgentIcon(agent.name)" :alt="agent.name" class="agent-icon" />
                      <span>{{ agent.name }}</span>
                    </label>
                  </div>
                </div>
                <div class="no-lock-row">
                  <div class="agent-option">
                    <input 
                      :id="`no-lock-${role}`"
                      v-model="lockedAgents[role]"
                      value=""
                      type="radio"
                      :name="`agent-${role}`"
                      checked
                    />
                    <label :for="`no-lock-${role}`" class="agent-label no-lock">
                      <span>No Lock</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <button 
        @click="generateComposition" 
        :disabled="!canGenerate"
        class="generate-btn"
      >
        Generate Composition
      </button>
    </div>

    <!-- Results Screen -->
    <div v-else class="results-container">
      <h2>Your Valorant Composition</h2>
      <div class="composition-results">
        <div v-for="assignment in composition" :key="assignment.player" class="player-assignment">
          <span class="player-name">{{ assignment.player }}</span>
          <div class="agent-assignment">
            <img v-if="assignment.agent" :src="getAgentIcon(assignment.agent)" :alt="assignment.agent" class="result-agent-icon" />
            <div class="role-icon" v-else :class="assignment.role.toLowerCase()">
              {{ assignment.role.charAt(0) }}
            </div>
            <div class="agent-info">
              <span class="role-badge" :class="assignment.role.toLowerCase()">
                {{ assignment.role }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="role-summary">
        <h3>Role Distribution</h3>
        <div class="role-counts">
          <div v-for="(count, role) in roleCounts" :key="role" class="role-count">
            <span class="role-name">{{ role }}:</span>
            <span class="count">{{ count }}</span>
          </div>
        </div>
      </div>

      <button @click="resetGenerator" class="reset-btn">
        Generate New Composition
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValorantCompRandomizer',
  data() {
    return {
      players: ['', '', '', '', ''],
      roles: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Random'],
      availableRoles: ['Duelist', 'Controller', 'Initiator', 'Sentinel'],
      selectedRole: '',
      showResults: false,
      showAgentLocks: false,
      agentMode: 'none', // 'none', 'random', 'lock'
      composition: [],
      roleCounts: {},
      lockedAgents: {
        'Duelist': '',
        'Controller': '',
        'Initiator': '',
        'Sentinel': ''
      },
      agentsByRole: {
        'Duelist': [
          { name: 'Jett', icon: 'Jett' },
          { name: 'Reyna', icon: 'Reyna' },
          { name: 'Phoenix', icon: 'Phoenix' },
          { name: 'Raze', icon: 'Raze' },
          { name: 'Yoru', icon: 'Yoru' },
          { name: 'Neon', icon: 'Neon' },
          { name: 'Iso', icon: 'Iso' },
          { name: 'Waylay', icon: 'Waylay' }
        ],
        'Controller': [
          { name: 'Brimstone', icon: 'Brimstone' },
          { name: 'Omen', icon: 'Omen' },
          { name: 'Viper', icon: 'Viper' },
          { name: 'Astra', icon: 'Astra' },
          { name: 'Harbor', icon: 'Harbor' },
          { name: 'Clove', icon: 'Clove' }
        ],
        'Initiator': [
          { name: 'Sova', icon: 'Sova' },
          { name: 'Breach', icon: 'Breach' },
          { name: 'Skye', icon: 'Skye' },
          { name: 'KAY/O', icon: 'KAY/O' },
          { name: 'Fade', icon: 'Fade' },
          { name: 'Gekko', icon: 'Gekko' }
        ],
        'Sentinel': [
          { name: 'Sage', icon: 'Sage' },
          { name: 'Cypher', icon: 'Cypher' },
          { name: 'Killjoy', icon: 'Killjoy' },
          { name: 'Chamber', icon: 'Chamber' },
          { name: 'Deadlock', icon: 'Deadlock' },
          { name: 'Vyse', icon: 'Vyse' }
        ]
      }
    }
  },
  computed: {
    canGenerate() {
      const allPlayersNamed = this.players.every(player => player.trim() !== '');
      const roleSelected = this.selectedRole !== '';
      return allPlayersNamed && roleSelected;
    }
  },
  methods: {
    generateComposition() {
      // Available roles for assignment
      const availableRoles = ['Duelist', 'Controller', 'Initiator', 'Sentinel'];
      
      // Determine which role to double
      let doubleRole = this.selectedRole;
      if (doubleRole === 'Random') {
        doubleRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
      }
      
      // Create role pool: 4 different roles + 1 doubled role
      const rolePool = [...availableRoles, doubleRole];
      
      // Shuffle roles
      const shuffledRoles = this.shuffleArray([...rolePool]);
      
      // Reset composition for fresh assignment
      this.composition = [];
      
      // Track used locked agents to prevent duplicates
      const usedLockedAgents = new Set();
      
      // Assign roles and agents to players
      this.composition = this.players.map((player, index) => {
        const role = shuffledRoles[index];
        const agent = this.assignAgentForRole(role, usedLockedAgents);
        
        return {
          player: player.trim(),
          role: role,
          agent: agent
        };
      });
      
      // Calculate role counts for summary
      this.calculateRoleCounts();
      
      this.showResults = true;
    },
    
    assignAgentForRole(role, usedLockedAgents) {
      // If agent mode is 'none', don't assign any agents
      if (this.agentMode === 'none') {
        return null;
      }
      
      // If agent mode is 'random', pick a random agent from the role
      if (this.agentMode === 'random') {
        const availableAgents = this.agentsByRole[role];
        const randomIndex = Math.floor(Math.random() * availableAgents.length);
        return availableAgents[randomIndex].name;
      }
      
      // If agent mode is 'lock', use the locked agent logic
      if (this.agentMode === 'lock') {
        const lockedAgent = this.lockedAgents[role];
        
        // If there's a locked agent for this role and it hasn't been used yet
        if (lockedAgent && !usedLockedAgents.has(lockedAgent)) {
          usedLockedAgents.add(lockedAgent);
          return lockedAgent;
        }
      }
      
      // If no agent is locked for this role, return null (just show role)
      return null;
    },
    
    getAgentIcon(agentName) {
      // Use fallback placeholder images for problematic agents
      const agentMap = {
        'Jett': 'https://static.wikia.nocookie.net/valorant/images/3/35/Jett_icon.png',
        'Reyna': 'https://static.wikia.nocookie.net/valorant/images/b/b0/Reyna_icon.png',
        'Phoenix': 'https://static.wikia.nocookie.net/valorant/images/1/14/Phoenix_icon.png',
        'Raze': 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png',
        'Yoru': 'https://static.wikia.nocookie.net/valorant/images/d/d4/Yoru_icon.png',
        'Neon': 'https://static.wikia.nocookie.net/valorant/images/d/d0/Neon_icon.png',
        'Iso': 'https://via.placeholder.com/50/FF4654/FFFFFF?text=I',
        'Waylay': 'https://via.placeholder.com/50/FF4654/FFFFFF?text=W',
        'Brimstone': 'https://static.wikia.nocookie.net/valorant/images/4/4d/Brimstone_icon.png',
        'Omen': 'https://static.wikia.nocookie.net/valorant/images/b/b0/Omen_icon.png',
        'Viper': 'https://static.wikia.nocookie.net/valorant/images/5/5f/Viper_icon.png',
        'Astra': 'https://static.wikia.nocookie.net/valorant/images/0/08/Astra_icon.png',
        'Harbor': 'https://static.wikia.nocookie.net/valorant/images/f/f3/Harbor_icon.png',
        'Clove': 'https://via.placeholder.com/50/00D4AA/FFFFFF?text=C',
        'Sova': 'https://static.wikia.nocookie.net/valorant/images/4/49/Sova_icon.png',
        'Breach': 'https://static.wikia.nocookie.net/valorant/images/5/53/Breach_icon.png',
        'Skye': 'https://static.wikia.nocookie.net/valorant/images/3/33/Skye_icon.png',
        'KAY/O': 'https://static.wikia.nocookie.net/valorant/images/f/f0/KAYO_icon.png',
        'Fade': 'https://static.wikia.nocookie.net/valorant/images/a/a6/Fade_icon.png',
        'Gekko': 'https://static.wikia.nocookie.net/valorant/images/6/66/Gekko_icon.png',
        'Sage': 'https://static.wikia.nocookie.net/valorant/images/7/74/Sage_icon.png',
        'Cypher': 'https://static.wikia.nocookie.net/valorant/images/8/88/Cypher_icon.png',
        'Killjoy': 'https://static.wikia.nocookie.net/valorant/images/1/15/Killjoy_icon.png',
        'Chamber': 'https://static.wikia.nocookie.net/valorant/images/0/09/Chamber_icon.png',
        'Deadlock': 'https://static.wikia.nocookie.net/valorant/images/e/eb/Deadlock_icon.png',
        'Vyse': 'https://via.placeholder.com/50/9C88FF/FFFFFF?text=V'
      };
      
      return agentMap[agentName] || `https://via.placeholder.com/50/FF4654/FFFFFF?text=${agentName.charAt(0)}`;
    },
    
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
    
    calculateRoleCounts() {
      this.roleCounts = {};
      this.composition.forEach(assignment => {
        const role = assignment.role;
        this.roleCounts[role] = (this.roleCounts[role] || 0) + 1;
      });
    },
    
    resetGenerator() {
      this.showResults = false;
      this.composition = [];
      this.roleCounts = {};
      // Keep player names, selected role, and locked agents for convenience
    }
  }
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #ff4654;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(255, 70, 84, 0.3);
}

.setup-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section h2 {
  margin-bottom: 1rem;
  color: #00d4aa;
}

.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.section-header:hover h2 {
  color: #00e6c0;
}

.toggle-icon {
  position: absolute;
  right: 0;
  font-size: 1.2rem;
  color: #00d4aa;
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.collapsible-content {
  margin-top: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.section-description {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
}

.agent-mode-selection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mode-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #00d4aa;
}

.mode-label {
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: background-color 0.3s;
  color: rgba(255, 255, 255, 0.9);
}

.mode-label:hover {
  background: rgba(255, 255, 255, 0.1);
}

.lock-agents-section {
  margin-top: 1rem;
}

.players-input {
  display: grid;
  gap: 1rem;
}

.player-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-input label {
  min-width: 80px;
  text-align: left;
  font-weight: 500;
}

.player-input input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.player-input input:focus {
  outline: none;
  border-color: #00d4aa;
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.2);
}

.role-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #ff4654;
}

.role-label {
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.role-label:hover {
  background: rgba(255, 255, 255, 0.1);
}

.agent-locks {
  display: grid;
  gap: 1.5rem;
}

.role-lock-section {
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.role-lock-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #00d4aa;
  text-align: center;
}

.agent-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.no-lock-row {
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
}

.agent-option {
  display: flex;
  align-items: center;
}

.agent-option input[type="radio"] {
  display: none;
}

.agent-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.05);
  min-width: 70px;
}

.agent-label:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.agent-option input[type="radio"]:checked + .agent-label {
  border-color: #ff4654;
  background: rgba(255, 70, 84, 0.2);
}

.agent-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.agent-label span {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

.agent-label.no-lock {
  background: rgba(255, 255, 255, 0.02);
  border-style: dashed;
}

.agent-label.no-lock span {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.generate-btn, .reset-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.generate-btn {
  background: linear-gradient(135deg, #ff4654, #ff6b7a);
  color: white;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 70, 84, 0.4);
}

.generate-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
}

.reset-btn {
  background: linear-gradient(135deg, #00d4aa, #00b894);
  color: white;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 212, 170, 0.4);
}

.results-container {
  text-align: center;
}

.results-container h2 {
  color: #00d4aa;
  margin-bottom: 2rem;
}

.composition-results {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.player-assignment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #ff4654;
}

.agent-assignment {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.result-agent-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.role-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.role-icon.duelist {
  background: #ff4654;
}

.role-icon.controller {
  background: #00d4aa;
}

.role-icon.initiator {
  background: #ffb800;
  color: black;
}

.role-icon.sentinel {
  background: #9c88ff;
}

.agent-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.agent-name {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
}

.player-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.role-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.role-badge.duelist {
  background: #ff4654;
  color: white;
}

.role-badge.controller {
  background: #00d4aa;
  color: white;
}

.role-badge.initiator {
  background: #ffb800;
  color: black;
}

.role-badge.sentinel {
  background: #9c88ff;
  color: white;
}

.role-summary {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.role-summary h3 {
  margin-bottom: 1rem;
  color: #00d4aa;
}

.role-counts {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.role-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.role-name {
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.count {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff4654;
}

@media (max-width: 768px) {
  .player-input {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .player-input label {
    text-align: center;
  }
  
  .role-selection {
    flex-direction: column;
    align-items: center;
  }
  
  .player-assignment {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .agent-assignment {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .agent-info {
    align-items: center;
  }
  
  .role-counts {
    gap: 1rem;
  }
  
  .agent-selection {
    justify-content: center;
  }
  
  .agent-label {
    min-width: 60px;
  }
  
  .agent-icon {
    width: 35px;
    height: 35px;
  }
  
  .result-agent-icon {
    width: 40px;
    height: 40px;
  }
  
  .role-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>
