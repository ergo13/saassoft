<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { type AccountForm, AccountType } from '@/stores/accountList'
import * as yup from 'yup'
import { debounce } from '@/utils/debounce'

const props = defineProps<{ account: AccountForm }>()
const emits = defineEmits<{
  'delete-account': [uuid: number]
  'update-account': [account: AccountForm]
}>()

const localAccount = ref<AccountForm>(JSON.parse(JSON.stringify(props.account)))
const errors = ref<Record<string, string>>({})

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
    await validationSchema.validateAt(field, localAccount.value)
    errors.value[field] = ''
  } catch (error) {
    if (error instanceof Error) {
      errors.value[field] = error.message
    }
  }
}

const formatedLabel = computed(() => {
  return localAccount.value.label.map((item) => item.text).join(';')
})

const labelInputHandler = async (label: string) => {
  const onlySemicolon = /^[a-zA-Z0-9\s;]*$/
  const sanitizeLabel = label.replace(/^;+|;+$/g, '')

  if (onlySemicolon.test(sanitizeLabel)) {
    const labelArr = sanitizeLabel.split(';').map((label) => ({ text: label }))
    localAccount.value.label = labelArr
  } else {
    errors.value.label = 'Недоспустимый разделитель'
  }
}

const typeChangeHandle = (type: AccountType) => {
  localAccount.value.type = type
  if (type === AccountType.LDAP) {
    localAccount.value.password = null
  }
}

watch(
  localAccount,
  debounce((value) => {
    emits('update-account', value)
  }, 300),
  { deep: true },
)

watch(
  props.account,
  (newAccount) => {
    localAccount.value = { ...newAccount }
  },
  { deep: true, immediate: true },
)
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

    <a-select :value="localAccount.type" @change="typeChangeHandle($event)">
      <a-select-option value="local">Локальная</a-select-option>
      <a-select-option value="ldap">LDAP</a-select-option>
    </a-select>

    <div class="account-form__user-info">
      <a-input
        :value="localAccount.login"
        name="account-login"
        :maxlength="100"
        :class="{
          hasError: errors.login,
        }"
        placeholder="Значение"
        @input="localAccount.login = $event.target.value"
        @blur="validateField('login')"
      />

      <PasswordInput
        v-if="localAccount.type === AccountType.LOCAL"
        :class="{
          hasError: errors.password,
        }"
        :maxlength="100"
        :value="localAccount.password"
        name="account-password"
        @input="localAccount.password = $event.target.value"
        @blur="validateField('password')"
      />
    </div>

    <DeleteOutlined
      class="account-form__remove"
      @click="emits('delete-account', localAccount.uuid)"
    />
  </form>
</template>

<style scoped>
.account-form__user-info {
  display: flex;
  column-gap: 12px;
}
</style>
