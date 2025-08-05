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
import { agentsByRole, roles, availableRoles, agentIconMap } from './data/agents.js';
import { shuffleArray, getAgentIcon, calculateRoleCounts, assignAgentForRole } from './utils/gameLogic.js';
import './assets/styles.css';

export default {
  name: 'ValorantCompRandomizer',
  data() {
    return {
      players: ['', '', '', '', ''],
      roles,
      availableRoles,
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
      agentsByRole
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
      // Determine which role to double
      let doubleRole = this.selectedRole;
      if (doubleRole === 'Random') {
        doubleRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
      }
      
      // Create role pool: 4 different roles + 1 doubled role
      const rolePool = [...availableRoles, doubleRole];
      
      // Shuffle roles
      const shuffledRoles = shuffleArray(rolePool);
      
      // Reset composition for fresh assignment
      this.composition = [];
      
      // Track used agents to prevent duplicates (for both locked and random modes)
      const usedAgents = new Set();
      
      // Assign roles and agents to players
      this.composition = this.players.map((player, index) => {
        const role = shuffledRoles[index];
        const agent = assignAgentForRole(
          role,
          this.agentMode,
          this.agentsByRole,
          this.lockedAgents,
          usedAgents
        );
        
        return {
          player: player.trim(),
          role: role,
          agent: agent
        };
      });
      
      // Calculate role counts for summary
      this.roleCounts = calculateRoleCounts(this.composition);
      
      this.showResults = true;
    },
    
    getAgentIcon(agentName) {
      return getAgentIcon(agentName, agentIconMap);
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
