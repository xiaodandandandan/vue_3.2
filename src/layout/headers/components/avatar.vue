<template>
  <el-dropdown>
    <span class="el-dropdown-link">
        <el-avatar shape="square" :size="40" :src="squareUrl"></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">{{$t('logout.btnTitle')}}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const squareUrl = ref(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn_Ku6Uaty-Tl_521cjZhZ3HfVLOiEAHmc6A&usqp=CAU'
)
const logout = () => {
    store.dispatch('app/logout')
}
</script>

<style scoped>
::v-deep .el-dropdown-menu__item {
  white-space: nowrap;
}
</style>
