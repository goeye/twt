<template>
  <section class="agent-content-page ai-agent-page">
    <template v-if="activeKey === 'copilot-settings'">
      <header class="agent-content-header">
        <h1 class="agent-content-title">Copilot设置</h1>
        <p class="agent-content-subtitle">使用 Copilot 工具在客服对话中提供智能辅助功能。</p>
      </header>

      <CopilotPromoBanner
        v-if="showBanner"
        title="以智能驱动服务，助力业务增长"
        description="通过 Copilot 提升响应速度与服务满意度。将每一次咨询转化为高质量的互动，让智能客服成为你业务转化的核心驱动力。"
        @close="showBanner = false"
        @learn="emitToast('文档功能开发中')"
      />

      <div class="ai-agent-page__list">
        <CopilotSettingItem
          v-for="item in copilotSettings"
          :key="item.key"
          :description="item.description"
          :model-value="item.enabled"
          :title="item.title"
          @update:model-value="updateCopilotSetting(item.key, $event)"
        />
      </div>
    </template>

    <template v-else-if="activeKey === 'ai-agent-config'">
      <header class="agent-content-header agent-config-header">
        <div class="agent-config-header__content">
          <div class="agent-config-header__title-row">
            <h1 class="agent-content-title">AI Agent</h1>
            <span class="agent-config-header__status" :class="agentEnabled ? 'agent-config-header__status--active' : 'agent-config-header__status--inactive'">
              {{ agentEnabled ? '已开启' : '已关闭' }}
            </span>
          </div>
          <p class="agent-content-subtitle">开启后，AI 机器人将自动接待访客咨询，根据知识库内容智能回复，并在需要时转接人工客服</p>
        </div>

        <div class="agent-config-header__actions">
          <button
            type="button"
            class="agent-btn"
            :class="agentEnabled ? 'agent-btn--ghost' : 'agent-btn--primary'"
            @click="toggleAgentLiveStatus"
          >
            {{ launchActionLabel }}
          </button>
        </div>
      </header>

      <nav class="config-tabs">
        <button
          type="button"
          class="config-tabs__item"
          :class="{ 'config-tabs__item--active': configTab === 'deploy' }"
          @click="configTab = 'deploy'"
        >AI Agent 部署</button>
        <button
          type="button"
          class="config-tabs__item"
          :class="{ 'config-tabs__item--active': configTab === 'settings' }"
          @click="configTab = 'settings'"
        >AI Agent 设置</button>
      </nav>

      <div v-if="configTab === 'deploy'" class="lifecycle-flow">
        <section
          v-for="section in deployLifecycleSections"
          :key="section.key"
          class="lifecycle-stage"
          :class="`lifecycle-stage--${section.key}`"
        >
          <header class="lifecycle-stage__header">
            <span class="lifecycle-stage__badge" :class="`lifecycle-stage__badge--${section.key}`">
              <AgentIcon :name="section.icon" :size="16" />
            </span>
            <h2 class="lifecycle-stage__title">{{ section.title }}</h2>
          </header>

          <div class="lifecycle-stage__cards">
            <article
              v-for="card in section.cards"
              :key="card.key"
              class="config-card agent-panel"
              :class="{ 'config-card--open': openLifecycleCard === card.key }"
            >
              <button type="button" class="config-card__trigger" @click="toggleLifecycleCard(card.key)">
                <div class="config-card__heading">
                  <h3 class="config-card__title">{{ card.title }}</h3>
                  <span v-if="card.badge" class="config-card__status" :class="`config-card__status--${card.badgeTone ?? 'default'}`">
                    {{ card.badge }}
                  </span>
                  <p class="config-card__summary">{{ card.summary }}</p>
                </div>

                <AgentIcon
                  class="config-card__chevron"
                  :name="openLifecycleCard === card.key ? 'chevron-down' : 'chevron-right'"
                  :size="18"
                />
              </button>

              <div v-if="openLifecycleCard === card.key" class="config-card__body">
                <template v-if="card.key === 'entry-routing'">
                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">接待访客</span>
                      <span class="form-row__desc">限定哪些访客会进入 AI 接待流程</span>
                    </div>
                    <div class="form-row__control">
                      <div class="pill-group">
                        <button
                          v-for="option in audienceOptions"
                          :key="option.value"
                          type="button"
                          class="pill-option"
                          :class="{ 'pill-option--active': visitorAudience === option.value }"
                          @click="visitorAudience = option.value"
                        >{{ option.label }}</button>
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">AI 参与时机</span>
                      <span class="form-row__desc">设置 AI Agent 在首条消息后何时接管回复</span>
                    </div>
                    <div class="form-row__control">
                      <select v-model="agentResponseMode" class="agent-input">
                        <option value="always">始终由 AI Agent 回复</option>
                        <option value="offline-only">仅客服离线时</option>
                      </select>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'entry-visibility'">
                  <div class="visibility-layout">
                    <div class="visibility-layout__form">
                      <div class="form-row form-row--single">
                        <div class="form-row__label">
                          <span class="form-row__name">显示 AI Agent 标签</span>
                          <span class="form-row__desc">开启后，访客会在消息气泡中看到 AI Agent 标签</span>
                        </div>
                        <div class="form-row__control">
                          <label class="agent-switch">
                            <input v-model="showMessageAgentLabel" type="checkbox" class="agent-switch__input" />
                            <span class="agent-switch__track" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="visibility-layout__preview">
                      <p class="bubble-preview__label">预览效果</p>
                      <div class="bubble-preview">
                        <div class="bubble-preview__avatar">
                          <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="" class="bubble-preview__avatar-img" />
                          <span v-else class="bubble-preview__avatar-fallback">{{ avatarFallbackText }}</span>
                        </div>
                        <div class="bubble-preview__content">
                          <span class="bubble-preview__name">
                            {{ botName.trim() || 'AI Agent' }}
                            <span v-if="showMessageAgentLabel" class="bubble-preview__tag">AI Agent</span>
                          </span>
                          <div class="bubble-preview__bubble">你好！有什么可以帮您的吗？</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'identity-profile'">
                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">头像</span>
                      <span class="form-row__desc">设置 AI Agent 的头像形象，用于会话列表和消息头像展示</span>
                    </div>
                    <div class="form-row__control form-row__control--stack">
                      <div class="bot-avatar-upload">
                        <div class="bot-avatar-upload__preview" :class="{ 'bot-avatar-upload__preview--image': Boolean(botAvatarUrl) }">
                          <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="AI Agent 头像" class="bot-avatar-upload__image" />
                          <span v-else class="bot-avatar-upload__fallback">{{ avatarFallbackText }}</span>
                        </div>
                        <div class="bot-avatar-upload__actions">
                          <button type="button" class="agent-btn agent-btn--ghost" @click="triggerBotAvatarSelect">
                            {{ botAvatarUrl ? '重新上传' : '上传头像' }}
                          </button>
                        </div>
                        <input
                          ref="avatarInputRef"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          class="bot-avatar-upload__input"
                          @change="handleAvatarFileChange"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">昵称</span>
                      <span class="form-row__desc">当访客询问“你是谁”时，AI Agent 会优先使用这个身份名称</span>
                    </div>
                    <div class="form-row__control">
                      <input
                        v-model="botName"
                        class="agent-input"
                        :class="{ 'agent-input--error': botNameTouched && !botName.trim() }"
                        maxlength="64"
                        placeholder="请输入昵称"
                        @blur="botNameTouched = true"
                      />
                      <p v-if="botNameTouched && !botName.trim()" class="form-row__error">请输入昵称</p>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">业务简介</span>
                      <span class="form-row__desc">描述你的业务和服务范围，AI 会据此生成更贴合场景的回答</span>
                    </div>
                    <div class="form-row__control">
                      <textarea
                        v-model="botIntro"
                        class="agent-input form-row__textarea"
                        rows="5"
                        maxlength="2000"
                        placeholder="请输入"
                      />
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'identity-style'">
                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">回复语气</span>
                      <span class="form-row__desc">统一 AI Agent 的表达风格，保证对外沟通体验一致</span>
                    </div>
                    <div class="form-row__control">
                      <div class="bot-chips-group">
                        <button
                          v-for="tone in toneOptions"
                          :key="tone.value"
                          type="button"
                          class="bot-chip"
                          :class="{ 'bot-chip--active': selectedTone === tone.value }"
                          @click="selectedTone = tone.value"
                        >{{ tone.label }}</button>
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-row__label">
                      <span class="form-row__name">默认语言</span>
                      <span class="form-row__desc">当系统无法判断访客语言时，将优先使用该语言回复</span>
                    </div>
                    <div class="form-row__control">
                      <select v-model="defaultLanguage" class="agent-input">
                        <option
                          v-for="language in languageOptions"
                          :key="language.value"
                          :value="language.value"
                        >{{ language.label }}</option>
                      </select>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'answering-mode'">
                  <div class="setting-helper-stack">
                    <div class="setting-callout">
                      <p class="setting-callout__text">AI 会结合知识库、业务简介、语气和语言设置来组织回复</p>
                    </div>
                  </div>

                  <div class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">回复模式</span>
                      <span class="form-row__desc">定义 AI 是严格依赖知识库回答，还是允许更主动地推理生成内容</span>
                    </div>
                    <div class="form-row__control">
                      <select v-model="replyMode" class="agent-input">
                        <option value="strict">严格模式 — 仅使用知识库匹配内容回复</option>
                        <option value="creative">发散模式 — 允许 AI 在知识边界内适度推理</option>
                      </select>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'answering-knowledge'">
                  <div class="knowledge-card">

                    <div v-if="knowledgeDocCount <= 10" class="knowledge-card__tip">
                      <p class="knowledge-card__tip-text">
                        AI Agent 需要充足的知识库内容来准确回答访客问题。在启用 AI Agent 之前，请确保已添加并审核相关文档
                      </p>
                    </div>

                    <div class="knowledge-card__stats">
                      <span class="knowledge-card__stats-label">AI Agent 将使用：</span>
                      <span class="knowledge-card__stats-item">
                        <AgentIcon name="file" :size="16" />
                        {{ knowledgeDocCount }} 篇知识库文档
                      </span>
                    </div>

                    <button
                      type="button"
                      class="agent-btn agent-btn--ghost knowledge-card__action"
                      @click="emit('nav-change', 'doc-knowledge')"
                    >
                      管理知识库 →
                    </button>
                  </div>
                </template>

                <template v-else-if="card.key === 'answering-unsupported'">
                  <div class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">AI 无法回复</span>
                      <span class="form-row__desc">当访客发送图片、文件、视频等多媒体内容，或涉及敏感信息、超出 AI 能力范围时，自动展示此提示文案</span>
                    </div>
                    <div class="form-row__control">
                      <textarea
                        v-model="unsupportedQuestionMessage"
                        class="agent-input form-row__textarea"
                        :class="{ 'agent-input--error': unsupportedMessageTouched && !unsupportedQuestionMessage.trim() }"
                        rows="4"
                        maxlength="2000"
                        placeholder="请输入"
                        @blur="unsupportedMessageTouched = true"
                      />
                      <p v-if="unsupportedMessageTouched && !unsupportedQuestionMessage.trim()" class="form-row__error">请输入回复内容</p>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'fallback-transfer'">
                  <div class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">允许转接人工客服</span>
                      <span class="form-row__desc">开启后，AI Agent 在无法解决问题时会将会话移交给人工客服</span>
                    </div>
                    <div class="form-row__control">
                      <label class="agent-switch">
                        <input v-model="transferEnabled" type="checkbox" class="agent-switch__input" />
                        <span class="agent-switch__track" />
                      </label>
                    </div>
                  </div>

                  <template v-if="transferEnabled">
                    <div class="setting-helper-stack">
                      <div class="setting-callout setting-callout--soft">
                        <p class="setting-callout__text">如果你更新以下文案，系统会自动同步翻译为其他已支持的语言版本</p>
                      </div>
                    </div>

                    <div class="form-row form-row--single">
                      <div class="form-row__label">
                        <span class="form-row__name">转接人工提示</span>
                        <span class="form-row__desc">当 AI Agent 准备把会话移交给人工客服时，向访客展示的提示文案</span>
                      </div>
                      <div class="form-row__control">
                        <textarea
                          v-model="transferMessage"
                          class="agent-input form-row__textarea"
                          :class="{ 'agent-input--error': transferMessageTouched && !transferMessage.trim() }"
                          rows="4"
                          maxlength="2000"
                          placeholder="请输入"
                          @blur="transferMessageTouched = true"
                        />
                        <p v-if="transferMessageTouched && !transferMessage.trim()" class="form-row__error">请输入回复内容</p>
                      </div>
                    </div>

                    <div class="form-row form-row--single">
                      <div class="form-row__label">
                        <span class="form-row__name">客服离线提示</span>
                        <span class="form-row__desc">当人工客服团队暂时离线时，向访客说明当前服务状态</span>
                      </div>
                      <div class="form-row__control">
                        <textarea
                          v-model="offlineMessage"
                          class="agent-input form-row__textarea"
                          :class="{ 'agent-input--error': offlineMessageTouched && !offlineMessage.trim() }"
                          rows="4"
                          maxlength="2000"
                          placeholder="请输入"
                          @blur="offlineMessageTouched = true"
                        />
                        <p v-if="offlineMessageTouched && !offlineMessage.trim()" class="form-row__error">请输入回复内容</p>
                      </div>
                    </div>
                  </template>

                  <div v-else class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">人工客服关闭提示</span>
                      <span class="form-row__desc">未开启人工转接时，访客请求转人工将看到此提示</span>
                    </div>
                    <div class="form-row__control">
                      <textarea
                        v-model="offlineMessage"
                        class="agent-input form-row__textarea"
                        :class="{ 'agent-input--error': offlineMessageTouched && !offlineMessage.trim() }"
                        rows="4"
                        maxlength="2000"
                        placeholder="请输入"
                        @blur="offlineMessageTouched = true"
                      />
                      <p v-if="offlineMessageTouched && !offlineMessage.trim()" class="form-row__error">请输入回复内容</p>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'idle-followup'">
                  <div class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">发送跟进消息</span>
                      <span class="form-row__desc">当访客 5 分钟未回复时，AI 自动发送一条跟进消息，尝试挽回会话</span>
                    </div>
                    <div class="form-row__control">
                      <label class="agent-switch">
                        <input v-model="followUpEnabled" type="checkbox" class="agent-switch__input" />
                        <span class="agent-switch__track" />
                      </label>
                    </div>
                  </div>

                  <div v-if="followUpEnabled" class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">跟进消息内容</span>
                      <span class="form-row__desc">自定义跟进消息的文案，引导访客继续对话或留下联系方式</span>
                    </div>
                    <div class="form-row__control">
                      <textarea
                        v-model="followUpMessage"
                        class="agent-input form-row__textarea"
                        :class="{ 'agent-input--error': followUpMessageTouched && !followUpMessage.trim() }"
                        rows="4"
                        maxlength="2000"
                        placeholder="请输入跟进消息内容"
                        @blur="followUpMessageTouched = true"
                      />
                      <p v-if="followUpMessageTouched && !followUpMessage.trim()" class="form-row__error">请输入跟进消息内容</p>
                    </div>
                  </div>
                </template>

                <template v-else-if="card.key === 'idle-autoclose'">
                  <div class="setting-helper-stack">
                    <div class="setting-callout setting-callout--soft">
                      <p class="setting-callout__text">若开启跟进消息，空闲计时将从跟进消息发送后开始计算</p>
                    </div>
                  </div>

                  <div class="form-row form-row--single">
                    <div class="form-row__label">
                      <span class="form-row__name">自动关闭空闲会话</span>
                      <span class="form-row__desc">避免访客长时间未响应时持续占用会话</span>
                    </div>
                    <div class="form-row__control">
                      <div class="inactive-setting">
                        <span class="inactive-setting__text">当访客超过</span>
                        <input v-model.number="idleHours" type="number" class="agent-input inactive-setting__input" min="0" />
                        <span class="inactive-setting__unit-label">时</span>
                        <input v-model.number="idleMinutes" type="number" class="agent-input inactive-setting__input" min="0" max="59" />
                        <span class="inactive-setting__unit-label">分</span>
                        <input v-model.number="idleSeconds" type="number" class="agent-input inactive-setting__input" min="0" max="59" />
                        <span class="inactive-setting__unit-label">秒</span>
                        <span class="inactive-setting__text">未操作时，自动关闭会话</span>
                      </div>
                    </div>
                  </div>
                </template>

              </div>
            </article>
          </div>
        </section>
      </div>

      <div v-else-if="configTab === 'settings'" class="settings-panel">
        <div class="settings-section agent-panel">
          <h3 class="settings-section__title">身份信息</h3>
          <p class="settings-section__desc">配置 AI Agent 的外在形象和身份描述</p>

          <div class="settings-form">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">头像</span>
                <span class="form-row__desc">设置 AI Agent 的头像形象，用于会话列表和消息头像展示</span>
              </div>
              <div class="form-row__control form-row__control--stack">
                <div class="bot-avatar-upload">
                  <div class="bot-avatar-upload__preview" :class="{ 'bot-avatar-upload__preview--image': Boolean(botAvatarUrl) }">
                    <img v-if="botAvatarUrl" :src="botAvatarUrl" alt="AI Agent 头像" class="bot-avatar-upload__image" />
                    <span v-else class="bot-avatar-upload__fallback">{{ avatarFallbackText }}</span>
                  </div>
                  <div class="bot-avatar-upload__actions">
                    <button type="button" class="agent-btn agent-btn--ghost" @click="triggerBotAvatarSelect">
                      {{ botAvatarUrl ? '重新上传' : '上传头像' }}
                    </button>
                  </div>
                  <input
                    ref="avatarInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    class="bot-avatar-upload__input"
                    @change="handleAvatarFileChange"
                  />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">昵称</span>
                <span class="form-row__desc">当访客询问"你是谁"时，AI Agent 会优先使用这个身份名称</span>
              </div>
              <div class="form-row__control">
                <input
                  v-model="botName"
                  class="agent-input"
                  :class="{ 'agent-input--error': botNameTouched && !botName.trim() }"
                  maxlength="64"
                  placeholder="请输入昵称"
                  @blur="botNameTouched = true"
                />
                <p v-if="botNameTouched && !botName.trim()" class="form-row__error">请输入昵称</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">业务简介</span>
                <span class="form-row__desc">描述你的业务和服务范围，AI 会据此生成更贴合场景的回答</span>
              </div>
              <div class="form-row__control">
                <textarea
                  v-model="botIntro"
                  class="agent-input form-row__textarea"
                  rows="5"
                  maxlength="2000"
                  placeholder="请输入"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section agent-panel">
          <h3 class="settings-section__title">回复风格</h3>
          <p class="settings-section__desc">统一 AI Agent 的表达风格和语言偏好</p>

          <div class="settings-form">
            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">回复语气</span>
                <span class="form-row__desc">统一 AI Agent 的表达风格，保证对外沟通体验一致</span>
              </div>
              <div class="form-row__control">
                <div class="bot-chips-group">
                  <button
                    v-for="tone in toneOptions"
                    :key="tone.value"
                    type="button"
                    class="bot-chip"
                    :class="{ 'bot-chip--active': selectedTone === tone.value }"
                    @click="selectedTone = tone.value"
                  >{{ tone.label }}</button>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__label">
                <span class="form-row__name">默认语言</span>
                <span class="form-row__desc">当系统无法判断访客语言时，将优先使用该语言回复</span>
              </div>
              <div class="form-row__control">
                <select v-model="defaultLanguage" class="agent-input">
                  <option
                    v-for="language in languageOptions"
                    :key="language.value"
                    :value="language.value"
                  >{{ language.label }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-agent-page__footer">
        <button
          type="button"
          class="agent-btn agent-btn--primary"
          @click="saveAllChanges"
        >
          保存
        </button>
      </div>

    </template>

    <!-- 原有的占位页面 -->
    <section v-else class="ai-agent-page__placeholder agent-panel">
      <h2 class="agent-settings-feature-title">{{ activeSectionLabel }}</h2>
      <p class="agent-settings-feature-description">
        {{ activeKey === "doc-knowledge" ? "文档知识管理页面建设中。" : "常见问题管理页面建设中。" }}
      </p>
      <button type="button" class="agent-btn agent-btn--ghost" @click="emitToast('功能开发中')">了解更多</button>
    </section>
    <UnsavedChangesModal :open="unsavedChangesModalOpen" @cancel="cancelPendingNavigation" @confirm="confirmPendingNavigation" />

    <BaseModal :open="cropModalOpen" title="图片裁剪" max-width="580px" @close="closeCropModal">
      <div v-if="cropState.imageSrc" class="avatar-crop-modal">
        <p class="avatar-crop-modal__hint">拖动图片调整头像显示区域</p>
        <div
          class="avatar-crop-canvas"
          :class="{ 'avatar-crop-canvas--dragging': cropDragging }"
          @mousedown.prevent="startCropDrag"
          @mousemove.prevent="handleCropDrag"
          @mouseup="endCropDrag"
          @mouseleave="endCropDrag"
        >
          <img :src="cropState.imageSrc" alt="头像裁剪预览" :style="cropImageStyle" draggable="false" />
        </div>
      </div>
      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click="closeCropModal">取消</button>
          <button type="button" class="agent-btn agent-btn--primary" @click="confirmCropImage">确定</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { AgentIcon, BaseModal, CopilotPromoBanner, CopilotSettingItem, UnsavedChangesModal } from "@twt/ui-agent";
import {
  type StoredAiAgentSettings,
  loadStoredAiAgentSettings,
  persistStoredAiAgentSettings
} from "../lib/aiAgentSettings";

type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings" | "ai-agent-config";

type AudienceType = "all" | "visitor" | "customer";
type LifecycleSectionKey = "entry" | "answering" | "fallback" | "idle";
type LifecycleCardKey =
  | "entry-routing"
  | "entry-visibility"
  | "identity-profile"
  | "identity-style"
  | "answering-mode"
  | "answering-knowledge"
  | "answering-unsupported"
  | "fallback-transfer"
  | "idle-autoclose"
  | "idle-followup";

interface CopilotSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface CropState {
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  offsetX: number;
  offsetY: number;
}

interface LifecycleCard {
  key: LifecycleCardKey;
  title: string;
  summary: string;
  badge?: string;
  badgeTone?: "warning" | "default";
}

interface LifecycleSection {
  key: LifecycleSectionKey;
  title: string;
  icon: "customer" | "ai-agent" | "service" | "calendar";
  cards: LifecycleCard[];
}

const lifecycleCardKeys: LifecycleCardKey[] = [
  "entry-routing",
  "entry-visibility",
  "identity-profile",
  "identity-style",
  "answering-mode",
  "answering-knowledge",
  "answering-unsupported",
  "fallback-transfer",
  "idle-followup",
  "idle-autoclose"
];

const lifecycleCardFieldMap: Record<LifecycleCardKey, Array<keyof StoredAiAgentSettings>> = {
  "entry-routing": ["visitorAudience", "agentResponseMode"],
  "entry-visibility": ["showMessageAgentLabel"],
  "identity-profile": ["botAvatarUrl", "botName", "botIntro"],
  "identity-style": ["selectedTone", "defaultLanguage"],
  "answering-mode": ["replyMode"],
  "answering-knowledge": [],
  "answering-unsupported": ["unsupportedQuestionMessage"],
  "fallback-transfer": ["transferEnabled", "transferMessage", "offlineMessage"],
  "idle-followup": ["followUpEnabled", "followUpMessage"],
  "idle-autoclose": ["idleHours", "idleMinutes", "idleSeconds"]
};

const props = defineProps<{
  activeKey: AiAgentNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "dirty-change", dirty: boolean): void;
  (e: "nav-change", key: string): void;
}>();

