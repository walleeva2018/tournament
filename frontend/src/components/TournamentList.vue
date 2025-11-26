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
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="container mx-auto px-4 py-6 sm:py-10 max-w-7xl relative z-10">
      <!-- Header -->
      <div class="text-center mb-10 sm:mb-16 animate-slide-down">
        <div class="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
          <span class="text-purple-300 text-xs sm:text-sm font-semibold tracking-wider uppercase">Live Tournament System</span>
        </div>
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-black mb-3 sm:mb-5 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-2xl tracking-tight">
          Tournament Arena
        </h1>
        <p class="text-gray-300 text-base sm:text-lg font-medium">Real-time match tracking & player standings</p>
        <div class="mt-6 flex justify-center gap-2">
          <div class="h-2 w-2 bg-green-500 rounded-full animate-ping"></div>
          <span class="text-green-400 text-sm font-semibold">Live Now</span>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative">
          <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
          <div class="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
        </div>
        <p class="text-gray-300 text-xl font-semibold mt-6 animate-pulse">Loading tournaments...</p>
      </div>

      <div v-else-if="tournaments.length === 0" class="text-center py-24 bg-red-950/30 backdrop-blur-sm rounded-3xl border border-red-500/30">
        <div class="text-7xl mb-6 animate-bounce">⚠️</div>
        <p class="text-2xl text-red-300 mb-3 font-bold">No tournaments found</p>
        <p class="text-gray-400 text-lg">Please check backend connection</p>
      </div>

      <div v-else>
        <!-- Tournament Tabs -->
        <div class="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 overflow-x-auto pb-3 px-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
          <button
            v-for="t in tournaments"
            :key="t._id"
            @click="selectedTournament = t"
            :class="[
              'relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap text-sm sm:text-base group overflow-hidden',
              selectedTournament?._id === t._id
                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white scale-110 shadow-2xl shadow-purple-500/50'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:scale-105 backdrop-blur-sm border border-gray-700/50'
            ]"
          >
            <span class="relative z-10">{{ t.gameName }}</span>
            <div v-if="selectedTournament?._id === t._id" class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur-xl"></div>
          </button>
        </div>

        <!-- Selected Tournament View -->
        <div v-if="selectedTournament" class="space-y-8 sm:space-y-10 animate-fade-in">

          <!-- Standings -->
          <section class="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-yellow-500/20 overflow-hidden group hover:border-yellow-500/40 transition-all duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h2 class="relative text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 pb-4 border-b-2 border-gray-700/50 flex items-center gap-3 sm:gap-4">
              <span class="text-3xl sm:text-4xl animate-bounce">🏆</span>
              <span class="bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 text-transparent bg-clip-text">Standings</span>
            </h2>
            <Standings :tournament="selectedTournament" />
          </section>

          <!-- Fixtures -->
          <section class="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-green-500/20 overflow-hidden group hover:border-green-500/40 transition-all duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h2 class="relative text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 pb-4 border-b-2 border-gray-700/50 flex items-center gap-3 sm:gap-4">
              <span class="text-3xl sm:text-4xl animate-pulse">📅</span>
              <span class="bg-gradient-to-r from-green-300 via-emerald-400 to-blue-400 text-transparent bg-clip-text">Fixtures</span>
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
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-down {
  animation: slideDown 0.8s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

.delay-1000 {
  animation-delay: 1s;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #9333ea;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a855f7;
}
</style>
