<script setup>
import { computed } from 'vue'

const props = defineProps({
  tournament: Object
})

const parseKrunkerStats = (scoreString) => {
  try {
    return JSON.parse(scoreString)
  } catch {
    return null
  }
}

const defaultAvatar = '/avatars/default-avatar.svg'

const handleImageError = (event) => {
  event.target.src = defaultAvatar
}

// Sort matches: completed matches (with winners) first, then pending
const sortedMatches = computed(() => {
  if (!props.tournament?.matches) return []

  return [...props.tournament.matches].sort((a, b) => {
    // If both have winners or both don't, maintain original order
    if ((a.winner && b.winner) || (!a.winner && !b.winner)) return 0
    // If a has winner and b doesn't, a comes first
    if (a.winner && !b.winner) return -1
    // If b has winner and a doesn't, b comes first
    return 1
  })
})
</script>

<template>
  <div class="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="match in sortedMatches" :key="match._id"
         :class="[
           'relative bg-gradient-to-br from-slate-900/90 to-gray-900/90 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03] backdrop-blur-sm overflow-hidden group',
           match.winner ? 'border-green-500/40 shadow-green-500/20' : 'border-purple-500/30 shadow-purple-500/20'
         ]">

      <!-- Glow Effect -->
      <div :class="['absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        match.winner ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5' : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5']"></div>

      <div class="relative flex justify-between text-[10px] sm:text-xs mb-3 sm:mb-4 uppercase tracking-wider">
        <span class="font-bold text-gray-400 bg-gray-800/60 px-3 py-1 rounded-lg">{{ match.round }} - Group {{ match.group }}</span>
        <span :class="[
          'px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg',
          match.winner ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/50' : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-yellow-500/50 animate-pulse'
        ]">
          <span>{{ match.winner ? '✓ Done' : '⏱ Pending' }}</span>
        </span>
      </div>

      <!-- 1v1 Match -->
      <div v-if="!match.players || match.players.length === 0" class="relative mb-4">
        <div class="flex justify-between items-center gap-3">
          <div class="flex flex-col items-center flex-1 min-w-0 group/player">
            <!-- Trophy above winner -->
            <div v-if="match.winner?._id === match.player1?._id" class="text-3xl sm:text-4xl mb-1 animate-bounce drop-shadow-lg">
              🏆
            </div>
            <div class="relative mb-2 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full flex-shrink-0 transition-transform duration-300 group-hover/player:scale-110">
              <img :src="match.player1?.avatarUrl || defaultAvatar"
                   :alt="match.player1?.name"
                   @error="handleImageError"
                   :class="[
                     'w-full h-full bg-gray-700 object-cover object-center rounded-full transition-all duration-300',
                     match.winner?._id === match.player1?._id ? 'ring-4 ring-green-500 shadow-lg shadow-green-500/50' : 'ring-2 ring-purple-500/50'
                   ]"
              />
              <div v-if="match.winner?._id === match.player1?._id"
                   class="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1.5 z-10 shadow-lg shadow-green-500/50 animate-bounce">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            </div>
            <span :class="[
              'text-[10px] sm:text-xs text-center truncate w-full font-bold',
              match.winner?._id === match.player1?._id ? 'text-green-300' : 'text-gray-300'
            ]">{{ match.player1?.name }}</span>
          </div>

          <div class="flex flex-col items-center px-2 sm:px-3">
            <span class="text-sm sm:text-base font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg shadow-lg shadow-purple-500/50">VS</span>
          </div>

          <div class="flex flex-col items-center flex-1 min-w-0 group/player">
            <!-- Trophy above winner -->
            <div v-if="match.winner?._id === match.player2?._id" class="text-3xl sm:text-4xl mb-1 animate-bounce drop-shadow-lg">
              🏆
            </div>
            <div class="relative mb-2 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full flex-shrink-0 transition-transform duration-300 group-hover/player:scale-110">
              <img :src="match.player2?.avatarUrl || defaultAvatar"
                   :alt="match.player2?.name"
                   @error="handleImageError"
                   :class="[
                     'w-full h-full bg-gray-700 object-cover object-center rounded-full transition-all duration-300',
                     match.winner?._id === match.player2?._id ? 'ring-4 ring-green-500 shadow-lg shadow-green-500/50' : 'ring-2 ring-purple-500/50'
                   ]"
              />
              <div v-if="match.winner?._id === match.player2?._id"
                   class="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1.5 z-10 shadow-lg shadow-green-500/50 animate-bounce">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            </div>
            <span :class="[
              'text-[10px] sm:text-xs text-center truncate w-full font-bold',
              match.winner?._id === match.player2?._id ? 'text-green-300' : 'text-gray-300'
            ]">{{ match.player2?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Battle Royale (Krunker) -->
      <div v-else class="relative mb-4">
        <div class="text-center font-black mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-xl shadow-lg shadow-purple-500/30 border border-purple-500/30">
          🎮 Battle Royale - 4 Players
        </div>
        <div class="grid grid-cols-4 gap-2 sm:gap-3">
          <div v-for="p in match.players" :key="p._id" class="flex flex-col items-center group/player">
            <div class="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full flex-shrink-0 mb-1 transition-transform duration-300 group-hover/player:scale-110">
              <img :src="p.avatarUrl || defaultAvatar"
                   :alt="p.name"
                   @error="handleImageError"
                   class="w-full h-full object-cover object-center ring-2 ring-purple-500/60 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover/player:ring-4 group-hover/player:ring-pink-500"
              />
            </div>
            <span class="text-[8px] sm:text-[10px] mt-1 text-center truncate w-full font-bold text-gray-300" :title="p.name">{{ p.name.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

      <!-- Results Display -->
      <div v-if="match.winner" class="relative border-t-2 border-green-500/30 pt-3 sm:pt-4 mt-3 sm:mt-4">
        <!-- Table Tennis: Winner + Score -->
        <div v-if="tournament.gameName === 'Table Tennis'" class="text-center">
          <div class="text-green-300 font-black text-sm sm:text-base mb-2">
            <span class="bg-gradient-to-r from-green-300 to-emerald-300 text-transparent bg-clip-text">Winner: {{ match.winner.name }}</span>
          </div>
          <div v-if="match.score" class="text-xs sm:text-sm text-white font-bold bg-gradient-to-r from-green-600 to-emerald-600 py-2 px-4 rounded-lg inline-block shadow-lg shadow-green-500/30">
            Score: {{ match.score }}
          </div>
        </div>

        <!-- Krunker: Stats Table -->
        <div v-else-if="tournament.gameName === 'Krunker' && parseKrunkerStats(match.score)" class="text-[10px] sm:text-xs">
          <div class="text-green-300 font-black text-center mb-3 text-sm sm:text-base">
            <span class="bg-gradient-to-r from-green-300 to-emerald-300 text-transparent bg-clip-text">Winner: {{ match.winner.name }}</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50">
              <thead class="text-gray-400 bg-gradient-to-r from-gray-800 to-gray-900 font-bold">
                <tr>
                  <th class="p-2 sm:p-3">Player</th>
                  <th class="p-2 sm:p-3 text-right">Kills</th>
                  <th class="p-2 sm:p-3 text-right">Dmg</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in parseKrunkerStats(match.score)" :key="stat.playerId"
                    :class="[
                      'border-t border-gray-700/30 transition-colors duration-200',
                      stat.playerId === match.winner._id ? 'text-green-300 font-black bg-gradient-to-r from-green-900/30 to-emerald-900/30' : 'text-gray-400 hover:bg-gray-800/30'
                    ]">
                  <td class="p-2 sm:p-3 truncate max-w-[100px]">{{ stat.playerName }}</td>
                  <td class="p-2 sm:p-3 text-right font-bold">{{ stat.kills }}</td>
                  <td class="p-2 sm:p-3 text-right font-bold">{{ stat.damage }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Chess & Programming: Winner Only -->
        <div v-else class="text-center">
          <div class="text-green-300 font-black text-sm sm:text-base flex items-center justify-center gap-2">
            <span class="text-2xl animate-bounce">🏆</span>
            <span class="bg-gradient-to-r from-green-300 to-emerald-300 text-transparent bg-clip-text">{{ match.winner.name }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
