import { createApp } from 'vue';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import App from './App.vue';
import '../index.css';

const app=createApp(App)

app.component('Loading', Loading);

app.mount('#app')

