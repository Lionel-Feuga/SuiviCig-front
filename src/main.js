import { registerPlugins } from '@/plugins'

import App from './App.vue'
import './assets/main.css';
import './assets/allGoalsCalendar.css'
import './assets/goalsCalendar.css'
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
