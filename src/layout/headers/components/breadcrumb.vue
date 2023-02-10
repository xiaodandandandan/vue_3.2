<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item,index) in BreadCrumbList" :key="index">
    <span v-if="index === BreadCrumbList.length - 1" class="no-redirect"> {{ $t(`menus.${item.name}`) }}</span>
    <span v-else class="redirect" @click="handleRedirect(item.path)"> {{  $t(`menus.${item.name}`) }}</span>
</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const BreadCrumbList = ref([])
const initBreadCrumbList = () => {
    BreadCrumbList.value = route.matched
}

const handleRedirect = (path) => {
    router.push(path)
}

watch(
    route,
    () => {
        initBreadCrumbList()
    },
    { deep: true, immediate: true }
)

</script>

<style scoped lang="scss">
.no-redirect{
    color: #97a8be;
    cursor: text;
}
.redirect{
    color: #97a8be;
    font-weight: 600;
    cursor: pointer;
    &:hover{
        color: $menuBg;
    }
}
</style>