const AVATAR_CROP_SIZE = 240;
const AVATAR_CROP_DRAG_SCALE = 1.1;
const AVATAR_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const createEmptyCropState = (): CropState => ({
  imageSrc: "",
  naturalWidth: 0,
  naturalHeight: 0,
  offsetX: 0,
  offsetY: 0
});

type ConfigTab = "deploy" | "settings";

const showBanner = ref(true);
const configTab = ref<ConfigTab>("deploy");
const openLifecycleCard = ref<LifecycleCardKey | null>(null);
const agentEnabled = ref(true);

const copilotSettings = ref<CopilotSetting[]>([
  { key: "auto-suggest", title: "自动推荐回复", description: "针对访客咨询，自动生成推荐回复。", enabled: true },
  { key: "chat-translation", title: "聊天翻译", description: "访客发送的消息将被自动翻译。", enabled: true },
  { key: "side-translation", title: "边写边译", description: "客服发送的消息将被自动翻译。", enabled: true },
  {
    key: "text-polish",
    title: "文本润色",
    description: "借助 AI 优化客服回复内容，支持润色、丰富内容、精简内容等。",
    enabled: true
  }
]);

const botAvatarUrl = ref("");
const botName = ref("AI Agent");
const botIntro = ref("");
const selectedTone = ref("friendly");
const defaultLanguage = ref("en");
const toneOptions = [
  { value: "friendly", label: "友好亲切" },
  { value: "professional", label: "专业严谨" },
  { value: "humorous", label: "幽默活泼" },
  { value: "concise", label: "简洁高效" }
];
const languageOptions = [
  { value: "en", label: "英语" },
  { value: "es", label: "西班牙语" },
  { value: "fr", label: "法语" },
  { value: "de", label: "德语" },
  { value: "pt", label: "葡萄牙语" },
  { value: "ru", label: "俄语" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁体中文" },
  { value: "ja", label: "日语" },
  { value: "ko", label: "韩语" },
  { value: "vi", label: "越南语" },
  { value: "th", label: "泰语" },
  { value: "id", label: "印尼语" },
  { value: "ms", label: "马利西亚语" }
];

const audienceOptions: Array<{ label: string; value: AudienceType }> = [
  { label: "全部", value: "all" },
  { label: "访客", value: "visitor" },
  { label: "客户", value: "customer" }
];

const audienceLabelMap: Record<AudienceType, string> = {
  all: "全部",
  visitor: "访客",
  customer: "客户"
};

const responseModeLabelMap: Record<string, string> = {
  always: "始终由 AI Agent 回复",
  "offline-only": "仅客服离线时由 AI 回复"
};

const replyModeLabelMap: Record<string, string> = {
  strict: "严格模式",
  creative: "发散模式"
};

const agentResponseMode = ref("always");
const visitorAudience = ref<AudienceType>("all");
const showMessageAgentLabel = ref(true);
const visitorInactiveMinutes = ref(10);
const idleHours = ref(0);
const idleMinutes = ref(10);
const idleSeconds = ref(0);
const followUpEnabled = ref(false);
const followUpMessage = ref("您好，请问还有什么可以帮您的吗？如果没有其他问题，会话将在稍后自动关闭。");
const followUpMessageTouched = ref(false);
const replyMode = ref("strict");
const transferEnabled = ref(false);
const offlineMessage = ref("当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。");
const transferMessage = ref("正在为您转接人工客服，请稍候，马上为您接入。");
const unsupportedQuestionMessage = ref("抱歉，这个问题我暂时还无法准确处理。您可以换一种说法继续提问，或直接转接人工客服获得帮助。");

const knowledgeDocCount = ref(3);

const avatarInputRef = ref<HTMLInputElement | null>(null);
const cropModalOpen = ref(false);
const cropDragging = ref(false);
const cropDragStart = ref({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
const cropState = ref<CropState>(createEmptyCropState());
const unsavedChangesModalOpen = ref(false);
const pendingNavigationAction = ref<(() => void) | null>(null);
const initializing = ref(true);
const botNameTouched = ref(false);
const transferMessageTouched = ref(false);
const offlineMessageTouched = ref(false);
const unsupportedMessageTouched = ref(false);

const emitToast = (message: string) => {
  emit("toast", message);
};

const activeSectionLabel = computed(() => {
  if (props.activeKey === "doc-knowledge") return "文档知识";
  if (props.activeKey === "faq") return "常见问题";
  return "Copilot设置";
});

const avatarFallbackText = computed(() => "🤖");

const idleSummaryText = computed(() => {
  const parts: string[] = [];
  if (idleHours.value > 0) parts.push(`${idleHours.value} 时`);
  if (idleMinutes.value > 0) parts.push(`${idleMinutes.value} 分`);
  if (idleSeconds.value > 0) parts.push(`${idleSeconds.value} 秒`);
  return parts.length > 0 ? `${parts.join(" ")}后自动关闭会话` : "0 秒后自动关闭会话";
});

const getToneLabel = (tone: string) => toneOptions.find((item) => item.value === tone)?.label ?? toneOptions[0].label;

const getLanguageLabel = (languageCode: string) => languageOptions.find((item) => item.value === languageCode)?.label ?? languageCode;

const resolveAudienceType = (value: unknown): AudienceType => {
  if (value === "visitor" || value === "customer") {
    return value;
  }

  return "all";
};

const normalizeInactiveMinutes = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 10;
  }

  return Math.min(1440, Math.max(1, Math.round(numericValue)));
};

const lifecycleSections = computed<LifecycleSection[]>(() => {
  const hasIntro = botIntro.value.trim().length > 0;
  const hasUnsupportedReply = unsupportedQuestionMessage.value.trim().length > 0;
  const hasTransferReply = transferMessage.value.trim().length > 0;
  const hasOfflineReply = offlineMessage.value.trim().length > 0;
  const botLabel = botName.value.trim() || "未设置昵称";

  return [
    {
      key: "entry",
      title: "当访客发送第一条消息",
      icon: "customer",
      cards: [
        {
          key: "entry-routing",
          title: "AI 接待哪些访客",
          summary: `${audienceLabelMap[visitorAudience.value]} · ${responseModeLabelMap[agentResponseMode.value] ?? responseModeLabelMap.always}`
        },
        {
          key: "entry-visibility",
          title: "在消息中显示 AI Agent 标签",
          summary: showMessageAgentLabel.value ? "显示 AI Agent 标签" : "不显示 AI Agent 标签"
        }
      ]
    },
    {
      key: "answering",
      title: "当 AI 回复访客",
      icon: "ai-agent",
      cards: [
        {
          key: "identity-profile",
          title: "AI 如何介绍自己",
          summary: `${botLabel} · ${hasIntro ? "已设置业务简介" : "未设置业务简介"}`,
          badge: botName.value.trim() ? undefined : "需要补充",
          badgeTone: botName.value.trim() ? undefined : "warning"
        },
        {
          key: "identity-style",
          title: "AI 使用什么语气和语言",
          summary: `${getToneLabel(selectedTone.value)} · ${getLanguageLabel(defaultLanguage.value)}`
        },
        {
          key: "answering-mode",
          title: "AI 如何组织回答",
          summary: replyModeLabelMap[replyMode.value] ?? replyModeLabelMap.strict
        },
        {
          key: "answering-knowledge",
          title: "AI 知识库",
          summary: `已关联 ${knowledgeDocCount.value} 篇知识库文档`
        }
      ]
    },
    {
      key: "fallback",
      title: "当 AI 无法解决会话",
      icon: "service",
      cards: [
        {
          key: "answering-unsupported",
          title: "AI 无法回复",
          summary: hasUnsupportedReply ? "已设置兜底回复文案" : "需要补充回复文案",
          badge: hasUnsupportedReply ? undefined : "需要补充",
          badgeTone: hasUnsupportedReply ? undefined : "warning"
        },
        {
          key: "fallback-transfer",
          title: "转接人工客服",
          summary: transferEnabled.value
            ? (hasTransferReply ? "已开启 · 已设置转人工提示" : "已开启 · 需要补充转人工文案")
            : (hasOfflineReply ? "未开启 · 已设置离线提示" : "未开启 · 需要补充离线文案"),
          badge: (transferEnabled.value && !hasTransferReply) || !hasOfflineReply ? "需要补充" : undefined,
          badgeTone: (transferEnabled.value && !hasTransferReply) || !hasOfflineReply ? "warning" : undefined
        }
      ]
    },
    {
      key: "idle",
      title: "访客不活跃",
      icon: "calendar",
      cards: [
        {
          key: "idle-followup",
          title: "不活跃时跟进",
          summary: followUpEnabled.value ? "已开启 · 5 分钟后发送跟进消息" : "未开启"
        },
        {
          key: "idle-autoclose",
          title: "自动关闭空闲会话",
          summary: idleSummaryText.value
        }
      ]
    }
  ];
});

const deployLifecycleSections = computed<LifecycleSection[]>(() =>
  lifecycleSections.value.map((section) => {
    if (section.key !== "answering") return section;
    return {
      ...section,
      cards: section.cards.filter((c) => c.key !== "identity-profile" && c.key !== "identity-style")
    };
  })
);

const getCurrentSettings = (): StoredAiAgentSettings => ({
  agentEnabled: agentEnabled.value,
  agentResponseMode: agentResponseMode.value,
  visitorAudience: visitorAudience.value,
  showMessageAgentLabel: showMessageAgentLabel.value,
  botAvatarUrl: botAvatarUrl.value,
  botName: botName.value,
  botIntro: botIntro.value,
  selectedTone: selectedTone.value,
  defaultLanguage: defaultLanguage.value,
  visitorInactiveMinutes: visitorInactiveMinutes.value,
  idleHours: idleHours.value,
  idleMinutes: idleMinutes.value,
  idleSeconds: idleSeconds.value,
  followUpEnabled: followUpEnabled.value,
  followUpMessage: followUpMessage.value,
  replyMode: replyMode.value,
  transferEnabled: transferEnabled.value,
  offlineMessage: offlineMessage.value,
  transferMessage: transferMessage.value,
  unsupportedQuestionMessage: unsupportedQuestionMessage.value
});

const getSavedSettings = (): StoredAiAgentSettings => {
  try {
    return JSON.parse(savedSnapshot.value) as StoredAiAgentSettings;
  } catch {
    return getCurrentSettings();
  }
};

const getConfigSnapshot = () => JSON.stringify(getCurrentSettings());

const savedSnapshot = ref(getConfigSnapshot());

const hasUnsavedChanges = computed(() => !initializing.value && getConfigSnapshot() !== savedSnapshot.value);

const persistAgentSettings = () => {
  persistStoredAiAgentSettings(getCurrentSettings());
};

const loadAgentSettings = () => {
  const settings = loadStoredAiAgentSettings();

  if (typeof settings.agentEnabled === "boolean") agentEnabled.value = settings.agentEnabled;
  if (typeof settings.agentResponseMode === "string") agentResponseMode.value = settings.agentResponseMode;
  if (typeof settings.visitorAudience === "string") visitorAudience.value = resolveAudienceType(settings.visitorAudience);
  if (typeof settings.showMessageAgentLabel === "boolean") showMessageAgentLabel.value = settings.showMessageAgentLabel;
  if (typeof settings.botAvatarUrl === "string") botAvatarUrl.value = settings.botAvatarUrl;
  if (typeof settings.botName === "string") botName.value = settings.botName;
  if (typeof settings.botIntro === "string") botIntro.value = settings.botIntro;
  if (typeof settings.selectedTone === "string") selectedTone.value = settings.selectedTone;
  if (typeof settings.defaultLanguage === "string") defaultLanguage.value = settings.defaultLanguage;
  if (typeof settings.visitorInactiveMinutes === "number") {
    visitorInactiveMinutes.value = settings.visitorInactiveMinutes;
  } else if (typeof settings.visitorInactiveHours === "number") {
    visitorInactiveMinutes.value = settings.visitorInactiveHours * 60;
  }
  if (typeof settings.idleHours === "number") idleHours.value = settings.idleHours;
  if (typeof settings.idleMinutes === "number") idleMinutes.value = settings.idleMinutes;
  if (typeof settings.idleSeconds === "number") idleSeconds.value = settings.idleSeconds;
  if (typeof settings.followUpEnabled === "boolean") followUpEnabled.value = settings.followUpEnabled;
  if (typeof settings.followUpMessage === "string") followUpMessage.value = settings.followUpMessage;
  if (typeof settings.replyMode === "string") replyMode.value = settings.replyMode;
  if (typeof settings.transferEnabled === "boolean") transferEnabled.value = settings.transferEnabled;
  if (typeof settings.offlineMessage === "string") offlineMessage.value = settings.offlineMessage;
  if (typeof settings.transferMessage === "string") transferMessage.value = settings.transferMessage;
  if (typeof settings.unsupportedQuestionMessage === "string") {
    unsupportedQuestionMessage.value = settings.unsupportedQuestionMessage;
  }
};

const restoreSavedSnapshot = () => {
  try {
    const settings = JSON.parse(savedSnapshot.value) as StoredAiAgentSettings;

    agentEnabled.value = Boolean(settings.agentEnabled);
    agentResponseMode.value = settings.agentResponseMode ?? "always";
    visitorAudience.value = resolveAudienceType(settings.visitorAudience);
    showMessageAgentLabel.value = typeof settings.showMessageAgentLabel === "boolean" ? settings.showMessageAgentLabel : true;
    botAvatarUrl.value = settings.botAvatarUrl ?? "";
    botName.value = settings.botName ?? "AI Agent";
    botIntro.value = settings.botIntro ?? "";
    selectedTone.value = settings.selectedTone ?? "friendly";
    defaultLanguage.value = settings.defaultLanguage ?? "en";
    visitorInactiveMinutes.value = typeof settings.visitorInactiveMinutes === "number" ? settings.visitorInactiveMinutes : 10;
    idleHours.value = typeof settings.idleHours === "number" ? settings.idleHours : 0;
    idleMinutes.value = typeof settings.idleMinutes === "number" ? settings.idleMinutes : 10;
    idleSeconds.value = typeof settings.idleSeconds === "number" ? settings.idleSeconds : 0;
    followUpEnabled.value = typeof settings.followUpEnabled === "boolean" ? settings.followUpEnabled : false;
    followUpMessage.value = settings.followUpMessage ?? "您好，请问还有什么可以帮您的吗？如果没有其他问题，会话将在稍后自动关闭。";
    followUpMessageTouched.value = false;
    replyMode.value = settings.replyMode ?? "strict";
    transferEnabled.value = typeof settings.transferEnabled === "boolean" ? settings.transferEnabled : false;
    offlineMessage.value = settings.offlineMessage ?? "当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。";
    transferMessage.value = settings.transferMessage ?? "正在为您转接人工客服，请稍候，马上为您接入。";
    unsupportedQuestionMessage.value =
      settings.unsupportedQuestionMessage ??
      "抱歉，这个问题我暂时还无法准确处理。您可以换一种说法继续提问，或直接转接人工客服获得帮助。";
  } catch {}
};

const markSnapshotSaved = () => {
  persistAgentSettings();
  savedSnapshot.value = getConfigSnapshot();
  emit("dirty-change", false);
};

const launchActionLabel = computed(() => (agentEnabled.value ? "暂停 AI Agent" : "开启 AI Agent"));

const toggleLifecycleCard = (key: LifecycleCardKey) => {
  openLifecycleCard.value = openLifecycleCard.value === key ? null : key;
};

const cardHasChanges = (cardKey: LifecycleCardKey) => {
  const currentSettings = getCurrentSettings();
  const savedSettings = getSavedSettings();
  return lifecycleCardFieldMap[cardKey].some((field) => currentSettings[field] !== savedSettings[field]);
};

const firstDirtyCard = computed<LifecycleCardKey | null>(() => lifecycleCardKeys.find((cardKey) => cardHasChanges(cardKey)) ?? null);

const applyCardSettings = (cardKey: LifecycleCardKey, settings: StoredAiAgentSettings) => {
  switch (cardKey) {
    case "entry-routing":
      agentResponseMode.value = settings.agentResponseMode ?? "always";
      visitorAudience.value = resolveAudienceType(settings.visitorAudience);
      break;
    case "entry-visibility":
      showMessageAgentLabel.value = typeof settings.showMessageAgentLabel === "boolean" ? settings.showMessageAgentLabel : true;
      break;
    case "identity-profile":
      botAvatarUrl.value = settings.botAvatarUrl ?? "";
      botName.value = settings.botName ?? "AI Agent";
      botIntro.value = settings.botIntro ?? "";
      botNameTouched.value = false;
      break;
    case "identity-style":
      selectedTone.value = settings.selectedTone ?? "friendly";
      defaultLanguage.value = settings.defaultLanguage ?? "en";
      break;
    case "answering-mode":
      replyMode.value = settings.replyMode ?? "strict";
      break;
    case "answering-unsupported":
      unsupportedQuestionMessage.value =
        settings.unsupportedQuestionMessage ??
        "抱歉，这个问题我暂时还无法准确处理。您可以换一种说法继续提问，或直接转接人工客服获得帮助。";
      unsupportedMessageTouched.value = false;
      break;
    case "fallback-transfer":
      transferEnabled.value = typeof settings.transferEnabled === "boolean" ? settings.transferEnabled : false;
      transferMessage.value = settings.transferMessage ?? "正在为您转接人工客服，请稍候，马上为您接入。";
      transferMessageTouched.value = false;
      offlineMessage.value = settings.offlineMessage ?? "当前客服暂时不在线。你可以先留下问题或联系方式，我们会尽快与您联系。";
      offlineMessageTouched.value = false;
      break;
    case "idle-followup":
      followUpEnabled.value = typeof settings.followUpEnabled === "boolean" ? settings.followUpEnabled : false;
      followUpMessage.value = settings.followUpMessage ?? "您好，请问还有什么可以帮您的吗？如果没有其他问题，会话将在稍后自动关闭。";
      followUpMessageTouched.value = false;
      break;
    case "idle-autoclose":
      idleHours.value = typeof settings.idleHours === "number" ? settings.idleHours : 0;
      idleMinutes.value = typeof settings.idleMinutes === "number" ? settings.idleMinutes : 10;
      idleSeconds.value = typeof settings.idleSeconds === "number" ? settings.idleSeconds : 0;
      break;
  }
};

const validateCard = (cardKey: LifecycleCardKey) => {
  if (cardKey === "identity-profile") {
    botNameTouched.value = true;
    return botName.value.trim().length > 0;
  }

  if (cardKey === "answering-unsupported") {
    unsupportedMessageTouched.value = true;
    return unsupportedQuestionMessage.value.trim().length > 0;
  }

  if (cardKey === "fallback-transfer") {
    if (transferEnabled.value) {
      transferMessageTouched.value = true;
      if (!transferMessage.value.trim()) return false;
      offlineMessageTouched.value = true;
      return offlineMessage.value.trim().length > 0;
    }
    offlineMessageTouched.value = true;
    return offlineMessage.value.trim().length > 0;
  }

  if (cardKey === "idle-followup") {
    if (followUpEnabled.value) {
      followUpMessageTouched.value = true;
      return followUpMessage.value.trim().length > 0;
    }
  }

  if (cardKey === "idle-autoclose") {
    idleHours.value = Math.max(0, Math.round(Number(idleHours.value) || 0));
    idleMinutes.value = Math.max(0, Math.min(59, Math.round(Number(idleMinutes.value) || 0)));
    idleSeconds.value = Math.max(0, Math.min(59, Math.round(Number(idleSeconds.value) || 0)));
  }

  return true;
};

const saveCardChanges = (cardKey: LifecycleCardKey) => {
  if (!validateCard(cardKey)) {
    openLifecycleCard.value = cardKey;
    emitToast("请先完善当前卡片中的必填项");
    return;
  }

  markSnapshotSaved();
  emitToast("当前配置已保存");
};

const cancelCardChanges = (cardKey: LifecycleCardKey) => {
  applyCardSettings(cardKey, getSavedSettings());
  emitToast("已取消当前卡片的修改");
};

const saveAllChanges = () => {
  for (const cardKey of lifecycleCardKeys) {
    if (cardHasChanges(cardKey) && !validateCard(cardKey)) {
      openLifecycleCard.value = cardKey;
      emitToast("请先完善必填项");
      return;
    }
  }
  markSnapshotSaved();
  emitToast("配置已保存");
};

const restoreAndNotify = () => {
  restoreSavedSnapshot();
  emitToast("已取消所有修改");
};

const handleInactiveMinutesBlur = () => {
  visitorInactiveMinutes.value = normalizeInactiveMinutes(visitorInactiveMinutes.value);
};

const toggleAgentLiveStatus = () => {
  if (hasUnsavedChanges.value) {
    if (firstDirtyCard.value) {
      openLifecycleCard.value = firstDirtyCard.value;
    }
    emitToast("请先保存或取消当前更改");
    return;
  }

  agentEnabled.value = !agentEnabled.value;
  markSnapshotSaved();
  emitToast(agentEnabled.value ? "AI Agent 已开启" : "AI Agent 已暂停");
};

const updateCopilotSetting = (key: string, next: boolean) => {
  copilotSettings.value = copilotSettings.value.map((item) => {
    if (item.key !== key) return item;
    return { ...item, enabled: next };
  });
  emit("toast", next ? "设置已开启" : "设置已关闭");
};

const triggerBotAvatarSelect = () => {
  avatarInputRef.value?.click();
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

const loadImageMeta = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

const getCropDrawMetrics = () => {
  const { naturalWidth, naturalHeight, offsetX, offsetY } = cropState.value;
  if (!naturalWidth || !naturalHeight) {
    return {
      drawWidth: 0,
      drawHeight: 0,
      left: 0,
      top: 0,
      maxOffsetX: 0,
      maxOffsetY: 0
    };
  }

  const baseScale = Math.max(AVATAR_CROP_SIZE / naturalWidth, AVATAR_CROP_SIZE / naturalHeight);
  const drawWidth = naturalWidth * baseScale * AVATAR_CROP_DRAG_SCALE;
  const drawHeight = naturalHeight * baseScale * AVATAR_CROP_DRAG_SCALE;
  const maxOffsetX = Math.max(0, (drawWidth - AVATAR_CROP_SIZE) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - AVATAR_CROP_SIZE) / 2);
  const clampedOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
  const clampedOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
  const left = AVATAR_CROP_SIZE / 2 - drawWidth / 2 + clampedOffsetX;
  const top = AVATAR_CROP_SIZE / 2 - drawHeight / 2 + clampedOffsetY;

  return {
    drawWidth,
    drawHeight,
    left,
    top,
    maxOffsetX,
    maxOffsetY
  };
};

const cropImageStyle = computed(() => {
  const { drawWidth, drawHeight, left, top } = getCropDrawMetrics();
  return {
    width: `${drawWidth}px`,
    height: `${drawHeight}px`,
    left: `${left}px`,
    top: `${top}px`
  };
});

const clampCropOffset = () => {
  const { maxOffsetX, maxOffsetY } = getCropDrawMetrics();
  cropState.value.offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, cropState.value.offsetX));
  cropState.value.offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, cropState.value.offsetY));
};

