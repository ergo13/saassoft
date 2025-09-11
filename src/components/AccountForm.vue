<script setup lang="ts">
import { ref, computed, nextTick, toRaw } from 'vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { type AccountForm, AccountType } from '@/stores/accountList'
import * as yup from 'yup'

const props = defineProps<{ account: AccountForm }>()
const emits = defineEmits<{
  'delete-account': [uuid: number]
  'update-account': [account: AccountForm]
}>()

const errors = ref<Record<string, string>>({})

const updateEmithandler = (updates: Partial<AccountForm>) => {
  const oldAccount = structuredClone(toRaw(props.account))
  emits('update-account', { ...oldAccount, ...updates })
}

const validationSchema = yup.object({
  login: yup.string().required('Обязательное поле'),
  password: yup.string().when('type', {
    is: (type: string) => type === AccountType.LOCAL,
    then: (validationSchema) => validationSchema.required('Обязательное поле'),
    otherwise: (validationSchema) => validationSchema.nullable(),
  }),
})

const validateField = async (field: string) => {
  try {
    await validationSchema.validateAt(field, props.account)
    errors.value[field] = ''
  } catch (error) {
    if (error instanceof Error) {
      errors.value[field] = error.message
    }
  }
}

const formatedLabel = computed(() => {
  return props.account.label.map((item) => item.text).join(';')
})

const labelInputHandler = async (label: string) => {
  const squashSemi = /;{2,}/g
  const sanitizeLabel = label.replace(squashSemi, ';')

  const labelArr = sanitizeLabel
    .split(/;/)
    .filter((label) => !!label)
    .map((label) => ({ text: label }))
  if (formatedLabel.value === sanitizeLabel) {
    updateEmithandler({ label: [] })
    await nextTick()
  }

  updateEmithandler({ label: labelArr })
}

const typeChangeHandle = (type: AccountType) => {
  updateEmithandler({ type, password: type === AccountType.LDAP ? null : '' })
}
</script>

<template>
  <form class="account-form">
    <a-textarea
      :value="formatedLabel"
      :maxlength="50"
      :autoSize="true"
      name="accout-label"
      placeholder="Значение"
      @input="labelInputHandler($event.target.value)"
    />

    <a-select :value="props.account.type" @change="typeChangeHandle($event)">
      <a-select-option value="local">Локальная</a-select-option>
      <a-select-option value="ldap">LDAP</a-select-option>
    </a-select>

    <div class="account-form__user-info">
      <a-input
        :value="props.account.login"
        name="account-login"
        :maxlength="100"
        :class="{
          hasError: errors.login,
        }"
        placeholder="Значение"
        @input="updateEmithandler({ login: $event.target.value })"
        @blur="validateField('login')"
      />

      <PasswordInput
        v-if="props.account.type === AccountType.LOCAL"
        :class="{
          hasError: errors.password,
        }"
        :maxlength="100"
        :value="props.account.password"
        name="account-password"
        @input="updateEmithandler({ password: $event.target.value })"
        @blur="validateField('password')"
      />
    </div>

    <DeleteOutlined
      class="account-form__remove"
      @click="emits('delete-account', props.account.uuid)"
    />
  </form>
</template>

<style scoped>
.account-form__user-info {
  display: flex;
  column-gap: 12px;
}
</style>
