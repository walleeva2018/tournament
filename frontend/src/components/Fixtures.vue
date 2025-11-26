<script setup>
defineProps({
  tournament: Object
})

const getMatchTitle = (match) => {
  if (match.players && match.players.length > 0) {
    return 'Battle Royale';
  }
  return `${match.player1?.name} vs ${match.player2?.name}`;
}

const parseKrunkerStats = (scoreString) => {
  try {
    return JSON.parse(scoreString)
  } catch {
    return null
  }
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="match in tournament.matches" :key="match._id" 
         class="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-blue-500/50 transition-colors">
      
      <div class="flex justify-between text-xs text-gray-500 mb-2 uppercase tracking-wider">
        <span>{{ match.round }} - Group {{ match.group }}</span>
        <span :class="match.winner ? 'text-green-500' : 'text-yellow-500'">
          {{ match.winner ? 'Completed' : 'Scheduled' }}
        </span>
      </div>

      <!-- 1v1 Match -->
      <div v-if="!match.players || match.players.length === 0" class="flex justify-between items-center mb-3">
        <div class="flex flex-col items-center w-1/3">
          <img :src="match.player1?.avatarUrl" class="w-10 h-10 rounded-full mb-1 bg-gray-700" />
          <span class="text-xs text-center truncate w-full">{{ match.player1?.name }}</span>
        </div>
        <div class="text-xl font-bold text-gray-600">VS</div>
        <div class="flex flex-col items-center w-1/3">
          <img :src="match.player2?.avatarUrl" class="w-10 h-10 rounded-full mb-1 bg-gray-700" />
          <span class="text-xs text-center truncate w-full">{{ match.player2?.name }}</span>
        </div>
      </div>

      <!-- Battle Royale (Krunker) -->
      <div v-else class="mb-3">
        <div class="text-center font-bold mb-2 text-purple-400">4-Player Battle</div>
        <div class="flex flex-wrap justify-center gap-2">
          <img v-for="p in match.players" :key="p._id" :src="p.avatarUrl" :title="p.name"
               class="w-8 h-8 rounded-full border-2 border-gray-700" />
        </div>
      </div>

      <!-- Results Display -->
      <div v-if="match.winner" class="border-t border-gray-700 pt-2 mt-2">
        <!-- Table Tennis: Winner + Score -->
        <div v-if="tournament.gameName === 'Table Tennis'" class="text-center">
          <div class="text-green-400 font-bold">🏆 {{ match.winner.name }}</div>
          <div v-if="match.score" class="text-sm text-gray-400">Score: {{ match.score }}</div>
        </div>

        <!-- Krunker: Stats Table -->
        <div v-else-if="tournament.gameName === 'Krunker' && parseKrunkerStats(match.score)" class="text-xs">
          <div class="text-green-400 font-bold text-center mb-2">🏆 {{ match.winner.name }}</div>
          <table class="w-full text-left">
            <thead class="text-gray-500">
              <tr>
                <th class="pb-1">Player</th>
                <th class="pb-1 text-right">Kills</th>
                <th class="pb-1 text-right">Dmg</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in parseKrunkerStats(match.score)" :key="stat.playerId" 
                  :class="stat.playerId === match.winner._id ? 'text-green-400 font-bold' : 'text-gray-400'">
                <td class="truncate max-w-[80px]">{{ stat.playerName }}</td>
                <td class="text-right">{{ stat.kills }}</td>
                <td class="text-right">{{ stat.damage }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Chess & Programming: Winner Only -->
        <div v-else class="text-center">
          <div class="text-green-400 font-bold">🏆 {{ match.winner.name }}</div>
        </div>
      </div>

    </div>
  </div>
</template>