const openCropModalWithSource = async (source: string) => {
  try {
    const meta = await loadImageMeta(source);
    cropState.value = {
      imageSrc: source,
      naturalWidth: meta.width,
      naturalHeight: meta.height,
      offsetX: 0,
      offsetY: 0
    };
    cropModalOpen.value = true;
  } catch {
    emitToast("图片解析失败，请重试");
  }
};

const closeCropModal = () => {
  cropModalOpen.value = false;
  cropDragging.value = false;
  cropState.value = createEmptyCropState();
};

const startCropDrag = (event: MouseEvent) => {
  if (!cropState.value.imageSrc) return;
  cropDragging.value = true;
  cropDragStart.value = {
    x: event.clientX,
    y: event.clientY,
    offsetX: cropState.value.offsetX,
    offsetY: cropState.value.offsetY
  };
};

const handleCropDrag = (event: MouseEvent) => {
  if (!cropDragging.value) return;
  cropState.value.offsetX = cropDragStart.value.offsetX + (event.clientX - cropDragStart.value.x);
  cropState.value.offsetY = cropDragStart.value.offsetY + (event.clientY - cropDragStart.value.y);
  clampCropOffset();
};

const endCropDrag = () => {
  cropDragging.value = false;
};

const confirmCropImage = async () => {
  if (!cropState.value.imageSrc) return;

  try {
    const image = await loadImageElement(cropState.value.imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_CROP_SIZE;
    canvas.height = AVATAR_CROP_SIZE;
    const context = canvas.getContext("2d");
    if (!context) return;

    const { drawWidth, drawHeight, left, top } = getCropDrawMetrics();
    context.drawImage(image, left, top, drawWidth, drawHeight);
    botAvatarUrl.value = canvas.toDataURL("image/png");
    closeCropModal();
  } catch {
    emitToast("头像裁剪失败，请重试");
  }
};

const handleAvatarFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    emitToast("请上传图片文件");
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    emitToast("仅支持 JPG、JPEG、PNG 格式的图片");
    return;
  }

  if (file.size > AVATAR_MAX_SIZE) {
    emitToast("图片大小不能超过 10MB");
    return;
  }

  try {
    const source = await readFileAsDataUrl(file);
    await openCropModalWithSource(source);
  } catch {
    emitToast("头像读取失败，请重试");
  }
};

