<template>
  <el-card>
    <el-row
      ><el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
    /></el-row>
    <el-row class="cat_opt">
      <el-col>
        <span>选择商品分类：</span>
        <el-cascader
          v-model="selectedKeys"
          :options="cascaderOptions"
          :props="cascaderProps"
          @change="handleChange"
          clearable
        />
      </el-col>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-button
              type="primary"
              :disabled="isBtnDisabled"
              style="margin-bottom: 15px"
              @click="addAttrDialogVisible = true"
              >添加参数</el-button
            >
          </el-row>
          <el-table :data="manyTableData" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                {{ row }}
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              :resizable="false"
            ></el-table-column>
            <el-table-column label="操作" :resizable="false">
              <template v-slot="{ row }">
                <!-- 编辑按键 -->
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="medium"
                  @click="showEditDiolog(row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除按键 -->
                <el-button
                  type="danger"
                  :icon="Delete"
                  size="medium"
                  @click="deleteParamsById(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-button
              type="primary"
              :disabled="isBtnDisabled"
              style="margin-bottom: 15px"
              @click="addAttrDialogVisible = true"
              >添加属性</el-button
            >
          </el-row>
          <el-table :data="onlyTableData">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                {{ row }}
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              :resizable="false"
            ></el-table-column>
            <el-table-column label="操作" :resizable="false">
              <template v-slot="shuju">
                <!-- 编辑按键 -->
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="medium"
                  @click="showEditDiolog(shuju.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除按键 -->
                <el-button
                  type="danger"
                  :icon="Delete"
                  size="medium"
                  @click="deleteParamsById(shuju.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加参数属性对话框-->
        <el-dialog
          v-model="addAttrDialogVisible"
          :title="titleText"
          @close="handleAttrDialogclose"
          width="50%"
        >
          <!-- 添加参数的表单 -->
          <el-form v-model="attrForm" :rules="addFormRules" ref="formRef">
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="attrForm.attr_name" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="handleAttrDialogclose">Cancel</el-button>
              <el-button type="primary" @click="addAttr"> Confirm </el-button>
            </span>
          </template>
        </el-dialog>
        <!--修改参数属性对话框-->
        <el-dialog
          v-model="editAttrDialogVisible"
          :title="titleText"
          @close="editAttrDialogclose"
          width="50%"
        >
          <!-- 修改参数的表单 -->
          <el-form v-model="editAttrForm" :rules="editFormRules" ref="formRef">
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editAttrForm.attr_name" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editAttrDialogclose">Cancel</el-button>
              <el-button type="primary" @click="editAttr"> Confirm </el-button>
            </span>
          </template>
        </el-dialog>
      </el-tabs>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import {
  GetGoodsCateList,
  GetParamsList,
  AddParams,
  searchParams,
  editParams,
  DeleteParams
} from '@/api/goods'
import { ElMessage, ElMessageBox } from 'element-plus'
const activeName = ref('many')
const manyTableData = ref()
const onlyTableData = ref()
const cascaderOptions = ref([])
const cascaderProps = ref({
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  expandTrigger: 'hover'
})
const attrForm = ref({
  attr_name: '',
  attr_sel: '',
  attr_vals: ''
})
const addFormRules = ref({
  attr_name: [{ required: true, message: '请输入参数！', trigger: 'blur' }]
})

const getCateList = async () => {
  const res = await GetGoodsCateList()
  cascaderOptions.value = res
}
getCateList()

const selectedKeys = ref([])
const id = ref(0)
const getParamsList = async () => {
  if (activeName.value === 'many') {
    const many = await GetParamsList(id.value, { sel: 'many' })
    manyTableData.value = many
  } else {
    const only = await GetParamsList(id.value, { sel: 'only' })
    onlyTableData.value = only
  }
}
const handleChange = async () => {
  if (selectedKeys.value !== null && selectedKeys.value.length === 3) {
    id.value = selectedKeys.value[selectedKeys.value.length - 1]
    getParamsList()
  } else {
    onlyTableData.value = []
    manyTableData.value = []
  }
}
const isBtnDisabled = computed(() => {
  if (selectedKeys.value !== null && selectedKeys.value.length === 3) {
    return false
  } else return true
})
const handleTabClick = async () => {
  getParamsList()
}
const addAttrDialogVisible = ref(false)
const handleAttrDialogclose = () => {
  addAttrDialogVisible.value = false
  attrForm.value.attr_name = ''
}

const titleText = computed(() => {
  if (activeName.value === 'many') {
    return '添加参数'
  } else {
    return '添加属性'
  }
})

const addAttr = async () => {
  if (attrForm.value.attr_name !== '') {
    if (activeName.value === 'many') {
      attrForm.value.attr_sel = 'many'
      await AddParams(id.value, attrForm.value)
      getParamsList()
    } else {
      attrForm.value.attr_sel = 'only'
      await AddParams(id.value, attrForm.value)
      getParamsList()
    }
    handleAttrDialogclose()
  } else {
    ElMessage.error('属性值不能为空！')
  }
}

const editAttrForm = ref({
  attr_name: '',
  attr_sel: '',
  attr_vals: ''
})
const editFormRules = ref({
  attr_name: [{ required: true, message: '请输入参数！', trigger: 'blur' }]
})
const editAttrDialogVisible = ref(false)
const attrId = ref(0)
const showEditDiolog = async (attrid) => {
  const res = await searchParams(id.value, attrid, {
    attr_sel: activeName.value
  })
  attrId.value = attrid
  editAttrForm.value.attr_name = res.attr_name
  editAttrForm.value.attr_sel = res.attr_sel
  editAttrForm.value.attr_vals = res.attr_vals
  editAttrDialogVisible.value = true
}
const editAttrDialogclose = () => {
  editAttrDialogVisible.value = false
}
const formRef = ref(null)
const editAttr = async () => {
  if (editAttrForm.value.attr_name !== '') {
    console.log(id.value)
    await editParams(id.value, attrId.value, editAttrForm.value)
  } else {
    ElMessage.error('属性值不能为空！')
  }
  getParamsList()
  editAttrDialogclose()
}

const deleteParamsById = (attrid) => {
  ElMessageBox.confirm('确定要删除该属性（参数）吗？', 'Waring', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
      await DeleteParams(id.value, attrid)
      getParamsList()
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
  }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
</script>

<style lang="scss" scoped>
.cat_opt {
  margin-top: 20px;
}
.el-cascader {
  width: 300px;
}
.el-tabs {
  margin-top: 20px;
  width: 100%;
}
</style>
