<template>
  <div class="coming-soon-container">
    <el-result
      icon="info"
      title="功能正在开发中"
      sub-title="敬请期待我们即将上线的新功能！"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/chat')">返回智能问答</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
.coming-soon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  margin: 20px;
}
</style>
