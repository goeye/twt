<template>
  <section class="core-values">
    <div class="container">
      <h2 class="section-title">核心理念</h2>
      <div class="values-grid">
        <div class="value-card">
          <div class="value-icon">👥</div>
          <h3>客户成功，永远第一</h3>
          <p>我们始终以客户成功为导向，您的业务成果，就是我们最大的追求。</p>
        </div>
        <div class="value-card featured">
          <div class="value-icon">🔐</div>
          <h3>安全合规，绝不妥协</h3>
          <p>金融级加密与全球合规认证，守护您的数据如同守护自家保险箱。</p>
        </div>
        <div class="value-card">
          <div class="value-icon">💡</div>
          <h3>持续创新，永不停歇</h3>
          <p>不断迭代升级，版本号永远 "+1"，只为让您用上更快、更强、更好用的企业服务。</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.core-values {
  padding: 80px 0;
  background: linear-gradient(-90deg, #e7f4ff 0%, #f2f9ff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 120px;
}

.section-title {
  font-size: 40px;
  font-weight: 600;
  line-height: 48px;
  color: #181c29;
  text-align: center;
  margin-bottom: 80px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.value-card {
  padding: 64px 40px;
  background: #fff;
  border-radius: 20px;
  text-align: center;
}

.value-card.featured {
  border: 3px solid #02d9ed;
  box-shadow: 4px 4px 28px rgba(208, 223, 236, 0.6);
}

.value-icon {
  width: 108px;
  height: 108px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  font-size: 58px;
}

.value-card h3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #181c29;
  margin-bottom: 16px;
}

.value-card p {
  font-size: 16px;
  line-height: 26px;
  color: #4d5260;
  margin: 0;
}
</style>
