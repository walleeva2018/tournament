<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const tournaments = ref([])
const selectedTournament = ref(null)
const router = useRouter()
const editingMatchId = ref(null)
const winnerId = ref('')
const score = ref('')

// Krunker-specific fields
const krunkerStats = ref([])

const fetchTournaments = async () => {
  const res = await fetch('https://tournament-topaz.vercel.app/api/tournaments')
  tournaments.value = await res.json()
  if (tournaments.value.length > 0 && !selectedTournament.value) {
    selectedTournament.value = tournaments.value[0]
  } else if (selectedTournament.value) {
    // Refresh selected tournament data
    selectedTournament.value = tournaments.value.find(t => t._id === selectedTournament.value._id)
  }
}

onMounted(fetchTournaments)

const logout = () => {
  localStorage.removeItem('adminAuthenticated')
  router.push('/admin')
}

const gameType = computed(() => selectedTournament.value?.gameName)

const toggleEdit = (match) => {
  if (editingMatchId.value === match._id) {
    // Close if already editing
    editingMatchId.value = null
    return
  }
  
  editingMatchId.value = match._id
  winnerId.value = match.winner?._id || ''
  score.value = match.score || ''
  
  // Initialize Krunker stats
  if (gameType.value === 'Krunker' && match.players && match.players.length > 0) {
    try {
      krunkerStats.value = match.score ? JSON.parse(match.score) : match.players.map(p => ({
        playerId: p._id,
        playerName: p.name,
        kills: 0,
        damage: 0
      }))
    } catch {
      krunkerStats.value = match.players.map(p => ({
        playerId: p._id,
        playerName: p.name,
        kills: 0,
        damage: 0
      }))
    }
  }
}

const saveMatch = async (match) => {
  let finalScore = score.value

  // For Krunker, save stats as JSON
  if (gameType.value === 'Krunker' && krunkerStats.value.length > 0) {
    finalScore = JSON.stringify(krunkerStats.value)
  }

  try {
    await fetch(`https://tournament-topaz.vercel.app/api/tournaments/${selectedTournament.value._id}/matches/${match._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        winnerId: winnerId.value || null,
        score: finalScore
      })
    })
    await fetchTournaments()
    editingMatchId.value = null
    krunkerStats.value = []
  } catch (e) {
    console.error(e)
    alert('Failed to update match')
  }
}

const getMatchTitle = (match) => {
    if (match.players && match.players.length > 0) return 'Battle Royale'
    return `${match.player1?.name} vs ${match.player2?.name}`
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        <button @click="logout"
                class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105">
          Logout
        </button>
      </div>

      <div class="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="t in tournaments"
          :key="t._id"
          @click="selectedTournament = t; editingMatchId = null"
          :class="['px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold whitespace-nowrap text-sm sm:text-base transition-all duration-200 shadow-lg',
            selectedTournament?._id === t._id
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-105 shadow-blue-500/50'
              : 'bg-gray-800 hover:bg-gray-700 hover:scale-105']"
        >
          {{ t.gameName }}
        </button>
      </div>

      <div v-if="selectedTournament" class="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="match in selectedTournament.matches" :key="match._id"
           class="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-3 sm:p-4 rounded-xl border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">

        <div class="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
          <span class="font-semibold">{{ match.round }} - Group {{ match.group }}</span>
          <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold',
            match.winner ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400']">
            {{ match.winner ? '✓ Done' : '⏱ Pending' }}
          </span>
        </div>

        <div class="font-bold mb-2 sm:mb-3 text-center text-sm sm:text-base">{{ getMatchTitle(match) }}</div>
        
        <div v-if="match.winner" class="text-center text-sm text-green-400 mb-2">
          Winner: {{ match.winner.name }}
        </div>
        <div v-if="match.score" class="text-center text-sm text-gray-400 mb-2">
          Score: {{ match.score }}
        </div>

        <button
          @click="toggleEdit(match)"
          :class="['w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200',
            editingMatchId === match._id
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600'
              : 'bg-gray-700 hover:bg-gray-600']"
        >
          {{ editingMatchId === match._id ? '✕ Close' : '✏️ Edit Result' }}
        </button>

        <!-- Inline Edit Form -->
        <div v-if="editingMatchId === match._id" class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50 space-y-3">
          <!-- Winner Selection -->
          <div>
            <label class="block text-xs sm:text-sm mb-1 font-semibold text-gray-300">Winner</label>
            <select v-model="winnerId" class="w-full bg-gray-700/80 p-2 rounded-lg border border-gray-600 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all">
              <option value="">Select Winner</option>
              <template v-if="!match.players || match.players.length === 0">
                  <option :value="match.player1?._id">{{ match.player1?.name }}</option>
                  <option :value="match.player2?._id">{{ match.player2?.name }}</option>
              </template>
              <template v-else>
                  <option v-for="p in match.players" :key="p._id" :value="p._id">{{ p.name }}</option>
              </template>
            </select>
          </div>

          <!-- Table Tennis: Score -->
          <div v-if="gameType === 'Table Tennis'">
            <label class="block text-xs sm:text-sm mb-1 font-semibold text-gray-300">Score (e.g., 3-1)</label>
            <input v-model="score" type="text" class="w-full bg-gray-700/80 p-2 rounded-lg border border-gray-600 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. 3-1, 11-9" />
          </div>

          <!-- Krunker: Kills and Damage -->
          <div v-if="gameType === 'Krunker' && krunkerStats.length > 0">
            <label class="block text-xs sm:text-sm mb-2 font-semibold text-gray-300">Player Stats</label>
            <div class="space-y-2">
              <div v-for="stat in krunkerStats" :key="stat.playerId" class="bg-gray-700/50 p-2 rounded-lg border border-gray-600/50">
                <div class="text-xs font-medium mb-1 text-gray-200">{{ stat.playerName }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-400">Kills</label>
                    <input v-model.number="stat.kills" type="number" class="w-full bg-gray-600/80 p-1 rounded text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                  </div>
                  <div>
                    <label class="text-xs text-gray-400">Damage</label>
                    <input v-model.number="stat.damage" type="number" class="w-full bg-gray-600/80 p-1 rounded text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save/Cancel Buttons -->
          <div class="flex gap-2 pt-2">
            <button @click="editingMatchId = null; krunkerStats = []" class="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">Cancel</button>
            <button @click="saveMatch(match)" class="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">💾 Save</button>
          </div>
        </div>

      </div>
    </div>
    </div>

  </div>
</template>
