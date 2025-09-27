<template>
  <div class="app">
    <h1 style="margin: 0 0 0 0; font-size: 2.7rem; font-weight: bold; color: #ff4a5c; letter-spacing: 1px; text-align: center;">Valorant Comp Randomizer</h1>
    <div class="center-content">
      <div v-if="!showResults" class="setup-container">
        <!-- Player Names Input -->
        <div class="section">
          <h2>Enter Player Names</h2>
          <div class="players-input">
            <div v-for="(player, index) in players" :key="index" class="player-input" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; position: relative;">
              <input 
                :id="`player-${index}`"
                v-model="players[index]" 
                type="text" 
                :placeholder="`Player ${index + 1}`"
                required
                style="flex: 1 1 0; min-width: 0; padding-right: 2rem;"
              >
                <button
                  v-if="players[index]"
                  @click="players[index] = ''"
                  type="button"
                  aria-label="Clear name"
                  style="
                    position: absolute;
                    right: 7rem;
                    background: transparent;
                    border: none;
                    color: #aaa;
                    font-size: 1.1rem;
                    cursor: pointer;
                    padding: 0 0.3rem;
                    z-index: 2;
                    top: 50%;
                    transform: translateY(-50%);"
                  @mouseover="event.target.style.color='#ff4a5c'"
                  @mouseleave="event.target.style.color='#aaa'"
                >
                  ×
                </button>
              </input>
              <select v-model="lockedRoles[index]" style="padding: 0.2rem 0.5rem; border-radius: 6px; border: 1px solid #333; background: #23262f; color: #fff;">
                <option value="">Any Role</option>
                <option v-for="role in availableRoles" :key="role" :value="role">{{ role }}</option>
              </select>
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
        
        <button @click="clearRoleHistory" class="clear-history-btn" title="Clear role history to reset anti-repetition system">
          Clear Role History
        </button>
      </div>
    </div>
    <div class="teammates-panel">
      <h3 style="margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem; letter-spacing: 0.5px;">Recent/Frequent Teammates</h3>
      <div v-if="recentTeammates.length === 0" class="empty-teammates" style="color: #888; text-align: center;">No teammates yet.</div>
      <div v-else class="teammates-list" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start;">
        <button
          v-for="mate in filteredTeammates"
          :key="mate"
          type="button"
          class="teammate-btn"
          @click="autofillTeammate(mate)"
          style="
            background: #23262f;
            border: none;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            color: #fff;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.15s;
            box-shadow: 0 1px 3px #0001;
            margin: 0;
          "
          @mouseover="event.target.style.background='#2e3240'"
          @mouseleave="event.target.style.background='#23262f'"
        >
          {{ mate }}
        </button>
      </div>
  
    </div>
  </div>
</template>

