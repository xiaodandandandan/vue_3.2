<template>
  <el-dialog
    :model-value="dialogFormVisible"
    :title="dialogTitle"
    width="40%"
    @close="handleCancel"
  >
    <el-form :model="form" :label-width="100" :rules="rules">
      <el-form-item :label="$t('dialog.username')" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item
        :label="$t('dialog.password')"
        prop="password"
        v-if="dialogTitle === $t('dialog.adduser')"
      >
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item :label="$t('dialog.email')" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item :label="$t('dialog.mobile')" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import { addUser, editUser } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const form = ref({
  username: '',
  password: '',
  email: '',
  mobile: ''
})
const rules = ref({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请输入正确的邮箱',
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      required: true,
      message: '请输入电话号码',
      trigger: 'blur'
    }
  ]
})
const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogFormData: {
    type: Object,
    default: () => {}
  }
})
watch(
  () => props.dialogFormData,
  () => {
    form.value = props.dialogFormData
  },
  { deep: true, immediate: true }
)
const emits = defineEmits(['update:modelValue', 'init'])

const handleCancel = () => {
  emits('update:modelValue', false)
  form.value = {}
}
const handleConfirm = async () => {
  if (props.dialogTitle === i18n.t('dialog.adduser')) {
    await addUser(form.value)
  } else {
    await editUser(form.value)
  }
  emits('init')
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success'
  })
  handleCancel()
}
</script>

<style scoped></style>
