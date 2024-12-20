<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex">
      <h1 class="text-3xl font-bold mb-4 mr-96">Penyewaan Kamar</h1>
      <router-link to="/user" class="block mb-10 bg-red-500 text-white py-2 px-4 ml-auto rounded-lg text-center hover:bg-red-600">
        Kembali
      </router-link>
    </div>
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-medium mb-2">Spesifikasi Kamar</h2>
      <p>Luas: 4x5 meter</p>
      <p>Fasilitas: TV, meja belajar, kursi belajar, tempat tidur ukuran queen, dll.</p>

      <div class="mt-6">
        <label for="period" class="block text-sm font-medium text-gray-700">Pilih Periode Sewa</label>
        <select v-model="selectedPeriod" id="period" class="mt-1 block w-full border-gray-300 rounded-lg">
          <option value="3">3 Bulan - Rp 6.000.000</option>
          <option value="6">6 Bulan - Rp 12.000.000</option>
        </select>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-medium">Fitur Tambahan</h3>
        <div class="flex items-center mb-2">
          <input type="checkbox" id="laundry" value="600000" v-model="extras" @change="updateExtras($event)" />
          <label for="laundry" class="ml-2">Laundry (Rp 600.000/3 bulan)</label>
        </div>
        <div class="flex items-center mb-2">
          <input type="checkbox" id="cleaning" value="300000" v-model="extras" @change="updateExtras($event)" />
          <label for="cleaning" class="ml-2">Cleaning Service (Rp 300.000/3 bulan)</label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="catering" value="3000000" v-model="extras" @change="updateExtras($event)" />
          <label for="catering" class="ml-2">Catering (Rp 3.000.000/3 bulan)</label>
        </div>
      </div>

      <div class="mt-6">
        <button @click="calculateTotal" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Hitung Total Biaya
        </button>
      </div>

      <div v-if="isCalculated" class="mt-4">
        <h2 class="text-lg font-medium">Total: Rp {{ total.toLocaleString() }}</h2>
        <router-link to="/user/sewa/bayar" class="block mt-4 bg-green-500 text-white py-2 px-4 rounded-lg text-center hover:bg-green-600">
          Lanjutkan ke Pembayaran
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const selectedPeriod = ref(3);
const extras = ref([]);
const gokil = ref([]);
const total = ref(0);
const isCalculated = ref(false); // Melacak apakah total sudah dihitung

const updateExtras = (event) => {
  const checkboxId = event.target.id;

  if (event.target.checked) {
    gokil.value.push(checkboxId);
  } else {
    gokil.value = gokil.value.filter((id) => id !== checkboxId);
  }

  // Reset perhitungan jika ada perubahan
  isCalculated.value = false;
};

const calculateTotal = () => {
  const basePrice = selectedPeriod.value == 3 ? 6000000 : 12000000;
  const extraPrice = extras.value.reduce((sum, price) => sum + parseInt(price), 0);
  total.value = basePrice + extraPrice;

  // Simpan total dan set isCalculated ke true
  localStorage.setItem('totalPayment', total.value);
  localStorage.setItem('selectedPeriod', selectedPeriod.value);
  localStorage.setItem('extras', JSON.stringify(gokil.value));

  isCalculated.value = true;
};

// Reset tombol pembayaran jika ada perubahan pada selectedPeriod atau extras
watch([selectedPeriod, extras], () => {
  isCalculated.value = false;
});
</script>
