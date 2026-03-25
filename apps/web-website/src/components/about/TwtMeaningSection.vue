<template>
  <section class="twt-meaning">
    <div class="container">
      <h2 class="section-title">"TWT" 是什么？</h2>
      <div class="meaning-grid">
        <div class="meaning-item">
          <div class="letter-badge blue">T</div>
          <div class="meaning-card">
            <h3>Talk</h3>
            <p>连接世界的起点</p>
          </div>
        </div>
        <div class="meaning-item">
          <div class="letter-badge green">W</div>
          <div class="meaning-card">
            <h3>Work</h3>
            <p>驱动业务的核心</p>
          </div>
        </div>
        <div class="meaning-item">
          <div class="letter-badge orange">T</div>
          <div class="meaning-card">
            <h3>Thrive</h3>
            <p>每个团队最真实的渴望</p>
          </div>
        </div>
      </div>
      <div class="summary-card">
        <p>简洁、高效、安全，专为成长型团队而生！</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.twt-meaning {
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
  margin-bottom: 80px;
}

.meaning-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 40px;
}

.meaning-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.letter-badge {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.letter-badge.blue {
  background: #0f5eff;
}

.letter-badge.green {
  background: #07d0b5;
}

.letter-badge.orange {
  background: #f97801;
}

.meaning-card {
  width: 100%;
  padding: 40px 88px;
  background: #ecf2ff;
  border: 2px solid #82abff;
  border-radius: 16px;
  text-align: center;
}

.meaning-item:nth-child(2) .meaning-card {
  background: #e6faf7;
  border-color: #5fedd9;
}

.meaning-item:nth-child(3) .meaning-card {
  background: #fff5e6;
  border-color: #ffb876;
}

.meaning-card h3 {
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  margin-bottom: 4px;
}

.meaning-item:nth-child(1) .meaning-card h3 {
  color: #0f5eff;
}

.meaning-item:nth-child(2) .meaning-card h3 {
  color: #05bba2;
}

.meaning-item:nth-child(3) .meaning-card h3 {
  color: #f97801;
}

.meaning-card p {
  font-size: 16px;
  line-height: 26px;
  color: inherit;
}

.summary-card {
  max-width: 870px;
  margin: 0 auto;
  padding: 40px;
  background: #105eff;
  border-radius: 24px;
  text-align: center;
}

.summary-card p {
  font-size: 28px;
  font-weight: 500;
  line-height: 36px;
  color: #fff;
  margin: 0;
}
</style>
