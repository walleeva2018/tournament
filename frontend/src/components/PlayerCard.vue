<script setup>
defineProps({
  player: Object
})
</script>

<template>
  <div class="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
    <div class="w-16 h-16 overflow-hidden rounded-full mb-2 flex-shrink-0">
      <img :src="player.avatarUrl" :alt="player.name" class="w-full h-full bg-gray-600 object-cover object-center rounded-full" />
    </div>
    <span class="text-sm font-medium text-white text-center">{{ player.name }}</span>
  </div>
</template>
