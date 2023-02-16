<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          :placeholder="$t('table.placeholder')"
          clearable
          v-model="queryform.query"
          @clear="initTableData"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initTableData">{{
        $t('table.search')
      }}</el-button>
      <el-button type="primary" @click="handleDialog()">{{
        $t('table.adduser')
      }}</el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        :prop="item.prop"
        :label="$t(`table.${item.label}`)"
        :width="item.width"
        v-for="item in options"
        :key="item.id"
      >
        <template v-slot="{ row }" v-if="item.prop === 'mg_state'">
          <el-switch v-model="row.mg_state" @change="changeState(row)" />
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'create_time'">
          {{ filter(row.create_time) }}
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="handleDialog(row)"
          >编辑用户</el-button>
          <el-button
            type="warning"
            size="small"
            :icon="Setting"
            @click="handleRoleDialog(row)"
          >分配角色</el-button>
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="deleteUserInfo(row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queryform.pagenum"
      v-model:page-size="queryform.pagesize"
      :page-sizes="[2, 5, 10]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加编辑对话框 -->
    <Dialog
      v-model="dialogFormVisible"
      :dialogTitle="dialogTitle"
      @init="initTableData"
      :dialogFormData="dialogFormData"
    />
    <!-- 分配角色对话框 -->
    <el-dialog
      v-model="setRoleDialogVisible"
      title="分配角色"
      width="40%"
      placement="right-end"
      @close="handleRoleDialogClose"
    >
      <div>
        <p class="item">当前的用户：{{ userInfo.username }}</p>
        <p class="item">当前的角色：{{ userInfo.role_name }}</p>
        <p class="item">
          分配新角色：<el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="setRoleInfo"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { getUserData, changeUserState, deleteUser, setUserRole } from '@/api/user'
import { GetRoleList } from '@/api/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { options } from './options'
import { Edit, Search, Delete, Setting } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import Dialog from './components/dialog.vue'

const i18n = useI18n()
const dayjs = require('dayjs')
const dialogFormVisible = ref(false)
const dialogTitle = ref('')
const dialogFormData = ref({})
const setRoleDialogVisible = ref(false)
const userInfo = ref({})
const selectedRoleId = ref('')
const roleList = ref([])
const queryform = ref({
  query: '',
  pagenum: 1,
  pagesize: 10
})
const tableData = ref([])
const total = ref(0)

const handleDialog = (row) => {
  if (isNull(row)) {
    dialogTitle.value = i18n.t('dialog.adduser')
  } else {
    dialogTitle.value = i18n.t('dialog.edituser')
    dialogFormData.value = JSON.parse(JSON.stringify(row))
  }
  dialogFormVisible.value = true
}
const filter = (val, format = 'YYYY-MM-DD') => {
  if (!isNull(val)) {
    val = parseInt(val) * 1000
    return dayjs(val).format(format)
  } else {
    return '--'
  }
}
const isNull = (date) => {
  if (!date) return true
  if (JSON.stringify(date) === '{}' || JSON.stringify(date) === '[]') {
    return true
  }
}

const initTableData = async () => {
  const res = await getUserData(queryform.value)
  total.value = res.total
  tableData.value = res.users
}
initTableData()
const handleRoleDialog = async (row) => {
  const res = await GetRoleList()
  roleList.value = res
  setRoleDialogVisible.value = true
  userInfo.value = JSON.parse(JSON.stringify(row))
}
const handleSizeChange = (pageSize) => {
  queryform.value.pagenum = 1
  queryform.value.pagesize = pageSize
  initTableData()
}

const handleCurrentChange = (pagenum) => {
  queryform.value.pagenum = pagenum
  initTableData()
}

const changeState = async (info) => {
  await changeUserState(info.id, info.mg_state)
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success'
  })
}

const deleteUserInfo = (id) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(id)
      initTableData()
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
const handleRoleDialogClose = () => {
  setRoleDialogVisible.value = false
}
const setRoleInfo = async () => {
  if (!selectedRoleId.value) {
    ElMessage.error('请选择角色')
  } else {
    await setUserRole(userInfo.value.id, selectedRoleId.value)
    setRoleDialogVisible.value = false
    initTableData()
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}
::v-deep .el-pagination {
  float: right;
  padding: 16px 5px;
}
.item {
  margin-top: 15px;
}
</style>