<script>
import { agentsByRole, roles, availableRoles, agentIconMap } from './data/agents.js';
import { shuffleArray, getAgentIcon, calculateRoleCounts, assignAgentForRole, assignRolesWithHistory } from './utils/gameLogic.js';
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
      agentsByRole,
      // Track role history to reduce repetition
      roleHistory: {}, // { playerName: [role1, role2, ...] }
      recentTeammates: [], // List of recent/frequent teammates
      lockedRoles: ['', '', '', '', ''] // New: lock a role for each player
    }
  },
  mounted() {
    // Load teammates from localStorage if available
    const stored = localStorage.getItem('recentTeammates');
    if (stored) {
      try {
        this.recentTeammates = JSON.parse(stored);
      } catch {}
    }
  },
  computed: {
    canGenerate() {
      const allPlayersNamed = this.players.every(player => player.trim() !== '');
      const roleSelected = this.selectedRole !== '';
      return allPlayersNamed && roleSelected;
    },
    filteredTeammates() {
      // Hide teammates already present in the player input list
      const playerSet = new Set(this.players.map(p => p.trim()).filter(Boolean));
      return this.recentTeammates.filter(mate => !playerSet.has(mate));
    }
  },
  methods: {
    // Add or update teammate frequency, keep most recent/frequent at top
    updateTeammatesList() {
      // Gather all non-empty player names
      const allNames = this.players.filter(name => name.trim() !== '');
      // Add from current comp as well
      if (this.composition && this.composition.length) {
        this.composition.forEach(a => {
          if (a.player && !allNames.includes(a.player)) allNames.push(a.player);
        });
      }
      // Count frequency
      const freq = {};
      allNames.forEach(name => {
        if (!freq[name]) freq[name] = 0;
        freq[name]++;
      });
      // Add previous
      this.recentTeammates.forEach(name => {
        if (!freq[name]) freq[name] = 0;
      });
      // Sort by frequency, then recency (latest at top)
      const sorted = Object.keys(freq)
        .sort((a, b) => freq[b] - freq[a] || allNames.lastIndexOf(b) - allNames.lastIndexOf(a));
      // Limit to 10
      this.recentTeammates = sorted.slice(0, 10);
      localStorage.setItem('recentTeammates', JSON.stringify(this.recentTeammates));
    },

    autofillTeammate(name) {
      // Insert into first empty slot, or replace the last one if all are filled
      let inserted = false;
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].trim() === '') {
          this.players[i] = name;
          inserted = true;
          console.log('Autofilled', name, 'into slot', i);
          break;
        }
      }
      if (!inserted) {
        // If all slots are filled, replace the last one
        this.players[this.players.length - 1] = name;
        console.log('Autofilled', name, 'into last slot');
      }
    },
  generateComposition() {
      // Determine which role to double
      let doubleRole = this.selectedRole;
      if (doubleRole === 'Random') {
        doubleRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
      }
      // Create role pool: 4 different roles + 1 doubled role
      const rolePool = [...availableRoles, doubleRole];

      // 1. Assign locked roles first
      const assignedRoles = Array(this.players.length).fill(null);
      const usedRoles = [];
      let remainingPool = [...rolePool];
      // First, assign locked roles and remove them from the pool
      this.lockedRoles.forEach((locked, idx) => {
        if (locked && this.players[idx].trim() !== '') {
          assignedRoles[idx] = locked;
          // Remove one instance of this role from the pool
          const i = remainingPool.indexOf(locked);
          if (i !== -1) remainingPool.splice(i, 1);
          usedRoles.push(locked);
        }
      });
      // 2. Assign remaining roles randomly (with history)
      // Get indices of players who are not locked
      const toAssign = this.players.map((p, i) => (assignedRoles[i] === null && p.trim() !== '') ? i : null).filter(i => i !== null);
      // Prepare a fake player list for assignRolesWithHistory
      const assignPlayers = toAssign.map(i => this.players[i]);
      // Assign roles for the remaining players
      const assignedRest = assignRolesWithHistory(assignPlayers, remainingPool, this.roleHistory);
      toAssign.forEach((idx, j) => {
        assignedRoles[idx] = assignedRest[j];
      });
      // Now assignedRoles is the final role assignment for each player
      this.composition = [];
      const usedAgents = new Set();
      this.composition = this.players.map((player, index) => {
        const role = assignedRoles[index];
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
      // Update role history for each player
      this.composition.forEach(assignment => {
        const playerName = assignment.player;
        if (!this.roleHistory[playerName]) {
          this.roleHistory[playerName] = [];
        }
        this.roleHistory[playerName].push(assignment.role);
        // Keep only the last 5 roles to prevent infinite growth
        if (this.roleHistory[playerName].length > 5) {
          this.roleHistory[playerName] = this.roleHistory[playerName].slice(-5);
        }
      });
      // Update teammates list
      this.updateTeammatesList();
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
    },
    
    clearRoleHistory() {
      this.roleHistory = {};
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  color: #fff;
  font-family: 'Inter', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.center-content {
  max-width: 600px;
  width: 100%;
  margin: 1rem auto 2rem auto;
  border-radius: 16px;
  padding: 0 2rem 2rem 2rem;
  z-index: 1;
  background: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.setup-container, .results-container {
  width: 100%;
  background: none;
  box-shadow: none;
  border-radius: 12px;
}
.teammates-panel {
  position: fixed;
  top: 3rem;
  right: 3rem;
  width: 260px;
  min-width: 180px;
  background: #181a20ee;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px #0002;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 1100px) {
  .teammates-panel {
    position: static;
    margin: 2rem auto 0 auto;
    width: 90%;
    min-width: unset;
    right: unset;
    top: unset;
  }
}
</style>
