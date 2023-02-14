<template>
  <el-card>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column type="index" />
    <el-table-column prop="authName" :label="$t('rights.rightname')" width="450" />
    <el-table-column prop="path" :label="$t('rights.rightpath')" width="450" />
    <el-table-column prop="level" :label="$t('rights.rightlevel')" >
      <template v-slot="{ row }">
        <el-tag v-if="row.level === '0'">{{ $t('rights.level1') }}</el-tag>
        <el-tag class="ml-2" type="success" v-else-if="row.level === '1'">{{ $t('rights.level2') }}</el-tag>
        <el-tag class="ml-2" type="warning" v-else-if="row.level === '2'">{{ $t('rights.level3') }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { getRightsList } from '@/api/rights'
const tableData = ref([])
const initRightList = async () => {
  const res = await getRightsList()
  tableData.value = res
}
initRightList()
</script>

<style lang="scss" scoped></style>
