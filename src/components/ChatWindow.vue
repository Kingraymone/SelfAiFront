<template>
  <div class="chat-window">
    <div v-for="msg in messages" :key="msg.id" class="message">
      <div
          :class="['bubble', msg.role === 'user' ? 'user' : 'assistant']"
      >
        {{ msg.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: { type: Array, default: () => [] }
})
</script>

<style scoped>
.chat-window {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fff;
}
.message {
  margin: 8px 0;
}
.bubble {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}
.user {
  background: #409eff;
  color: #fff;
  margin-left: auto;
}
.assistant {
  background: #f4f4f5;
  color: #333;
  margin-right: auto;
}
</style>
