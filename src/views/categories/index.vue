<template>
  <el-card>
    <el-button type="primary" style="margin: 10px 0" @click="handleCateDialog"
      >添加分类</el-button
    >
    <vxe-table
      :data="treeArr"
      border
      :tree-config="treeConfig"
      :column-config="{ resizable: true }"
    >
      <vxe-column type="seq" title="Seq" width="80"></vxe-column>
      <vxe-column field="cat_name" title="分类名称" tree-node></vxe-column>
      <vxe-column field="cat_deleted" title="是否有效">
        <template v-slot="{ row }">
          <el-icon v-if="!row.cat_deleted" style="color: rgb(9, 189, 180)"
            ><CircleCheckFilled
          /></el-icon>
          <el-icon v-else style="color: rgb(216, 69, 69)"
            ><CircleCloseFilled
          /></el-icon>
        </template>
      </vxe-column>
      <vxe-column field="cat_level" title="排序">
        <template v-slot="{ row }">
          <el-tag v-if="row.cat_level === 0">一级</el-tag>
          <el-tag class="ml-2" type="success" v-else-if="row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag class="ml-2" type="warning" v-else>三级</el-tag>
        </template>
      </vxe-column>
      <vxe-column title="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            @click="EditCateDialog(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            @click="deleteCate(row.cat_id)"
            >删除</el-button
          >
        </template>
      </vxe-column>
    </vxe-table>
    <!--分页-->
    <el-pagination
      v-model:current-page="queryForm.pagenum"
      v-model:page-size="queryForm.pagesize"
      :page-sizes="[2, 5, 10]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--添加商品分类-->
    <el-dialog
      v-model="AddCateDialogVisible"
      title="添加分类"
      width="40%"
      placement="right-end"
      @close="handleCateDialogClosed"
    >
      <el-form v-model="addCateForm" :rules="addFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" />
        </el-form-item>
        <el-form-item label="父级分类" style="margin: 0 0 0 10px">
          <el-cascader
            v-model="selectedKeys"
            :size="large"
            :options="cascaderOptions"
            @change="parentCateChange"
            :props="cascaderProps"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddCateDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addCate"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
    <!--编辑商品分类-->
    <el-dialog
      v-model="EditCateDialogVisible"
      title="编辑分类名称"
      width="40%"
      placement="right-end"
      @close="handleEditDialogClosed"
    >
      <el-form v-model="editCateForm" :rules="addFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="EditCateDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="editCate"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { GetGoodsCateList, DeleteCate, AddCate, SearchCate, EditCate } from '@/api/goods'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const treeArr = ref([])
const total = ref(0)
const queryForm = ref({
  type: 3,
  pagenum: 1,
  pagesize: 5
})
const addCateForm = ref({
  // 将要添加分类的名称
  cat_name: '',
  // 父级分类的ID
  cat_pid: 0,
  // 分类的层级，默认要添加的是1级分类
  cat_level: 0
})
const addFormRules = ref({
  // 验证规则
  cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
})
const cascaderOptions = ref([])
const AddCateDialogVisible = ref(false)
const cascaderProps = ref({
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  checkStrictly: true
})
const selectedKeys = ref([])

const EditCateDialogVisible = ref(false)
const editCateForm = ref({
  // 将要编辑分类的名称
  cat_name: '',
  cat_id: 0
})
const initData = async () => {
  const res = await GetGoodsCateList(queryForm.value)
  // console.log(res)
  tableData.value = res.result
  total.value = res.total
  treeArr.value = treeToArr(tableData.value)
}
initData()
// 树形数据扁平化
const treeToArr = (data) => {
  return data.reduce((arr, cur) => {
    const { children, ...res } = cur
    if (children && children.length) {
      return arr.concat(res, treeToArr(children))
    } else {
      return arr.concat(res)
    }
  }, [])
}
const treeConfig = ref({
  transform: true,
  rowField: 'cat_id',
  parentField: 'cat_pid',
  iconOpen: 'vxe-icon-square-minus',
  iconClose: 'vxe-icon-square-plus'
})
const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  initData()
}
const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initData()
}
const deleteCate = async (id) => {
  console.log(id)
  ElMessageBox.confirm('确定要删除该分类吗？', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await DeleteCate(id)
      initData()
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
const handleCateDialog = async () => {
  const res = await GetGoodsCateList({ type: 2 })
  console.log(res)
  cascaderOptions.value = res
  AddCateDialogVisible.value = true
}
const handleCateDialogClosed = () => {
  AddCateDialogVisible.value = false
  selectedKeys.value = []
  addCateForm.value.cat_name = ''
  addCateForm.value.cat_level = 0
  addCateForm.value.cat_pid = 0
}
const parentCateChange = () => {
  // 如果 selectedKeys 数组中的 length 大于0，证明有父级分类
  // 反之，则说明没有父级分类
  if (selectedKeys.value.length > 0) {
    addCateForm.value.cat_pid =
      selectedKeys.value[selectedKeys.value.length - 1]
    addCateForm.value.cat_level = selectedKeys.value.length
    // console.log(addCateForm.value)
  } else {
    addCateForm.value.cat_pid = 0
    addCateForm.value.cat_level = 0
  }
}
const addCate = async () => {
  if (addCateForm.value.cat_name === '') {
    ElMessage.error('请填写分类名称')
  } else {
    await AddCate(addCateForm.value)
    ElMessage({
      message: '添加成功！',
      type: 'success'
    })
    initData()
    handleCateDialogClosed()
  }
}
const EditCateDialog = async (row) => {
  const res = await SearchCate(row.cat_id)
  editCateForm.value.cat_name = res.cat_name
  editCateForm.value.cat_id = row.cat_id
  EditCateDialogVisible.value = true
}
const handleEditDialogClosed = () => {
  EditCateDialogVisible.value = false
  editCateForm.value.cat_name = ''
  editCateForm.value.cat_id = 0
}
const editCate = async () => {
  console.log(editCateForm.value)
  if (editCateForm.value.cat_name === '') {
    ElMessage.error('请填写分类名称')
  } else {
    await EditCate(editCateForm.value.cat_id, editCateForm.value.cat_name)
    ElMessage({
      message: '更新成功！',
      type: 'success'
    })
    initData()
    handleEditDialogClosed()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-pagination {
  float: right;
  padding: 16px 5px;
}
::v-deep .el-cascader {
  width: 100%;
}
</style>
