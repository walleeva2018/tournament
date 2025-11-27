<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const tournaments = ref([])
const selectedTournament = ref(null)
const router = useRouter()
const editingMatchId = ref(null)
const winnerId = ref('')
const score = ref('')
const searchQuery = ref('')

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
    const p1Name = match.player1?.name || 'TBD'
    const p2Name = match.player2?.name || 'TBD'
    return `${p1Name} vs ${p2Name}`
}

const parseKrunkerStats = (scoreStr) => {
  try {
    return JSON.parse(scoreStr)
  } catch {
    return []
  }
}

// Filter matches based on search query
const filteredMatches = computed(() => {
  if (!selectedTournament.value || !searchQuery.value.trim()) {
    return selectedTournament.value?.matches || []
  }

  const query = searchQuery.value.toLowerCase().trim()

  return selectedTournament.value.matches.filter(match => {
    // For Battle Royale matches (Krunker)
    if (match.players && match.players.length > 0) {
      return match.players.some(p => p?.name?.toLowerCase().includes(query))
    }

    // For regular 1v1 matches
    const player1Name = match.player1?.name?.toLowerCase() || ''
    const player2Name = match.player2?.name?.toLowerCase() || ''

    return player1Name.includes(query) || player2Name.includes(query)
  })
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4 animate-slide-down">
        <div>
          <div class="inline-block mb-2 px-4 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
            <span class="text-purple-300 text-xs font-semibold tracking-wider uppercase">Admin Panel</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-2xl">
            Tournament Control Center
          </h1>
        </div>
        <button @click="logout"
                class="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-6 sm:px-8 py-3 rounded-xl font-bold shadow-2xl shadow-red-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
          <span class="relative z-10">Logout</span>
          <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <div class="flex gap-3 sm:gap-4 mb-8 sm:mb-10 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
        <button
          v-for="t in tournaments"
          :key="t._id"
          @click="selectedTournament = t; editingMatchId = null; searchQuery = ''"
          :class="[
            'relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold whitespace-nowrap text-sm sm:text-base transition-all duration-300 group overflow-hidden',
            selectedTournament?._id === t._id
              ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white scale-110 shadow-2xl shadow-purple-500/50'
              : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:scale-105 backdrop-blur-sm border border-gray-700/50'
          ]"
        >
          <span class="relative z-10">{{ t.gameName }}</span>
          <div v-if="selectedTournament?._id === t._id" class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur-xl"></div>
        </button>
      </div>

      <!-- Search Bar -->
      <div v-if="selectedTournament" class="mb-6 sm:mb-8 animate-fade-in">
        <div class="relative max-w-xl mx-auto">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search player name..."
            class="w-full bg-gradient-to-r from-gray-800/90 to-gray-900/90 border-2 border-purple-500/30 text-white placeholder-gray-400 pl-12 pr-4 py-3 sm:py-4 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm font-medium"
          />
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              @click="searchQuery = ''"
              class="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-gray-700/50"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="text-center mt-3">
          <span class="text-xs sm:text-sm text-gray-400">
            Showing <span class="text-purple-400 font-bold">{{ filteredMatches.length }}</span> of <span class="text-gray-300 font-bold">{{ selectedTournament.matches.length }}</span> matches
          </span>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="selectedTournament && searchQuery && filteredMatches.length === 0" class="text-center py-16 animate-fade-in">
        <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-700/50 max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h3 class="text-xl font-bold text-gray-300 mb-2">No matches found</h3>
          <p class="text-gray-400 text-sm mb-4">No matches found for player "<span class="text-purple-400 font-semibold">{{ searchQuery }}</span>"</p>
          <button
            @click="searchQuery = ''"
            class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            Clear Search
          </button>
        </div>
      </div>

      <div v-if="selectedTournament && filteredMatches.length > 0" class="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="match in filteredMatches" :key="match._id"
           class="relative bg-gradient-to-br from-slate-900/90 to-gray-900/90 p-4 sm:p-5 rounded-2xl border-2 border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm overflow-hidden group">

        <!-- Glow Effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div class="relative flex justify-between text-[10px] sm:text-xs mb-3 sm:mb-4 uppercase tracking-wider">
          <span class="font-bold text-gray-400 bg-gray-800/60 px-3 py-1 rounded-lg">{{ match.round }} - Group {{ match.group }}</span>
          <span :class="[
            'px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg',
            match.winner ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/50' : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-yellow-500/50'
          ]">
            {{ match.winner ? '✓ Done' : '⏱ Pending' }}
          </span>
        </div>

        <div class="relative font-black mb-3 sm:mb-4 text-center text-sm sm:text-base bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">{{ getMatchTitle(match) }}</div>
        
        <div v-if="match.winner" class="relative text-center text-sm font-bold text-green-300 mb-3 bg-green-900/20 py-2 px-3 rounded-lg border border-green-500/30">
          🏆 Winner: {{ match.winner?.name || 'Unknown' }}
        </div>
        <div v-if="match.score && gameType !== 'Krunker'" class="relative text-center text-sm font-bold text-white mb-3 bg-purple-900/20 py-2 px-3 rounded-lg border border-purple-500/30">
          Score: {{ match.score }}
        </div>

        <!-- Krunker Stats Display -->
        <div v-if="match.score && gameType === 'Krunker'" class="relative text-xs font-bold text-white mb-3 bg-purple-900/20 py-2 px-3 rounded-lg border border-purple-500/30">
          <div class="font-semibold text-purple-300 mb-1">Match Stats:</div>
          <div v-for="(stat, idx) in parseKrunkerStats(match.score)" :key="idx" class="flex justify-between py-1 border-b border-purple-500/10 last:border-0">
            <span class="text-gray-300">{{ stat.playerName }}</span>
            <span class="text-purple-300">{{ stat.kills }}K / {{ stat.damage }}D</span>
          </div>
        </div>

        <button
          @click="toggleEdit(match)"
          :class="[
            'relative w-full py-3 rounded-xl text-sm font-black transition-all duration-300 overflow-hidden group/btn shadow-lg',
            editingMatchId === match._id
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-500/50'
              : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-gray-700/50 hover:scale-105'
          ]"
        >
          <span class="relative z-10">{{ editingMatchId === match._id ? '✕ Close' : '✏️ Edit Result' }}</span>
          <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        </button>

        <!-- Inline Edit Form -->
        <div v-if="editingMatchId === match._id" class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50 space-y-3">

          <!-- Show participating players -->
          <div v-if="!match.players || match.players.length === 0" class="bg-purple-900/20 p-2 rounded-lg border border-purple-500/30">
            <div class="text-xs font-semibold text-purple-300 mb-1">Match Participants:</div>
            <div class="flex justify-between text-xs text-gray-300">
              <span>{{ match.player1?.name || 'Player 1 TBD' }}</span>
              <span class="text-purple-400">vs</span>
              <span>{{ match.player2?.name || 'Player 2 TBD' }}</span>
            </div>
          </div>
          <div v-else class="bg-purple-900/20 p-2 rounded-lg border border-purple-500/30">
            <div class="text-xs font-semibold text-purple-300 mb-1">Battle Participants ({{ match.players.length }}):</div>
            <div class="flex flex-wrap gap-1">
              <span v-for="p in match.players" :key="p._id" class="text-xs bg-gray-700/60 px-2 py-1 rounded text-gray-300">
                {{ p?.name || 'Unknown' }}
              </span>
            </div>
          </div>

          <!-- Winner Selection -->
          <div>
            <label class="block text-xs sm:text-sm mb-2 font-semibold text-gray-300">
              🏆 Select Winner
            </label>
            <select v-model="winnerId" class="w-full bg-gray-700/80 p-3 rounded-lg border border-gray-600 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all">
              <option value="">-- Select Winner --</option>
              <template v-if="!match.players || match.players.length === 0">
                  <option :value="match.player1?._id">{{ match.player1?.name || 'Player 1' }}</option>
                  <option :value="match.player2?._id">{{ match.player2?.name || 'Player 2' }}</option>
              </template>
              <template v-else>
                  <option v-for="p in match.players" :key="p._id" :value="p._id">{{ p?.name || 'Unknown Player' }}</option>
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
