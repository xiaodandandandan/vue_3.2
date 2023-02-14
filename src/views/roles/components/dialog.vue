<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="dialogTitle"
    width="30%"
    :before-close="handleClose"
  >
    <el-form v-model="form" :rules="rules">
      <el-form-item :label="$t('roles.rolename')" :label-width="formLabelWidth">
        <el-input v-model="form.roleName" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="$t('roles.roledesc')" :label-width="formLabelWidth">
        <el-input v-model="form.roleDesc" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { AddRole, EditRole } from '@/api/role'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogData: {
    type: Object,
    default: () => {}
  }
})
const form = ref({
  roleName: '',
  roleDesc: ''
})
const rules = ref({
  rolename: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur'
    }
  ],
  roledesc: [
    {
      required: false,
      message: '请输入角色描述',
      trigger: 'blur'
    }
  ]
})
const emits = defineEmits(['update:modelValue', 'init'])

const handleClose = () => {
  emits('update:modelValue', false)
  form.value = {}
}
const handleConfirm = async () => {
  if (props.dialogTitle === '添加角色') {
    await AddRole(form.value)
  } else {
    await EditRole(props.dialogData.roleId, form.value)
  }
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success'
  })
  emits('init')
  handleClose()
}

watch(
  () => props.dialogData,
  () => {
    form.value.roleName = props.dialogData.roleName
    form.value.roleDesc = props.dialogData.roleDesc
  },
  { deep: true, immediate: true }
)
</script>

<style scoped></style>
