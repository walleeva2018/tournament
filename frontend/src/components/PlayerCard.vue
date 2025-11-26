<script setup>
defineProps({
  player: Object
})
</script>

<template>
  <div class="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
    <img :src="player.avatarUrl" :alt="player.name" class="w-16 h-16 rounded-full mb-2 bg-gray-600" />
    <span class="text-sm font-medium text-white text-center">{{ player.name }}</span>
  </div>
</template>
