<template>
  <div class="chat-view-container">
    <!-- 猜你想问 -->
    <div v-if="messages.length <= 1" class="guess-you-ask">
      <div class="title">猜你想问</div>
      <div class="tags-container">
        <el-tag v-for="item in suggestedQuestions" :key="item" type="info" @click="askSuggested(item)">
          {{ item }}
        </el-tag>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <div class="chat-window">
      <el-scrollbar ref="scrollbarRef" class="message-scrollbar">
        <div class="message-list-wrapper">
          <div v-for="message in messages" :key="message.id" :class="['message-container', `message-${message.role}`]">
            <el-avatar :size="32" class="message-avatar">{{ message.role === 'user' ? 'U' : 'AI' }}</el-avatar>
            <div class="message-bubble">
              <div v-html="renderMarkdown(message.content)"></div>
              <span v-if="isStreaming && message.id === streamingMessageId" class="typing-cursor"></span>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <!-- 输入区域 -->
      <div class="chat-input-area">
        <div v-if="isStreaming" class="stop-generating-wrapper">
          <el-button type="warning" @click="stopStreaming" round>停止生成</el-button>
        </div>
        <div class="input-wrapper">
          <el-input
            ref="inputRef"
            v-model="inputText"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
            placeholder="请输入您的问题... (Enter 发送, Shift+Enter 换行)"
            @keydown="handleKeydown"
            :disabled="isStreaming"
            size="large"
            autofocus
          />
          <el-button
            class="send-button"
            type="primary"
            :icon="Promotion"
            @click="handleSendMessage"
            :disabled="isStreaming || !inputText.trim()"
            circle
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Promotion } from '@element-plus/icons-vue';
import MarkdownIt from 'markdown-it';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const inputText = ref('');
const messages = ref([
  { id: 1, role: 'assistant', content: '您好！我是您的智能资产问答助手。' },
]);
const isStreaming = ref(false);
const streamingMessageId = ref(null);
const scrollbarRef = ref(null);
const inputRef = ref(null);
let abortController = null;

const suggestedQuestions = ref([
  '查询日活跃用户数指标',
  '查询近30天订单表结构',
  '活跃用户的计算口径是什么？',
  '帮我推荐一些用户行为相关的指标'
]);

const md = new MarkdownIt();
const renderMarkdown = (text) => md.render(text || '');

const scrollToBottom = async () => {
  await nextTick();
  scrollbarRef.value?.wrapRef.scrollTo({ top: scrollbarRef.value.wrapRef.scrollHeight, behavior: 'smooth' });
};

const focusInput = () => nextTick(() => inputRef.value?.focus());

onMounted(focusInput);

const stopStreaming = () => {
  if (abortController) {
    abortController.abort();
  }
};

const askSuggested = (question) => {
  inputText.value = question;
  handleSendMessage();
};

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // 阻止默认的换行行为
    handleSendMessage();
  }
};

const handleSendMessage = async () => {
  const userMessage = inputText.value.trim();
  if (!userMessage || isStreaming.value) return;

  messages.value.push({ id: Date.now(), role: 'user', content: userMessage });
  inputText.value = '';
  await scrollToBottom();

  isStreaming.value = true;
  const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: '' };
  streamingMessageId.value = assistantMessage.id;
  messages.value.push(assistantMessage);
  await scrollToBottom();

  abortController = new AbortController();

  await fetchEventSource('http://localhost:8033/chat-sse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({ query: userMessage }),
    signal: abortController.signal,
    openWhenHidden: true,

    onmessage(event) {
      console.info(event);
      if (event.data === '[DONE]') {
        stopStreaming(); // Gracefully stop the connection
        return;
      }
      if (event.data) {
        const assistantMessage = messages.value.find(m => m.id === streamingMessageId.value);
        if (assistantMessage) {
          assistantMessage.content += event.data;
        }
        scrollToBottom();
      }
    },

    onclose() {
      isStreaming.value = false;
      streamingMessageId.value = null;
      abortController = null;
      focusInput();
    },

    onerror(err) {
      const assistantMessage = messages.value.find(m => m.id === streamingMessageId.value);
      if (assistantMessage) {
        if (err.name === 'AbortError') {
          assistantMessage.content += '\n(已停止)';
        } else {
          assistantMessage.content = `抱歉，查询时遇到问题: ${err.message}。`;
          ElMessage.error('查询失败，请稍后重试');
        }
      }
      // The onclose() callback will be called automatically.
      throw err; // Rethrow to ensure the connection is closed
    },
  });
};
</script>

<style scoped>
.chat-view-container { height: 100%; display: flex; flex-direction: column; padding: 20px; background-color: #f0f2f5; gap: 20px; }
.guess-you-ask { background-color: #fff; padding: 20px; border-radius: 8px; flex-shrink: 0; }
.guess-you-ask .title { font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #303133; }
.tags-container { display: flex; flex-wrap: wrap; gap: 10px; }
.tags-container .el-tag { cursor: pointer; }

.chat-window { flex-grow: 1; background-color: #fff; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; }
.message-scrollbar { flex-grow: 1; }

.message-list-wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-container {
  display: flex;
  gap: 10px;
  max-width: 80%;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-container.message-assistant {
  align-self: flex-start;
}

.message-container.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar { flex-shrink: 0; background-color: var(--el-color-primary-light-3); color: var(--el-color-white); }
.message-container.message-user .message-avatar { background-color: var(--el-color-success-light-3); }

.message-bubble {
  padding: 6px 14px;
  border-radius: 18px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  position: relative;
}

.message-bubble :deep(p) {
  margin: 0;
}

.message-user .message-bubble {
  background-color: var(--el-color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-bubble {
  background-color: #fff;
  color: #303133;
  border: 1px solid #e9e9eb;
  border-bottom-left-radius: 4px;
}

.chat-input-area { padding: 1rem; border-top: 1px solid var(--el-border-color-light); flex-shrink: 0; background-color: #fff; }
.input-wrapper { display: flex; align-items: flex-end; gap: 10px; }
.stop-generating-wrapper { display: flex; justify-content: center; margin-bottom: 10px; }
.typing-cursor { display: inline-block; width: 8px; height: 1em; background-color: #303133; animation: blink 1s infinite; vertical-align: text-bottom; margin-left: 4px; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
