<script setup>
import { computed } from 'vue'

const props = defineProps({
  tournament: Object
})

const defaultAvatar = '/avatars/default-avatar.svg'

const handleImageError = (event) => {
  event.target.src = defaultAvatar
}

// Calculate player stats (wins, matches played, points)
const calculatePlayerStats = (playerId, groupName) => {
  if (!props.tournament?.matches) return { wins: 0, matchesPlayed: 0, points: 0 }

  const groupMatches = props.tournament.matches.filter(m => m.group === groupName)

  let wins = 0
  let matchesPlayed = 0

  groupMatches.forEach(match => {
    // Check if player is in this match
    const isPlayer1 = match.player1?._id === playerId
    const isPlayer2 = match.player2?._id === playerId
    const isInBattleRoyale = match.players?.some(p => p._id === playerId)

    if (isPlayer1 || isPlayer2 || isInBattleRoyale) {
      // Only count if match has a winner (match is complete)
      if (match.winner) {
        matchesPlayed++
        if (match.winner._id === playerId) {
          wins++
        }
      }
    }
  })

  // 3 points per win for Table Tennis
  const points = wins * 3

  return { wins, matchesPlayed, points }
}

// Sort players by points (descending), then by wins
const sortedGroups = computed(() => {
  if (!props.tournament?.groups) return {}

  const sorted = {}

  Object.entries(props.tournament.groups).forEach(([groupName, players]) => {
    sorted[groupName] = [...players].sort((a, b) => {
      const statsA = calculatePlayerStats(a._id, groupName)
      const statsB = calculatePlayerStats(b._id, groupName)

      // Sort by points first
      if (statsB.points !== statsA.points) {
        return statsB.points - statsA.points
      }

      // If points are equal, sort by wins
      return statsB.wins - statsA.wins
    })
  })

  return sorted
})
</script>

<template>
  <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
    <div v-for="(players, groupName) in sortedGroups" :key="groupName"
         class="relative bg-gradient-to-br from-indigo-950/50 via-gray-900/80 to-gray-900/90 p-5 sm:p-7 rounded-2xl border-2 border-indigo-500/30 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 backdrop-blur-sm overflow-hidden group">

      <!-- Glow Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <h3 class="relative text-xl sm:text-2xl font-black mb-4 sm:mb-5 flex items-center gap-3 pb-3 border-b-2 border-indigo-500/30">
        <span class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white text-base sm:text-lg shadow-lg shadow-indigo-500/50 font-black">{{ groupName }}</span>
        <span class="bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text">Group {{ groupName }}</span>
      </h3>

      <div class="relative space-y-3">
        <div v-for="(player, index) in players" :key="player._id"
             :class="[
               'flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group/item',
               index === 0 ? 'bg-gradient-to-r from-yellow-900/40 via-yellow-800/30 to-amber-900/40 border-2 border-yellow-500/50 shadow-yellow-500/20' :
               index === 1 ? 'bg-gradient-to-r from-gray-800/50 via-gray-700/40 to-gray-800/50 border-2 border-gray-500/50 shadow-gray-500/20' :
               index === 2 ? 'bg-gradient-to-r from-orange-950/40 via-orange-900/30 to-orange-950/40 border-2 border-orange-700/50 shadow-orange-700/20' :
               'bg-gray-800/60 border border-gray-700/40 hover:bg-gray-700/60 hover:border-gray-600/60'
             ]"
        >
          <!-- Shimmer Effect for Top 3 -->
          <div v-if="index < 3" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></div>

          <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 relative z-10">
            <span :class="[
              'font-black w-8 sm:w-10 text-center text-sm sm:text-base',
              index === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' :
              index === 1 ? 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]' :
              index === 2 ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]' :
              'text-gray-500'
            ]">
              #{{ index + 1 }}
            </span>

            <div class="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14">
              <img :src="player.avatarUrl || defaultAvatar"
                   :alt="player.name"
                   @error="handleImageError"
                   :class="[
                     'w-full h-full rounded-full bg-gray-700 object-cover object-center transition-all duration-300',
                     index === 0 ? 'ring-4 ring-yellow-500/60 shadow-lg shadow-yellow-500/50' :
                     index === 1 ? 'ring-4 ring-gray-400/60 shadow-lg shadow-gray-400/50' :
                     index === 2 ? 'ring-4 ring-orange-500/60 shadow-lg shadow-orange-500/50' :
                     'ring-2 ring-gray-600/60'
                   ]"
              />
            </div>

            <span :class="[
              'text-sm sm:text-base font-bold truncate',
              index === 0 ? 'text-yellow-100' :
              index === 1 ? 'text-gray-100' :
              index === 2 ? 'text-orange-100' :
              'text-gray-300'
            ]">{{ player.name }}</span>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
            <!-- Matches Played -->
            <div class="flex flex-col items-center min-w-[45px] sm:min-w-[50px]">
              <span class="text-[8px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Played</span>
              <span :class="[
                'font-black text-xs sm:text-sm px-2 py-1 rounded-lg w-full text-center',
                index === 0 ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/40' :
                index === 1 ? 'bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/40' :
                index === 2 ? 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40' :
                'bg-gray-700/40 text-gray-400 ring-1 ring-gray-600/40'
              ]">
                {{ calculatePlayerStats(player._id, groupName).matchesPlayed || 'N/A' }}
              </span>
            </div>

            <!-- Wins -->
            <div class="flex flex-col items-center min-w-[45px] sm:min-w-[50px]">
              <span class="text-[8px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Wins</span>
              <span :class="[
                'font-black text-xs sm:text-sm px-2 py-1 rounded-lg w-full text-center',
                index === 0 ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/40' :
                index === 1 ? 'bg-green-500/15 text-green-300 ring-1 ring-green-500/30' :
                index === 2 ? 'bg-green-500/10 text-green-300 ring-1 ring-green-500/25' :
                'bg-gray-700/40 text-gray-400 ring-1 ring-gray-600/40'
              ]">
                {{ calculatePlayerStats(player._id, groupName).wins || 'N/A' }}
              </span>
            </div>

            <!-- Points -->
            <div class="flex flex-col items-center min-w-[45px] sm:min-w-[50px]">
              <span class="text-[8px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Points</span>
              <span :class="[
                'font-black text-xs sm:text-sm px-2 py-1 rounded-lg w-full text-center',
                index === 0 ? 'bg-yellow-500/30 text-yellow-200 ring-2 ring-yellow-500/60' :
                index === 1 ? 'bg-gray-500/30 text-gray-200 ring-2 ring-gray-500/60' :
                index === 2 ? 'bg-orange-500/30 text-orange-200 ring-2 ring-orange-500/60' :
                'bg-gray-700/50 text-gray-300 ring-2 ring-gray-600/60'
              ]">
                {{ calculatePlayerStats(player._id, groupName).points || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
</style>
