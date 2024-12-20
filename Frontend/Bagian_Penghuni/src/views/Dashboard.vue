<template>
  <header class="bg-blue-500 text-white py-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center px-6">
      <h1 class="text-2xl font-bold">Sistem Pengelolaan Kos</h1>

      <nav>
        <ul class="flex space-x-6">
          <li>
            <router-link
              to="/user/sewa"
              class="hover:underline text-lg font-medium"
            >
              Penyewaan Kamar
            </router-link>
          </li>
          <li>
            <router-link
              to="/user/laporan/fasilitas"
              class="hover:underline text-lg font-medium"
            >
              Laporan Fasilitas
            </router-link>
          </li>
          <li>
            <router-link
              to="/user/laporan/penghuni"
              class="hover:underline text-lg font-medium"
            >
              Laporan Penghuni
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="mt-6">
    <div class="p-6 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold mb-6">Riwayat Pembayaran</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="payment in payments"
          :key="payment._id"
          class="bg-white shadow-md rounded-lg p-6 border border-gray-200"
        >
          <h2 class="text-xl font-semibold mb-2 text-blue-600">
            Pembayaran Rp {{ formatCurrency(payment.totalAmount) }}
          </h2>
          <p class="text-gray-600 mb-1">
            <strong>Metode:</strong> {{ payment.paymentMethod }}
          </p>
          <p class="text-gray-600 mb-1">
            <strong>Periode:</strong> {{ payment.period }}
          </p>
          <p class="text-gray-600 mb-1">
            <strong>Extra:</strong> {{ formatExtra(payment.extras) }}
          </p>
          <p class="text-gray-600 mb-1">
            <strong>Tanggal:</strong> {{ formatDate(payment.date) }}
          </p>
        </div>
      </div>
    </div>
    <router-view />
  </main>
</template>

<script>
export default {
  methods: {
    formatCurrency(amount) {
      return amount.toLocaleString('id-ID'); 
    },
    formatExtra(extras) {
      return extras.join(', '); 
    },
    formatDate(date) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      };
      return new Date(date).toLocaleString('id-ID', options); 
    }
  }
};
</script>

<script setup>
import { ref, onMounted } from 'vue';

const payments = ref([]);


const getPayments = async () => {
  try {

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda belum login!');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const username = ref(localStorage.getItem('username') || 'managementkost');
    const data = {
      username: username.value 
    };
 
    const response = await fetch('http://localhost:5000/api/payments/get-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      payments.value = await response.json();
    } else {
      alert('Gagal mengambil riwayat pembayaran');
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat mengambil riwayat pembayaran.');
  }
};


onMounted(() => {
  getPayments();
});
</script>

<style scoped>
.bg-white {
  transition: transform 0.3s, box-shadow 0.3s;
}

.bg-white:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
