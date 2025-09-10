import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ant from 'ant-design-vue'
import App from './App.vue'
import '@/assets/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(ant)

app.mount('#app')
