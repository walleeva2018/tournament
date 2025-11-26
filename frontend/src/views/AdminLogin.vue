<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const error = ref('')
const router = useRouter()

const login = () => {
  if (password.value === 'hulk#1497') {
    localStorage.setItem('adminAuthenticated', 'true')
    router.push('/admin/dashboard')
  } else {
    error.value = 'Invalid password'
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter admin password"
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>
