<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Simpan token di localStorage
      localStorage.setItem('username', data.username);
      alert('Login berhasil!');
      router.push('/user'); // Arahkan pengguna ke dashboard
    } else {
      const errorData = await response.json();
      alert(`Gagal login: ${errorData.error}`);
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat login.');
  }
};
</script>
