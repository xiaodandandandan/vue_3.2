<template>
  <el-card>
    <el-button type="primary" class="add" @click="handleRoleDialog()"
      >添加角色</el-button
    >
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" border>
      <el-table-column type="expand">
        <template v-slot="{ row }">
           <el-card class="card">
            <el-row>
              <el-col :span="5">
                <span class="title">一级权限</span>
              </el-col>
              <el-col :span="19">
                <el-row class="bdtop">
                  <el-col :span="6">
                    <span class="title">二级权限</span>
                  </el-col>
                  <el-col :span="18">
                    <span class="title">三级权限</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
           </el-card>
            <el-card class="card">
            <el-row
              v-for="item1 in row.children"
              :key="item1.id"
              class="row-item"
              align="middle"
              :gutter="20"
            >
                <el-col :span="5" v-if="item1.children.length !== 0">
                  <el-tag closable @close="deleteRightById(row, item1.id)">{{ item1.authName }}</el-tag>
                </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="bdtop"
                >
                  <el-col :span="6" v-if="item2.children.length !== 0">
                    <el-tag type="success" closable @close="deleteRightById(row, item2.id)" >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleteRightById(row, item3.id)"
                      class="tag-item"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" :label="$t('roles.rolename')" />
      <el-table-column prop="roleDesc" :label="$t('roles.roledesc')" />
      <el-table-column :label="$t('roles.action')">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleRoleDialog(row)"
          ></el-button>
          <el-button
            type="warning"
            :icon="Setting"
            @click="setRights(row.id)"
          ></el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="deleteRole(row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <Dialog
      v-model="dialogVisible"
      :dialogTitle="dialogTitle"
      @init="initData"
      :dialogData="dialogData"
    />
    <!--分配权限-->
    <el-dialog
      title="分配权限"
      v-model="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        highlight-current
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { GetRoleList, SearchRole, DeleteRole, SetRights, DeleteRoleByRightId } from '@/api/role'
import { getRightsTree } from '@/api/rights'
import { Edit, Delete, Setting } from '@element-plus/icons-vue'
import Dialog from './components/dialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const dialogVisible = ref(false)
const setRightDialogVisible = ref(false)
const dialogTitle = ref('')
const dialogData = ref([])
const rightsList = ref([])
const treeProps = ref({
  children: 'children',
  label: 'authName'
})
const defKeys = ref([])
const treeRef = ref(null)
const roleId = ref(0)
const initData = async () => {
  const res = await GetRoleList()
  tableData.value = res
}
initData()
const isNull = (date) => {
  if (!date) return true
  if (JSON.stringify(date) === '{}' || JSON.stringify(date) === '[]') {
    return true
  }
}
const handleRoleDialog = async (row) => {
  if (isNull(row)) {
    dialogTitle.value = '添加角色'
  } else {
    dialogTitle.value = '编辑角色'
    const res = await SearchRole(row.id)
    dialogData.value = res
  }
  dialogVisible.value = true
}

const setRights = async (id) => {
  setRightDialogVisible.value = true
  const res = await getRightsTree()
  rightsList.value = res
  roleId.value = id
}

const deleteRole = (id) => {
  ElMessageBox.confirm('确定要删除该角色吗？', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await DeleteRole(id)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      initData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const setRightDialogClosed = () => {
  setRightDialogVisible.value = false
}
const allotRights = async () => {
  const arr = [
    ...treeRef.value.getCheckedKeys(),
    ...treeRef.value.getHalfCheckedKeys()
  ]
  const rids = arr.join(',')
  console.log(rids)
  console.log(roleId.value)
  await SetRights(roleId.value, rids)
  ElMessage({
    type: 'success',
    message: '分配权限成功'
  })
  setRightDialogClosed()
  initData()
}

const deleteRightById = (role, rightId) => {
  ElMessageBox.confirm('确定要删除该权限吗？', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      const res = await DeleteRoleByRightId(role.id, rightId)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      role.children = res
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
.add {
  margin-bottom: 15px;
}
.row-item {
  margin: 0 50px;
  padding: 5px;
}
.bdtop {
  margin: 5px 5px;
}
.tag-item {
  margin: 0 5px;
}
.title {
  margin: 10px;
}
.card {
  margin: 0 auto;
  width: 98%;
}
</style>
