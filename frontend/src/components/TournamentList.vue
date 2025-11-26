<script setup>
import { ref, onMounted } from 'vue'
import Standings from './Standings.vue'
import Fixtures from './Fixtures.vue'

const tournaments = ref([])
const loading = ref(true)
const selectedTournament = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/tournaments')
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
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
      Tournament Hub
    </h1>

    <div v-if="loading" class="text-center text-xl animate-pulse">Loading tournaments...</div>

    <div v-else-if="tournaments.length === 0" class="text-center text-xl text-red-400">
      No tournaments found. Please check backend connection.
    </div>

    <div v-else>
      <!-- Tournament Tabs -->
      <div class="flex justify-center gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          v-for="t in tournaments" 
          :key="t._id"
          @click="selectedTournament = t"
          :class="['px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap', 
            selectedTournament?._id === t._id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']"
        >
          {{ t.gameName }}
        </button>
      </div>

      <!-- Selected Tournament View -->
      <div v-if="selectedTournament" class="space-y-8 animate-fade-in">
        
        <!-- Standings -->
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 class="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <span>🏆</span> Standings
          </h2>
          <Standings :tournament="selectedTournament" />
        </section>

        <!-- Fixtures -->
        <section class="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 class="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <span>📅</span> Fixtures
          </h2>
          <Fixtures :tournament="selectedTournament" />
        </section>

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
