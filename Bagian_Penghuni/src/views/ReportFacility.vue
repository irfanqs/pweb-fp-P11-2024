<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex"> 
      <h1 class="text-3xl font-bold mb-4 mr-96">Laporan Kerusakan Fasilitas</h1>
      <router-link to="/user" class="mb-10 bg-red-500 text-white py-2 px-4 ml-auto rounded-lg text-center hover:bg-red-600">
        Kembali
      </router-link>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="submitReport">
        <textarea
          v-model="report"
          placeholder="Deskripsikan kerusakan..."
          class="w-full border-gray-300 rounded-lg p-4"
          rows="5"
          required
        ></textarea>
        <button type="submit" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Kirim Laporan
        </button>
      </form>

      <div v-if="errorMessage" class="alert alert-error mb-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded-lg">
        <strong>Error!</strong> {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success mb-4 p-4 border border-green-500 bg-green-100 text-green-700 rounded-lg">
        <strong>Success!</strong> {{ successMessage }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 

const report = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter(); // Initialize router

const submitReport = async () => {
  try {
    const username = ref(localStorage.getItem('username') || "managementkost"); 
    const response = await fetch('http://localhost:5000/api/reports/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        type: 'fasilitas',
        description: report.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Gagal mengirim laporan. Coba lagi.');
    }

    successMessage.value = 'Laporan berhasil dikirim!';
    errorMessage.value = '';
    report.value = '';

    setTimeout(() => {
      router.push('/user'); 
    }, 5000);
  } catch (error) {
    errorMessage.value = error.message || 'Terjadi kesalahan saat mengirim laporan.';
    successMessage.value = '';
    console.error(error);

    setTimeout(() => {
      router.push('/user'); 
    }, 5000);
  }
};
</script>
