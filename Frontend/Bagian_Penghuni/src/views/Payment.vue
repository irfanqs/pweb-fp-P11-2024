<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <div class="flex"> 
      <h1 class="text-3xl font-bold mb-4 mr-96">Pembayaran</h1>
      <router-link to="/user/sewa" class=" mb-10 bg-red-500 text-white py-2 px-4 ml-auto rounded-lg text-center hover:bg-red-600">
            Kembali
      </router-link>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-medium mb-2">Total Pembayaran</h2>
      <p class="text-lg">Jumlah yang harus dibayar: Rp {{ formatCurrency(totalPayment) }}</p>

      <div class="mt-6">
        <label for="method" class="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
        <select v-model="paymentMethod" id="method" class="mt-1 block w-full border-gray-300 rounded-lg">
          <option value="QRIS">QRIS</option>
          <option value="Transfer Bank">Transfer Bank</option>
        </select>
      </div>

      <div v-if="paymentMethod === 'Transfer Bank'" class="mt-6">
        <label for="bank" class="block text-sm font-medium text-gray-700">Nama Bank</label>
        <input v-model="bankName" id="bank" type="text" placeholder="Masukkan nama bank" class="mt-1 block w-full border-gray-300 rounded-lg" />
      </div>

      <div class="mt-6">
        <button @click="submitPayment" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Bayar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    formatCurrency(amount) {
      const num = Number(amount);
      return num.toLocaleString('id-ID'); 
    },
  },
}
</script>

<script setup>
import router from '@/router';
import { ref } from 'vue';


const totalPayment = ref(localStorage.getItem('totalPayment') || 0);
const selectedPeriod = ref(localStorage.getItem('selectedPeriod') || 3); 
const extras = ref(JSON.parse(localStorage.getItem('extras')) || []); 
const username = ref(localStorage.getItem('username') || "managementkost");
const paymentMethod = ref('');
const bankName = ref('');

const submitPayment = async () => {
  if (paymentMethod.value == 'Transfer Bank' && !bankName.value) {
    alert('Harap masukkan nama bank.');
    return;
  }

  const data = {
    period: selectedPeriod.value,
    totalAmount: totalPayment.value,
    extras: extras.value,
    paymentMethod: paymentMethod.value,
    bankName: paymentMethod.value == 'Transfer Bank' ? bankName.value : null,
    username: username.value, 
  };

  const response = await fetch('http://localhost:5000/api/payments/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const responseData = await response.json(); 
    const invoice = await responseData.invoice;
    alert('Pembayaran berhasil!');

    

    if (invoice) {
      try {
    
        const byteCharacters = atob(invoice); 


        const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = username.value + '_invoice.pdf'; 
        link.click();


        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error saat mendekode Base64:', error);
        alert('Terjadi kesalahan saat mendekode invoice.');
      }
    }
  } else {
    alert('Pembayaran gagal!');
  }
  window.location.href = '/user';

};
</script>
