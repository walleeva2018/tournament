<script setup>
defineProps({
  tournament: Object
})

const parseKrunkerStats = (scoreString) => {
  try {
    return JSON.parse(scoreString)
  } catch {
    return null
  }
}
</script>

<template>
  <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="match in tournament.matches" :key="match._id"
         :class="['bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-3 sm:p-4 rounded-xl border transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-[1.02]',
           match.winner ? 'border-green-700/30' : 'border-gray-700/50']">

      <div class="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 uppercase tracking-wider">
        <span class="font-semibold">{{ match.round }} - Group {{ match.group }}</span>
        <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold',
          match.winner ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400']">
          {{ match.winner ? '✓ Done' : '⏱ Pending' }}
        </span>
      </div>

      <!-- 1v1 Match -->
      <div v-if="!match.players || match.players.length === 0" class="mb-3">
        <div class="flex justify-between items-center gap-2">
          <div class="flex flex-col items-center flex-1 min-w-0">
            <div class="relative mb-1 w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full flex-shrink-0">
              <img :src="match.player1?.avatarUrl" :alt="match.player1?.name"
                   class="w-full h-full bg-gray-700 object-cover object-center ring-2 ring-gray-600 rounded-full" />
              <div v-if="match.winner?._id === match.player1?._id"
                   class="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 z-10">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            </div>
            <span class="text-[10px] sm:text-xs text-center truncate w-full font-medium">{{ match.player1?.name }}</span>
          </div>

          <div class="flex flex-col items-center px-1 sm:px-2">
            <span class="text-xs sm:text-sm font-bold text-gray-600 bg-gray-700/50 px-2 py-1 rounded">VS</span>
          </div>

          <div class="flex flex-col items-center flex-1 min-w-0">
            <div class="relative mb-1 w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full flex-shrink-0">
              <img :src="match.player2?.avatarUrl" :alt="match.player2?.name"
                   class="w-full h-full bg-gray-700 object-cover object-center ring-2 ring-gray-600 rounded-full" />
              <div v-if="match.winner?._id === match.player2?._id"
                   class="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 z-10">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            </div>
            <span class="text-[10px] sm:text-xs text-center truncate w-full font-medium">{{ match.player2?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Battle Royale (Krunker) -->
      <div v-else class="mb-3">
        <div class="text-center font-bold mb-2 sm:mb-3 text-purple-400 text-xs sm:text-sm bg-purple-900/20 py-1 rounded">
          🎮 4-Player Battle
        </div>
        <div class="grid grid-cols-4 gap-1 sm:gap-2">
          <div v-for="p in match.players" :key="p._id" class="flex flex-col items-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full flex-shrink-0">
              <img :src="p.avatarUrl" :alt="p.name"
                   class="w-full h-full border-2 border-gray-700 object-cover object-center ring-1 ring-gray-600 rounded-full" />
            </div>
            <span class="text-[8px] sm:text-[10px] mt-1 text-center truncate w-full" :title="p.name">{{ p.name.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

      <!-- Results Display -->
      <div v-if="match.winner" class="border-t border-gray-700/50 pt-2 sm:pt-3 mt-2 sm:mt-3">
        <!-- Table Tennis: Winner + Score -->
        <div v-if="tournament.gameName === 'Table Tennis'" class="text-center">
          <div class="text-green-400 font-bold text-sm sm:text-base mb-1">🏆 {{ match.winner.name }}</div>
          <div v-if="match.score" class="text-xs sm:text-sm text-gray-400 bg-gray-800/50 py-1 px-2 rounded inline-block">
            {{ match.score }}
          </div>
        </div>

        <!-- Krunker: Stats Table -->
        <div v-else-if="tournament.gameName === 'Krunker' && parseKrunkerStats(match.score)" class="text-[10px] sm:text-xs">
          <div class="text-green-400 font-bold text-center mb-2 text-xs sm:text-sm">🏆 {{ match.winner.name }}</div>
          <div class="overflow-x-auto">
            <table class="w-full text-left bg-gray-800/30 rounded">
              <thead class="text-gray-500 bg-gray-800/50">
                <tr>
                  <th class="p-1 sm:p-2">Player</th>
                  <th class="p-1 sm:p-2 text-right">Kills</th>
                  <th class="p-1 sm:p-2 text-right">Dmg</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in parseKrunkerStats(match.score)" :key="stat.playerId"
                    :class="['border-t border-gray-700/30',
                      stat.playerId === match.winner._id ? 'text-green-400 font-bold bg-green-900/10' : 'text-gray-400']">
                  <td class="p-1 sm:p-2 truncate max-w-[80px]">{{ stat.playerName }}</td>
                  <td class="p-1 sm:p-2 text-right">{{ stat.kills }}</td>
                  <td class="p-1 sm:p-2 text-right">{{ stat.damage }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Chess & Programming: Winner Only -->
        <div v-else class="text-center">
          <div class="text-green-400 font-bold text-sm sm:text-base">🏆 {{ match.winner.name }}</div>
        </div>
      </div>

    </div>
  </div>
</template>
