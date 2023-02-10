<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="variables.menuBg"
    class="el-menu-vertical-demo"
    :default-active="$route.path"
    text-color="#fff"
    router
    unique-opened
    :collapse="!$store.getters.siderType"
  >
    <el-sub-menu
      :index="item.id"
      v-for="(item, index) in menusList"
      :key="item.id"
    >
      <template #title>
        <el-icon>
          <component :is="iconList[index]"></component>
        </el-icon>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item
        v-for="it in item.children"
        :key="it.id"
        :index="'/' + it.path"
        @click="savePath(it.path)"
      >
        <el-icon>
          <component :is="icon"></component>
        </el-icon>
        <span>{{ $t(`menus.${it.path}`) }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { menuList } from '@/api/menu'
import { ref } from 'vue'

const iconList = ref(['user', 'setting', 'shop', 'tickets', 'pie-chart'])
const icon = ref('menu')
// const defaultActive = ref(sessionStorage.getItem('path') || '/users')
const menusList = ref([])
const initMenusList = async () => {
  menusList.value = await menuList()
}
initMenusList()
const savePath = (path) => {
  sessionStorage.setItem('path', `/${path}`)
}
</script>

<style scoped></style>
