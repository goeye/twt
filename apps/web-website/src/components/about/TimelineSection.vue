<template>
  <section class="timeline">
    <div class="container">
      <h2 class="section-title">发展历程</h2>
      <div class="timeline-line"></div>
      <div class="timeline-items">
        <div class="timeline-item left">
          <div class="year-badge">2024</div>
          <div class="content-card">
            <p>· 用户规模突破 <strong>130 万</strong>，服务国家和地区超过 <strong>20 个</strong>。</p>
            <p>· 引入<strong>AI辅助</strong>智能客服和<strong>自动化</strong>营销工具，提升运营效率，实现精准触达和业务闭环</p>
          </div>
        </div>
        <div class="timeline-item right">
          <div class="year-badge">2021</div>
          <div class="content-card">
            <p>· <strong>推出Link</strong>（私有化聊天平台），为企业打造的私有化部署即时通讯解决方案，提供端到端加密、完全自主可控的数据安全保障</p>
          </div>
        </div>
        <div class="timeline-item left">
          <div class="year-badge">2020</div>
          <div class="content-card">
            <p>· 成立技术创新中心，布局云计算与大数据。</p>
            <p>· 采用<strong>金融级数据加密技术</strong>，通过ISO27001等多项国际安全合规认证</p>
          </div>
        </div>
        <div class="timeline-item right">
          <div class="year-badge">2019</div>
          <div class="content-card">
            <p>· <strong>上线 Community</strong>（社群搭建平台），帮助企业构建高粘性会员社区</p>
          </div>
        </div>
        <div class="timeline-item left">
          <div class="year-badge">2018</div>
          <div class="content-card">
            <p>· 推出 <strong>Mail</strong>（企业邮件服务），为企业提供专业、安全、稳定的邮件通信解决方案</p>
          </div>
        </div>
        <div class="timeline-item right">
          <div class="year-badge">2016</div>
          <div class="content-card">
            <p>· <strong>完成首轮融资</strong>，获得百万美元资金支持。</p>
            <p>· 业务覆盖东南亚和欧美部分国家，客户数量突破 <strong>10 万</strong></p>
          </div>
        </div>
        <div class="timeline-item left">
          <div class="year-badge">2015</div>
          <div class="content-card">
            <p>· <strong>首款应用Chat</strong>（智能客服）诞生，奠定了TWT的 SaaS一体化平台基础</p>
          </div>
        </div>
        <div class="timeline-item right">
          <div class="year-badge">2012</div>
          <div class="content-card">
            <p>· <strong>团队成立</strong>，核心成员来自通信与互联网领域</p>
            <p>· 开始探索企业即时通讯和协作工具的研发</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  padding: 80px 0;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 120px;
  position: relative;
}

.section-title {
  font-size: 40px;
  font-weight: 600;
  line-height: 72px;
  color: #181c29;
  text-align: center;
  margin-bottom: 80px;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 200px;
  bottom: 100px;
  width: 2px;
  background: #e0e4ef;
  transform: translateX(-1px);
}

.timeline-items {
  position: relative;
}

.timeline-item {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 20px;
  margin-bottom: 60px;
  align-items: center;
}

.timeline-item.left .year-badge {
  grid-column: 2;
}

.timeline-item.left .content-card {
  grid-column: 1;
}

.timeline-item.right .year-badge {
  grid-column: 2;
}

.timeline-item.right .content-card {
  grid-column: 3;
}

.year-badge {
  width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-size: 20px;
  font-weight: 800;
  color: #181c29;
}

.content-card {
  padding: 24px 28px;
  background: #f2f5fa;
  border-radius: 12px;
}

.content-card p {
  font-size: 16px;
  line-height: 28px;
  color: #181c29;
  margin: 0 0 8px 0;
}

.content-card p:last-child {
  margin-bottom: 0;
}

.content-card strong {
  color: #005cff;
  font-weight: 600;
}
</style>
