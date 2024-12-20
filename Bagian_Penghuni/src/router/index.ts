import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import RoomBooking from '../views/RoomBooking.vue';
import Payment from '@/views/Payment.vue';  
import ReportFacility from '@/views/ReportFacility.vue';
import ReportTenant from '@/views/ReportTenant.vue';
const routes = [
  { path: '/', redirect: '/login' },  
  { path: '/login', name: 'login', component: LoginForm },
  { path: '/user', name: 'Dashboard', component: Dashboard },
  { path: '/user/sewa', name: 'RoomBooking', component: RoomBooking },
  { path: '/user/sewa/bayar', name: 'Payment', component: Payment },
  { path: '/user/laporan/fasilitas', name: 'ReportFacility', component: ReportFacility },
  { path: '/user/laporan/penghuni', name: 'ReportTenant', component: ReportTenant },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
