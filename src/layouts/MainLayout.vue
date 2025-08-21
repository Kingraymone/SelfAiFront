<template>
  <el-container class="main-layout">
    <!-- 顶部导航栏 -->
    <el-header class="top-header">
      <div class="logo-area">
        <img src="/logo.svg" alt="Logo" class="logo-img" />
        <h1>数据作战室</h1>
      </div>
      <div class="user-area">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar size="small" icon="UserFilled" />
            <span class="username">王总</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边菜单栏 -->
      <el-aside width="200px" class="side-menu-aside">
        <el-menu
          :default-active="$route.path"
          class="side-menu"
          router
        >
          <el-menu-item index="/chat">
            <el-icon><ChatDotRound /></el-icon>
            <span>智能问答</span>
          </el-menu-item>
          <el-menu-item index="/asset-explorer">
            <el-icon><Search /></el-icon>
            <span>资产探查</span>
          </el-menu-item>
          <el-menu-item index="/domain">
            <el-icon><Collection /></el-icon>
            <span>主题域</span>
          </el-menu-item>
          <el-menu-item index="/metrics">
            <el-icon><DataAnalysis /></el-icon>
            <span>指标管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="content-main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ArrowDown, ChatDotRound, Search, Collection, DataAnalysis, UserFilled } from '@element-plus/icons-vue';
</script>

<style scoped>
.main-layout, .el-container {
  height: 100vh;
  overflow: hidden;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #001529;
  color: #fff;
  border-bottom: 1px solid var(--el-border-color-light);
}

.logo-area {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 32px;
  margin-right: 12px;
}

.logo-area h1 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
}

.user-area {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #fff;
}

.username {
  margin-left: 8px;
}

.side-menu-aside {
  border-right: 1px solid var(--el-border-color-light);
}

.side-menu {
  height: 100%;
  border-right: none;
}

.content-main {
  background-color: #f0f2f5;
  padding: 0;
}
</style>
