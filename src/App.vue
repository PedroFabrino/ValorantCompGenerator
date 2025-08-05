<template>
  <div class="app">
    <h1>Valorant Comp Randomizer</h1>
    
    <div v-if="!showResults" class="setup-container">
      <!-- Player Names Input -->
      <div class="section">
        <h2>Enter Player Names</h2>
        <div class="players-input">
          <div v-for="(player, index) in players" :key="index" class="player-input">
            <label :for="`player-${index}`">Player {{ index + 1 }}:</label>
            <input 
              :id="`player-${index}`"
              v-model="players[index]" 
              type="text" 
              :placeholder="`Player ${index + 1} name`"
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
          <span class="role-badge" :class="assignment.role.toLowerCase()">
            {{ assignment.role }}
          </span>
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
      selectedRole: '',
      showResults: false,
      composition: [],
      roleCounts: {}
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
      
      // Assign roles to players
      this.composition = this.players.map((player, index) => ({
        player: player.trim(),
        role: shuffledRoles[index]
      }));
      
      // Calculate role counts for summary
      this.calculateRoleCounts();
      
      this.showResults = true;
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
      // Keep player names and selected role for convenience
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
    gap: 0.5rem;
  }
  
  .role-counts {
    gap: 1rem;
  }
}
</style>
