<script setup>
import { ref, onMounted } from 'vue'
import Standings from './Standings.vue'
import Fixtures from './Fixtures.vue'

const tournaments = ref([])
const loading = ref(true)
const selectedTournament = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('https://tournament-topaz.vercel.app/api/tournaments')
    tournaments.value = await res.json()
    if (tournaments.value.length > 0) {
      selectedTournament.value = tournaments.value[0]
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Tournament Hub
        </h1>
        <p class="text-gray-400 text-sm sm:text-base">Track live matches and standings</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p class="text-gray-400 text-lg">Loading tournaments...</p>
      </div>

      <div v-else-if="tournaments.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-xl text-red-400 mb-2">No tournaments found</p>
        <p class="text-gray-500">Please check backend connection</p>
      </div>

      <div v-else>
        <!-- Tournament Tabs -->
        <div class="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 overflow-x-auto pb-2 px-2 scrollbar-hide">
          <button
            v-for="t in tournaments"
            :key="t._id"
            @click="selectedTournament = t"
            :class="['px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all whitespace-nowrap text-sm sm:text-base shadow-lg',
              selectedTournament?._id === t._id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105 shadow-blue-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105']"
          >
            {{ t.gameName }}
          </button>
        </div>

        <!-- Selected Tournament View -->
        <div v-if="selectedTournament" class="space-y-6 sm:space-y-8 animate-fade-in">

          <!-- Standings -->
          <section class="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 pb-3 border-b border-gray-700/50 flex items-center gap-2 sm:gap-3">
              <span class="text-2xl sm:text-3xl">🏆</span>
              <span class="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Standings</span>
            </h2>
            <Standings :tournament="selectedTournament" />
          </section>

          <!-- Fixtures -->
          <section class="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 pb-3 border-b border-gray-700/50 flex items-center gap-2 sm:gap-3">
              <span class="text-2xl sm:text-3xl">📅</span>
              <span class="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">Fixtures</span>
            </h2>
            <Fixtures :tournament="selectedTournament" />
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
