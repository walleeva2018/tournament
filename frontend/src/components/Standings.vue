<script setup>
defineProps({
  tournament: Object
})
</script>

<template>
  <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <div v-for="(players, groupName) in tournament.groups" :key="groupName"
         class="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-6 rounded-xl border border-gray-700/50 shadow-xl">
      <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-400 flex items-center gap-2">
        <span class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-600 rounded-full text-white text-sm sm:text-base">{{ groupName }}</span>
        <span>Group {{ groupName }}</span>
      </h3>
      <div class="space-y-2">
        <div v-for="(player, index) in players" :key="player._id"
             :class="['flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200',
               index === 0 ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30' :
               index === 1 ? 'bg-gradient-to-r from-gray-700/30 to-gray-600/20 border border-gray-600/30' :
               'bg-gray-800/50 hover:bg-gray-700/50']"
        >
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span :class="['font-mono w-6 sm:w-8 text-center text-xs sm:text-sm font-bold',
              index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-gray-500']">
              #{{ index + 1 }}
            </span>
            <div class="relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12">
              <img :src="player.avatarUrl" :alt="player.name"
                   class="w-full h-full rounded-full bg-gray-700 object-cover object-center ring-2 ring-gray-600" />
              <div v-if="index === 0" class="absolute -top-1 -right-1 text-lg">🥇</div>
              <div v-if="index === 1" class="absolute -top-1 -right-1 text-lg">🥈</div>
            </div>
            <span class="text-sm sm:text-base font-medium truncate">{{ player.name }}</span>
          </div>
          <span class="font-bold text-xs sm:text-sm text-gray-400 flex-shrink-0 ml-2">0 PTS</span>
        </div>
      </div>
    </div>
  </div>
</template>
