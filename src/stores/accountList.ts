import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { debounce } from '@/utils/debounce'

export interface FormLabel {
  text: string
}

export enum AccountType {
  LOCAL = 'local',
  LDAP = 'ldap',
}

export interface AccountForm {
  label: FormLabel[]
  type: AccountType
  login: string
  password: string | null
  uuid: number
}

export const useAccountStore = defineStore('accountList', () => {
  const storedAccounts = localStorage.getItem('accounts')
  const accountList = ref<AccountForm[]>(storedAccounts ? JSON.parse(storedAccounts) : [])

  const addAccount = () => {
    const uuid = ref<number>(Date.now())

    const newAccount: AccountForm = {
      label: [],
      type: AccountType.LOCAL,
      login: '',
      password: null,
      uuid: uuid.value,
    }
    accountList.value.push(newAccount)
  }

  watch(
    accountList,
    debounce(() => {
      localStorage.setItem('accounts', JSON.stringify(accountList.value))
    }, 300),
    { deep: true },
  )

  const deleteAccount = (uuid: number) => {
    accountList.value = accountList.value.filter((account) => account.uuid !== uuid)
  }

  const updateAccount = (updatedAccount: AccountForm) => {
    let targetAccountIdx = accountList.value.findIndex(
      (account) => account.uuid === updatedAccount.uuid,
    )
    if (targetAccountIdx !== -1) {
      accountList.value[targetAccountIdx] = { ...updatedAccount }
    }
  }

  return {
    accountList,
    addAccount,
    deleteAccount,
    updateAccount,
  }
})
