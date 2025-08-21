<template>
  <div class="chat-input">
    <el-input
        v-model="input"
        placeholder="请输入问题..."
        type="textarea"
        :rows="2"
        @keyup.enter.native="handleSend"
    />
    <el-button type="primary" @click="handleSend" class="ml-2">发送</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const emits = defineEmits(['send'])

const handleSend = () => {
  if (!input.value.trim()) return
  emits('send', input.value)
  input.value = ''
}
</script>

<style scoped>
.chat-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #eee;
  background: #fafafa;
}
</style>