const requestNavigation = (action: () => void) => {
  if (!hasUnsavedChanges.value) {
    action();
    return true;
  }

  pendingNavigationAction.value = action;
  unsavedChangesModalOpen.value = true;
  return false;
};

const cancelPendingNavigation = () => {
  pendingNavigationAction.value = null;
  unsavedChangesModalOpen.value = false;
};

const confirmPendingNavigation = () => {
  const action = pendingNavigationAction.value;
  restoreSavedSnapshot();
  cancelPendingNavigation();
  action?.();
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!hasUnsavedChanges.value) {
    return;
  }
  event.preventDefault();
  event.returnValue = "";
};

watch(
  hasUnsavedChanges,
  (dirty) => {
    emit("dirty-change", dirty);
  },
  { immediate: true }
);

onMounted(() => {
  loadAgentSettings();
  savedSnapshot.value = getConfigSnapshot();
  initializing.value = false;
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

defineExpose({
  requestNavigation,
  hasUnsavedChanges: () => hasUnsavedChanges.value
});
</script>

<style scoped>
.ai-agent-page {
  align-items: center;
  gap: var(--agent-space-16);
}

.ai-agent-page > * {
  max-width: 1080px;
  width: 100%;
}

.ai-agent-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.ai-agent-page__placeholder {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  justify-content: center;
  min-height: 240px;
  padding: var(--agent-space-24);
}

.agent-config-header {
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.agent-config-header__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--agent-space-8);
  min-width: 0;
}

.agent-config-header__title-row {
  align-items: center;
  display: flex;
  gap: 12px;
}

.agent-config-header__status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 4px 10px;
}

