<template>
  <el-aside width="250px" class="sidebar">
    <h3 class="p-4 text-lg font-bold">历史会话</h3>
    <el-menu
        :default-active="activeId"
        class="el-menu-vertical-demo"
        @select="handleSelect"
    >
      <el-menu-item
          v-for="session in sessions"
          :key="session.id"
          :index="session.id"
      >
        <span>{{ session.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sessions: { type: Array, default: () => [] },
  activeId: { type: String, default: '' }
})
const emits = defineEmits(['select'])

const handleSelect = (id) => {
  emits('select', id)
}
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #eee;
  height: 100vh;
  background: #fafafa;
}
</style>
