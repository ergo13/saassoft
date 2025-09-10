<script setup lang="ts">
import { ref, computed } from 'vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'

const showPass = ref(false)
const inputType = computed(() => {
  return showPass.value ? 'text' : 'password'
})
</script>

<template>
  <a-input :type="inputType">
    <template #suffix>
      <EyeOutlined v-if="showPass" @click="showPass = !showPass" />
      <EyeInvisibleOutlined v-else @click="showPass = !showPass" />
    </template>
  </a-input>
</template>

<style scoped></style>