.agent-config-header__status--active {
  background: #e8f7ef;
  color: #137a49;
}

.agent-config-header__status--inactive {
  background: #feecec;
  color: #c53030;
}

.agent-config-header__actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 12px;
}

.config-tabs {
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 0;
}

.config-tabs__item {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 15px;
  font-weight: var(--agent-font-weight-medium);
  padding: 12px 20px;
  transition: color var(--agent-motion-fast), border-color var(--agent-motion-fast);
}

.config-tabs__item:hover {
  color: var(--agent-color-text-primary);
}

.config-tabs__item--active {
  border-bottom-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-20);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-4);
  padding: var(--agent-space-24);
}

.settings-section__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

.settings-section__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.5;
  margin: 0 0 var(--agent-space-16);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
}

.settings-form .form-row + .form-row {
  border-top: 1px solid var(--agent-color-border-default);
  padding-top: var(--agent-space-24);
}

.lifecycle-flow {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.lifecycle-stage {
  padding-left: 56px;
  position: relative;
}

.lifecycle-stage:not(:last-of-type)::before {
  border-left: 1px dashed #d7dbe4;
  bottom: -28px;
  content: "";
  left: 19px;
  position: absolute;
  top: 46px;
}

.lifecycle-stage__header {
  align-items: center;
  display: flex;
  gap: 16px;
  margin: 0 0 16px -56px;
}

.lifecycle-stage__badge {
  align-items: center;
  border-radius: 12px;
  color: #18212f;
  display: inline-flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.lifecycle-stage__badge--entry {
  background: #fee07c;
}

.lifecycle-stage__badge--answering {
  background: #1f1f1f;
  color: #ffffff;
}

.lifecycle-stage__badge--fallback {
  background: #bfead7;
}

.lifecycle-stage__badge--idle {
  background: #bfead7;
}

.lifecycle-stage__title {
  color: var(--agent-color-text-primary);
  font-size: 18px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1.45;
  margin: 0;
}

.lifecycle-stage__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-card {
  overflow: hidden;
  padding: 0;
  transition: border-color var(--agent-motion-fast) ease, box-shadow var(--agent-motion-fast) ease;
}

.config-card--open {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.06);
}

.config-card__trigger {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  min-height: 80px;
  padding: 0 24px;
  text-align: left;
  width: 100%;
}

.config-card__heading {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.config-card__title {
  color: var(--agent-color-text-primary);
  font-size: 16px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1.5;
  margin: 0;
}

.config-card__summary {
  color: var(--agent-color-text-tertiary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.config-card__status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 6px 12px;
}

.config-card__status--default {
  background: #eef2f8;
  color: var(--agent-color-text-secondary);
}

.config-card__status--warning {
  background: #f8e7a7;
  color: #4f3a00;
}

.config-card__chevron {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
}

.config-card__body {
  border-top: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-24);
  padding: 24px;
}

.ai-agent-page__footer {
  display: flex;
  justify-content: flex-start;
  padding-top: var(--agent-space-20);
}

.setting-helper-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-callout {
  background: #f8e7a7;
  border-radius: 12px;
  padding: 12px 14px;
}

.setting-callout--soft {
  background: #eef4ff;
}

.setting-callout__text {
  color: #4f3a00;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1.6;
  margin: 0;
}

.setting-callout--soft .setting-callout__text {
  color: #20478a;
}

.knowledge-card {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.knowledge-card__desc {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.knowledge-card__stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.knowledge-card__stats-label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
}

.knowledge-card__stats-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
}

.knowledge-card__action {
  align-self: flex-start;
  font-weight: var(--agent-font-weight-medium);
}

.knowledge-card__tip {
  background: #f8e7a7;
  border-radius: 12px;
  padding: 12px 14px;
}

.knowledge-card__tip-text {
  color: #4f3a00;
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1.6;
  margin: 0;
}

.form-row {
  align-items: flex-start;
  display: flex;
  gap: var(--agent-space-24);
}

.config-card__body .form-row + .form-row {
  border-top: 1px solid var(--agent-color-border-default);
  padding-top: var(--agent-space-24);
}

.form-row__label {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding-top: 8px;
  width: 220px;
}

.form-row__name {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
}

.form-row__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
}

.form-row__control {
  flex: 1;
  max-width: 620px;
  min-width: 0;
}

.form-row__control--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row__control .agent-input {
  width: 100%;
}

.form-row__textarea {
  min-height: 120px;
  resize: vertical;
  width: 100%;
}

.form-row__error {
  color: #e53e3e;
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 4px 0 0;
}

.agent-input--error {
  border-color: #e53e3e;
}

.visibility-layout {
  display: flex;
  gap: var(--agent-space-24);
}

.visibility-layout__form {
  flex: 1;
  min-width: 0;
}

.visibility-layout__preview {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  width: 280px;
}

.bubble-preview__label {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.bubble-preview {
  background: #f8f9fb;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  display: flex;
  gap: 10px;
  padding: 16px;
}

.bubble-preview__avatar {
  align-items: center;
  background: linear-gradient(135deg, #00b578, #00c2b8);
  border-radius: 50%;
  display: flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  overflow: hidden;
  width: 32px;
}

.bubble-preview__avatar-img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.bubble-preview__avatar-fallback {
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}

.bubble-preview__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.bubble-preview__name {
  align-items: center;
  color: var(--agent-color-text-secondary);
  display: flex;
  font-size: 12px;
  gap: 6px;
  line-height: 1.4;
}

.bubble-preview__tag {
  background: #eef4ff;
  border-radius: 4px;
  color: #3b6fce;
  font-size: 10px;
  font-weight: var(--agent-font-weight-semibold);
  line-height: 1;
  padding: 2px 5px;
}

.bubble-preview__bubble {
  background: #ffffff;
  border: 1px solid #e8ecf1;
  border-radius: 0 12px 12px 12px;
  color: var(--agent-color-text-primary);
  font-size: 13px;
  line-height: 1.6;
  padding: 8px 12px;
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-option {
  background: #f4f6fa;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 12px;
  padding: 6px 12px;
  transition: all var(--agent-motion-fast) ease;
}

.pill-option--active {
  background: #e9f1ff;
  border-color: #b7ccff;
  color: var(--agent-color-brand-primary);
}

.inactive-setting {
  align-items: center;
  color: var(--agent-color-text-primary);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.inactive-setting__input {
  max-width: 72px;
  min-height: 38px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: center;
}

.inactive-setting__unit-label {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  flex-shrink: 0;
}

.inactive-setting__unit {
  max-width: 100px;
  min-height: 38px;
}

.inactive-setting__text {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
}

.agent-switch {
  cursor: pointer;
  display: inline-flex;
  position: relative;
}

.agent-switch__input {
  height: 0;
  opacity: 0;
  position: absolute;
  width: 0;
}

.agent-switch__track {
  background: var(--agent-color-border-default);
  border-radius: 12px;
  display: inline-block;
  height: 24px;
  position: relative;
  transition: background var(--agent-motion-fast);
  width: 44px;
}

.agent-switch__track::after {
  background: #fff;
  border-radius: 50%;
  content: "";
  height: 20px;
  left: 2px;
  position: absolute;
  top: 2px;
  transition: transform var(--agent-motion-fast);
  width: 20px;
}

.agent-switch__input:checked + .agent-switch__track {
  background: var(--agent-color-brand-primary);
}

.agent-switch__input:checked + .agent-switch__track::after {
  transform: translateX(20px);
}

.bot-avatar-upload {
  align-items: center;
  display: flex;
  gap: var(--agent-space-12);
}

.bot-avatar-upload__preview {
  align-items: center;
  background: linear-gradient(135deg, #00b578, #00c2b8);
  border-radius: 50%;
  display: inline-flex;
  flex-shrink: 0;
  height: 64px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 64px;
}

.bot-avatar-upload__preview--image {
  background: #eef2f8;
}

.bot-avatar-upload__image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.bot-avatar-upload__fallback {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.bot-avatar-upload__actions {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bot-avatar-upload__hint {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
  line-height: 1.5;
  margin: 0;
}

.bot-avatar-upload__input {
  display: none;
}

.bot-chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--agent-space-8);
}

.bot-chip {
  background: var(--agent-color-bg-muted);
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px var(--agent-space-16);
  transition: all var(--agent-motion-fast);
}

.bot-chip:hover {
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
}

.bot-chip--active {
  background: var(--agent-color-brand-soft);
  border-color: var(--agent-color-brand-primary);
  color: var(--agent-color-brand-primary);
  font-weight: var(--agent-font-weight-medium);
}

.modal-footer-actions {
  display: flex;
  gap: 8px;
}

.avatar-crop-modal {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.avatar-crop-modal__hint {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  margin: 0;
}

.avatar-crop-canvas {
  background: #f4f6fa;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  cursor: grab;
  height: 240px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 240px;
}

.avatar-crop-canvas::after {
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--agent-radius-lg);
  box-shadow: 0 0 0 999px rgba(17, 24, 39, 0.08);
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.avatar-crop-canvas--dragging {
  cursor: grabbing;
}

.avatar-crop-canvas img {
  position: absolute;
  user-select: none;
}

@media (max-width: 1280px) {
  .ai-agent-page__placeholder {
    padding: var(--agent-space-16);
  }

  .lifecycle-stage {
    padding-left: 0;
  }

  .lifecycle-stage::before {
    display: none;
  }

  .lifecycle-stage__header {
    margin-left: 0;
  }

  .config-card__trigger {
    align-items: flex-start;
    min-height: 0;
    padding: 18px;
  }

  .config-card__body {
    padding: 18px;
  }

  .form-row {
    flex-direction: column;
    gap: var(--agent-space-8);
  }

  .form-row__label {
    padding-top: 0;
    width: auto;
  }

  .inactive-setting {
    align-items: flex-start;
  }

  .bot-avatar-upload {
    align-items: flex-start;
    flex-direction: column;
  }

  .visibility-layout {
    flex-direction: column;
  }

  .visibility-layout__preview {
    width: 100%;
  }

  .agent-config-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-config-header__actions {
    width: 100%;
  }

  .avatar-crop-canvas {
    height: 220px;
    width: 220px;
  }
}
</style>
