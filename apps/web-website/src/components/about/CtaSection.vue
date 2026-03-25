<template>
  <section class="cta">
    <div class="container">
      <h2>携手迈入下一阶段</h2>
      <p>灵活、轻量、可靠，提升团队协作效率</p>
      <button class="cta-btn">立即使用</button>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 100px 0;
  background: linear-gradient(-90deg, #e7f4ff 0%, #f2f9ff 100%);
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 120px;
}

.cta h2 {
  font-size: 40px;
  font-weight: 600;
  line-height: 48px;
  color: #181c29;
  margin-bottom: 12px;
}

.cta p {
  font-size: 16px;
  line-height: 24px;
  color: #181c29;
  margin-bottom: 40px;
}

.cta-btn {
  padding: 14px 98px;
  background: #181c29;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.cta-btn:hover {
  opacity: 0.9;
}
</style>
