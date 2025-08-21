<template>
  <el-container class="main-container">
    <!-- 侧边栏：历史会话 -->
    <el-aside width="260px" class="history-aside">
      <div class="history-header">
        <h2>历史会话</h2>
        <el-button type="primary" :icon="Edit" @click="startNewSession" text>新会话</el-button>
      </div>
      <el-menu
        default-active="1"
        class="history-menu"
      >
        <el-menu-item index="1">
          <template #title>
            <span>日活跃用户数指标查询...</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2">
          <template #title>
            <span>查询近30天订单表</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主聊天窗口 -->
    <el-container>
      <el-main
        class="chat-main"
        v-loading="isLoading"
        element-loading-text="思考中，请稍候..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
      >
        <el-scrollbar ref="scrollbarRef" class="message-scrollbar">
          <div class="message-list-wrapper">
            <div v-for="message in messages" :key="message.id" :class="['message-container', `message-${message.role}`]">
              <div class="message-bubble">
                <!-- 支持渲染Markdown格式的内容 -->
                <div v-html="renderMarkdown(message.content)"></div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-main>

      <!-- 页脚：输入区域 -->
      <el-footer class="chat-footer">
        <div class="input-wrapper">
          <el-input
            ref="inputRef"
            v-model="inputText"
            placeholder="请输入您的问题，例如：查询日活跃用户数指标"
            @keydown.enter.prevent="handleSendMessage"
            clearable
            size="large"
            autofocus
          >
            <template #append>
              <el-button :icon="Promotion" @click="handleSendMessage" :disabled="isLoading || !inputText.trim()">
                发送
              </el-button>
            </template>
          </el-input>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Promotion, Edit } from '@element-plus/icons-vue';
import MarkdownIt from 'markdown-it';

// --- 响应式状态定义 ---
const inputText = ref('');
const messages = ref([
  { id: 1, role: 'assistant', content: '您好！我是您的智能资产问答助手，可以帮助您查询指标、维度等信息。' },
]);
const isLoading = ref(false);
const scrollbarRef = ref(null);
const inputRef = ref(null);

// --- Markdown渲染器 ---
const md = new MarkdownIt();
const renderMarkdown = (text) => md.render(text || '');

// --- 核心功能方法 ---

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (scrollbarRef.value) {
    scrollbarRef.value.setScrollTop(scrollbarRef.value.wrapRef.scrollHeight);
  }
};

// 开始新会话
const startNewSession = () => {
  messages.value = [
    { id: 1, role: 'assistant', content: '您好！这是一个新的会话，请问有什么可以帮助您的吗？' },
  ];
  inputText.value = '';
  ElMessage.success('新会话已开始');
  focusInput();
};

// 使输入框获得焦点
const focusInput = () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

onMounted(() => {
  focusInput();
});

// 处理发送消息
const handleSendMessage = async () => {
  const userMessage = inputText.value.trim();
  if (!userMessage) return;

  // 1. 将用户消息添加到列表
  messages.value.push({ id: Date.now(), role: 'user', content: userMessage });
  inputText.value = '';
  scrollToBottom();

  // 2. 设置加载状态并准备接收流式响应
  isLoading.value = true;
  const assistantMessageId = Date.now() + 1;
  messages.value.push({ id: assistantMessageId, role: 'assistant', content: '' });
  scrollToBottom();

  try {
    // 3. 发起Fetch请求到流式API
    const response = await fetch('/chat-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userMessage, history: messages.value.slice(0, -2) }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 4. 处理流式数据
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let streaming = true;

    while (streaming) {
      const { done, value } = await reader.read();
      if (done) {
        streaming = false;
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      
      // 更新助手消息内容
      const assistantMessage = messages.value.find(m => m.id === assistantMessageId);
      if (assistantMessage) {
        assistantMessage.content += chunk;
        scrollToBottom();
      }
    }

  } catch (error) {
    console.error('Streaming failed:', error);
    const assistantMessage = messages.value.find(m => m.id === assistantMessageId);
    if (assistantMessage) {
        assistantMessage.content = `抱歉，查询时遇到问题: ${error.message}。请检查您的网络或联系技术支持。`;
    }
    ElMessage.error('查询失败，请稍后重试');
  } finally {
    isLoading.value = false;
    focusInput();
  }
};

</script>

<style scoped>
.main-container, .chat-main {
  height: 100vh;
}

.history-aside {
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
}

.history-header {
  padding: 1rem;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.history-menu {
  border-right: none;
  flex-grow: 1;
}

.chat-main {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.message-scrollbar {
  flex-grow: 1;
}

.message-list-wrapper {
  padding: 20px;
}

.message-container {
  display: flex;
  margin-bottom: 20px;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 15px;
  border-radius: 18px;
  line-height: 1.6;
  background-color: #f0f2f5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* 用户消息样式 */
.message-user {
  justify-content: flex-end;
}

.message-user .message-bubble {
  background-color: var(--el-color-primary);
  color: #fff;
}

/* 助手消息样式 */
.message-assistant {
  justify-content: flex-start;
}

.message-assistant .message-bubble {
  background-color: #f0f2f5;
  color: #303133;
}

.chat-footer {
  padding: 1rem 2rem;
  background-color: #fff;
  border-top: 1px solid var(--el-border-color-light);
}

.input-wrapper .el-input__wrapper {
  border-radius: 20px;
}
</style>
