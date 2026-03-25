<template>
  <section class="why-choose">
    <div class="container">
      <h2 class="section-title">为什么选择我们?</h2>
      <div class="compare-wrapper">
        <div class="compare-header">
          <div class="header-item problems">常见难题</div>
          <div class="header-item advantages">我们的优势</div>
        </div>
        <div class="compare-content">
          <div class="problems-side">
            <div class="feature-card">
              <div class="icon-box">💰</div>
              <h4>昂贵的系统成本</h4>
            </div>
            <div class="feature-card">
              <div class="icon-box">⚙️</div>
              <h4>繁琐的部署流程</h4>
            </div>
            <div class="feature-card">
              <div class="icon-box">🔧</div>
              <h4>割裂的工具</h4>
            </div>
            <div class="feature-card">
              <div class="icon-box">🔒</div>
              <h4>数据安全问题</h4>
            </div>
          </div>
          <div class="advantages-side">
            <div class="feature-card highlight">
              <div class="icon-box">💎</div>
              <h4>个性化定价方案</h4>
            </div>
            <div class="feature-card highlight">
              <div class="icon-box">⚡</div>
              <h4>低代码框架</h4>
            </div>
            <div class="feature-card highlight">
              <div class="icon-box">🎯</div>
              <h4>一体化平台</h4>
            </div>
            <div class="feature-card highlight">
              <div class="icon-box">🛡️</div>
              <h4>高强度加密算法</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-choose {
  padding: 80px 0;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 120px;
}

.section-title {
  font-size: 40px;
  font-weight: 600;
  line-height: 72px;
  color: #181c29;
  text-align: center;
  margin-bottom: 60px;
}

.compare-wrapper {
  margin-top: 60px;
}

.compare-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e4ef;
}

.header-item {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
}

.header-item.problems {
  color: #828897;
}

.header-item.advantages {
  color: #105eff;
}

.compare-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}

.problems-side,
.advantages-side {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(178, 201, 224, 0.1);
}

.feature-card.highlight {
  border-color: #d0e0ff;
}

.icon-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f2f5;
  border-radius: 24px;
  font-size: 24px;
  margin-bottom: 14px;
}

.feature-card.highlight .icon-box {
  background: #fff;
}

.feature-card h4 {
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: #181c29;
  margin: 0;
}
</style>
