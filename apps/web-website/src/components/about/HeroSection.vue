<template>
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">我们构建工具，你实现未来</h1>
      <p class="hero__desc">
        集成客服、社区、邮件、通信、营销与协作等核心工具；助力企业安全、高效、低成本构建专属数字生态；<br>
        实现业务快速上线与全球市场拓展。
      </p>
    </div>
    <div class="hero__bg"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 480px;
  background: linear-gradient(180deg, #e7f4ff 0%, #f2f9ff 100%);
  overflow: hidden;
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  padding-top: 78px;
  text-align: center;
}

.hero__title {
  font-size: 56px;
  font-weight: 600;
  line-height: 78px;
  color: #181c29;
  margin-bottom: 36px;
}

.hero__desc {
  font-size: 18px;
  line-height: 26px;
  color: #4d5260;
}

.hero__bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(16, 94, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}
</style>
