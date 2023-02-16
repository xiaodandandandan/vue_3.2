import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.scss'
import SvgIcon from '@/icons'
import * as ELIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@/router/permission'
import i18n from '@/i18n'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

const app = createApp(App)
for (const iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}

SvgIcon(app)

app.use(store).use(router).use(i18n).use(VXETable).mount('#app')
