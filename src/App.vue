<script setup lang="ts">
import AccountForm from '@/components/AccountForm.vue'
import { PlusSquareOutlined } from '@ant-design/icons-vue'
import { useAccountStore } from '@/stores/accountList'

const informNote = 'Для указанания нескольких меток одной пары используйте разделитель ;'
const accountStore = useAccountStore()
</script>

<template>
  <h1 class="account-list-add">
    Учетные записи&nbsp;<PlusSquareOutlined @click="accountStore.addAccount" />
  </h1>
  <a-alert :message="informNote" type="info" class="account-list-alert" show-icon />

  <main class="account-list">
    <div class="account-list-titles account-list__subgrid">
      <div>Метки</div>
      <div>Тип записи</div>
      <div class="account-list-titles__user-info">
        <div>Логин</div>
        <div>Пароль</div>
      </div>
      <div class="account-delete"></div>
    </div>
    <AccountForm
      v-for="account in accountStore.accountList"
      class="account-list__subgrid"
      :key="account.uuid"
      :account="account"
      @delete-account="accountStore.deleteAccount($event)"
      @update-account="accountStore.updateAccount($event)"
    />
  </main>
</template>

<style scoped>
.account-list-add {
  display: flex;
  align-items: center;
}

.account-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr) minmax(min-content, max-content);
  align-items: center;
  gap: 12px;
}

.account-list-alert {
  margin-bottom: 8px;
}

.account-list-titles__user-info {
  display: flex;
  gap: 12px;
}

.account-list-titles__user-info > * {
  flex: 1 1 100%;
}
</style>

<style>
.account-list__subgrid {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1/-1;
  align-items: center;
}
</style>
