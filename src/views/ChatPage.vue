<template>
  <div class="app-container flex h-screen">
    <!-- 左侧历史对话记录栏 -->
    <aside class="sidebar w-64 bg-gray-100 p-4 border-r overflow-y-auto">
      <h3 class="text-lg font-bold mb-4">历史问答</h3>
      <ul>
        <li
            v-for="(item, index) in chatHistory"
            :key="index"
            class="p-2 mb-2 rounded cursor-pointer hover:bg-gray-200"
            @click="selectHistory(index)"
        >
          <p class="text-sm font-medium truncate">{{ item.question }}</p>
          <p class="text-xs text-gray-500 truncate">{{ item.answer }}</p>
        </li>
      </ul>
    </aside>

    <!-- 右侧主聊天区域 -->
    <main class="flex-1 flex flex-col">
      <!-- 聊天内容展示 -->
      <div class="chat-box flex-1 overflow-y-auto p-4 bg-white">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            class="mb-4"
        >
          <!-- 用户消息 -->
          <div class="text-right mb-2">
            <span class="inline-block bg-blue-500 text-white p-2 rounded-lg max-w-xl">
              {{ msg.question }}
            </span>
          </div>
          <!-- 助手消息 -->
          <div class="text-left">
            <span class="inline-block bg-gray-200 p-2 rounded-lg max-w-xl">
              {{ msg.answer }}
            </span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center text-gray-400">
          正在生成回答...
        </div>
      </div>

      <!-- 输入区 -->
      <div class="input-box border-t p-4 bg-gray-50">
        <el-input
            v-model="inputText"
            placeholder="请输入您的问题，例如：查询日活跃用户数指标"
            clearable
            @keyup.enter="handleQuery"
        >
          <template #append>
            <el-button type="primary" @click="handleQuery">查询</el-button>
          </template>
        </el-input>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const inputText = ref("");
const messages = ref([]);
const chatHistory = ref([]);
const loading = ref(false);

const handleQuery = async () => {
  if (!inputText.value.trim()) return;

  const question = inputText.value;
  inputText.value = "";
  loading.value = true;

  const newMessage = { question, answer: "" };
  messages.value.push(newMessage);

  try {
    const response = await axios.post("/chat-stream", { query: question }, { responseType: "stream" });

    // 模拟流式渲染（实际需要EventSource或fetch流处理）
    response.data.on("data", (chunk) => {
      newMessage.answer += chunk.toString();
    });

    response.data.on("end", () => {
      chatHistory.value.unshift(newMessage);
      loading.value = false;
    });
  } catch (error) {
    newMessage.answer = "查询失败，请重试。";
    loading.value = false;
  }
};

const selectHistory = (index) => {
  messages.value = [chatHistory.value[index]];
};
</script>

<style scoped>
.app-container {
  font-family: "Helvetica Neue", Arial, sans-serif;
}
.chat-box {
  background-color: #fafafa;
}
.sidebar {
  background-color: #f9fafb;
}
</style>
