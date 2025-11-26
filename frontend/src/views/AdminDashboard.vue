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
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <button @click="logout" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded">Logout</button>
    </div>

    <div class="flex gap-4 mb-8 overflow-x-auto">
      <button 
        v-for="t in tournaments" 
        :key="t._id"
        @click="selectedTournament = t; editingMatchId = null"
        :class="['px-4 py-2 rounded-full font-bold whitespace-nowrap', 
          selectedTournament?._id === t._id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600']"
      >
        {{ t.gameName }}
      </button>
    </div>

    <div v-if="selectedTournament" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="match in selectedTournament.matches" :key="match._id" 
           class="bg-gray-800 p-4 rounded border border-gray-700">
        
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>{{ match.round }} - Group {{ match.group }}</span>
          <span :class="match.winner ? 'text-green-500' : 'text-yellow-500'">
            {{ match.winner ? 'Completed' : 'Scheduled' }}
          </span>
        </div>

        <div class="font-bold mb-2 text-center">{{ getMatchTitle(match) }}</div>
        
        <div v-if="match.winner" class="text-center text-sm text-green-400 mb-2">
          Winner: {{ match.winner.name }}
        </div>
        <div v-if="match.score" class="text-center text-sm text-gray-400 mb-2">
          Score: {{ match.score }}
        </div>

        <button 
          @click="toggleEdit(match)"
          :class="['w-full py-1 rounded text-sm', editingMatchId === match._id ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 hover:bg-gray-600']"
        >
          {{ editingMatchId === match._id ? 'Close Edit' : 'Edit Result' }}
        </button>

        <!-- Inline Edit Form -->
        <div v-if="editingMatchId === match._id" class="mt-4 pt-4 border-t border-gray-700 space-y-3">
          <!-- Winner Selection -->
          <div>
            <label class="block text-xs mb-1 font-semibold">Winner</label>
            <select v-model="winnerId" class="w-full bg-gray-700 p-2 rounded border border-gray-600 text-sm">
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
            <label class="block text-xs mb-1 font-semibold">Score (e.g., 3-1)</label>
            <input v-model="score" type="text" class="w-full bg-gray-700 p-2 rounded border border-gray-600 text-sm" placeholder="e.g. 3-1, 11-9" />
          </div>

          <!-- Krunker: Kills and Damage -->
          <div v-if="gameType === 'Krunker' && krunkerStats.length > 0">
            <label class="block text-xs mb-2 font-semibold">Player Stats</label>
            <div class="space-y-2">
              <div v-for="stat in krunkerStats" :key="stat.playerId" class="bg-gray-700 p-2 rounded">
                <div class="text-xs font-medium mb-1">{{ stat.playerName }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-400">Kills</label>
                    <input v-model.number="stat.kills" type="number" class="w-full bg-gray-600 p-1 rounded text-xs" />
                  </div>
                  <div>
                    <label class="text-xs text-gray-400">Damage</label>
                    <input v-model.number="stat.damage" type="number" class="w-full bg-gray-600 p-1 rounded text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save/Cancel Buttons -->
          <div class="flex gap-2 pt-2">
            <button @click="editingMatchId = null; krunkerStats = []" class="flex-1 bg-gray-600 hover:bg-gray-500 py-1 rounded text-sm">Cancel</button>
            <button @click="saveMatch(match)" class="flex-1 bg-green-600 hover:bg-green-500 py-1 rounded text-sm">Save</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
