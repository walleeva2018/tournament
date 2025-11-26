<script setup>
defineProps({
  tournament: Object
})
</script>

<template>
  <div class="grid md:grid-cols-2 gap-8">
    <div v-for="(players, groupName) in tournament.groups" :key="groupName" class="bg-gray-900/50 p-4 rounded-lg">
      <h3 class="text-xl font-bold mb-4 text-blue-400">Group {{ groupName }}</h3>
      <div class="space-y-2">
        <div v-for="(player, index) in players" :key="player._id" 
             class="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-700 transition">
          <div class="flex items-center gap-3">
            <span class="text-gray-500 font-mono w-6">#{{ index + 1 }}</span>
            <img :src="player.avatarUrl" class="w-8 h-8 rounded-full bg-gray-700" />
            <span>{{ player.name }}</span>
          </div>
          <span class="font-bold text-gray-400">0 PTS</span>
        </div>
      </div>
    </div>
  </div>
</template>
