<template>
  <svg
    class="agent-icon"
    :class="`agent-icon--${name}`"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g v-if="name === 'home'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 11.3L12 5l7.5 6.3" />
      <path d="M6.2 10.7V19h11.6v-8.3" />
      <path d="M10 19v-4.6h4V19" />
    </g>

    <g v-else-if="name === 'conversation'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5.4 6.2h13.2a1.8 1.8 0 0 1 1.8 1.8v8.1a1.8 1.8 0 0 1-1.8 1.8H10l-4.4 3v-3H5.4a1.8 1.8 0 0 1-1.8-1.8V8a1.8 1.8 0 0 1 1.8-1.8Z" />
    </g>

    <g v-else-if="name === 'files'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.8 8.3h6l1.8 1.7h8.6A1.8 1.8 0 0 1 22 11.8v7.1a1.8 1.8 0 0 1-1.8 1.8H3.8A1.8 1.8 0 0 1 2 18.9v-8.8a1.8 1.8 0 0 1 1.8-1.8Z" />
    </g>

    <g v-else-if="name === 'visitors'" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.2a13 13 0 0 1 0 17.6a13 13 0 0 1 0-17.6Z" />
    </g>

    <g v-else-if="name === 'customer'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8.2" r="3.2" />
      <path d="M5.4 19c.7-3 3.4-5 6.6-5s5.9 2 6.6 5" />
    </g>

    <g v-else-if="name === 'campaign'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 13.4h3.5L17 8.8v6.4L7.5 10.6H4v2.8Z" />
      <path d="M8 13.3l1.3 4.2h2.4l-1.7-5.6" />
      <path d="M18.2 10.2h1.7" />
      <path d="M18.2 13.8h1.7" />
    </g>

    <g v-else-if="name === 'report'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.2" />
      <path d="M8 14.8v2.1" />
      <path d="M12 11.8v5.1" />
      <path d="M16 9.4v7.5" />
    </g>

    <g v-else-if="name === 'ai-agent'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.2" y="5.8" width="15.6" height="12.4" rx="2.8" />
      <path d="M9.2 12h5.6" />
      <path d="M12 5.8V4" />
      <path d="M7.5 15.4h9" />
    </g>

    <g v-else-if="name === 'service'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4.2l6.4 3.2v9.2L12 20l-6.4-3.4V7.4L12 4.2Z" />
      <path d="M12 9.2l2.8 1.4V14L12 15.4l-2.8-1.4v-3.4L12 9.2Z" />
    </g>

    <g v-else-if="name === 'help'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8.8" />
      <path d="M9.6 9.7a2.5 2.5 0 0 1 4.8.9c0 1.6-2.4 2.1-2.4 3.6" />
      <circle cx="12" cy="16.6" r="0.8" fill="currentColor" stroke="none" />
    </g>

    <g v-else-if="name === 'settings'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="2.7" />
      <path d="M19.3 14.1l1.1-1.9l-1.1-1.9l-2.1-.3a5.6 5.6 0 0 0-.8-1.4l.7-2l-1.9-1.1l-1.6 1.4a5.8 5.8 0 0 0-1.6 0L10.3 5.5L8.4 6.6l.7 2c-.3.4-.6.9-.8 1.4l-2.1.3L5.1 12l1.1 1.9l2.1.3c.2.5.4 1 .8 1.4l-.7 2l1.9 1.1l1.7-1.4a5.8 5.8 0 0 0 1.6 0l1.7 1.4l1.9-1.1l-.7-2c.3-.4.6-.9.8-1.4l2.1-.3Z" />
    </g>

    <g v-else-if="name === 'book'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.2 6.4a2 2 0 0 1 2-2H20v14.8H6.2a2 2 0 0 0-2 2V6.4Z" />
      <path d="M8.5 8.5h7.7" />
      <path d="M8.5 12h7.7" />
    </g>

    <g v-else-if="name === 'faq-user'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10.2" cy="9.2" r="2.6" />
      <path d="M5.4 18c.6-2.4 2.7-4 4.8-4c2.2 0 4.3 1.6 4.8 4" />
      <path d="M17.5 8.1a2 2 0 0 1 3.8.7c0 1.1-1.9 1.5-1.9 2.5" />
      <circle cx="19.4" cy="14.1" r=".7" fill="currentColor" stroke="none" />
    </g>

    <g v-else-if="name === 'copilot'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3.8a5.7 5.7 0 0 0-2.8 10.7V16h5.6v-1.5A5.7 5.7 0 0 0 12 3.8Z" />
      <path d="M10.2 19h3.6" />
      <path d="M10.8 21h2.4" />
    </g>

    <g
      v-else-if="name === 'chevron-down'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6.5 9.5L12 15l5.5-5.5" />
    </g>

    <g
      v-else-if="name === 'chevron-right'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9.5 6.5L15 12l-5.5 5.5" />
    </g>

    <g v-else-if="name === 'filter'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 6.2h15" />
      <path d="M7.5 11.8h9" />
      <path d="M10 17.4h4" />
    </g>

    <g v-else-if="name === 'search'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10.8" cy="10.8" r="5.8" />
      <path d="M15.3 15.3L19.2 19.2" />
    </g>

    <g v-else-if="name === 'calendar'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.5" y="6.2" width="15" height="13.3" rx="2" />
      <path d="M8 4.5v3.4" />
      <path d="M16 4.5v3.4" />
      <path d="M4.5 9.8h15" />
    </g>

    <g v-else-if="name === 'edit'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.7 19.3l3.4-.7L18.6 8.1a1.7 1.7 0 0 0 0-2.4l-.3-.3a1.7 1.7 0 0 0-2.4 0L5.4 15.9l-.7 3.4Z" />
      <path d="M13.8 7.5l2.7 2.7" />
    </g>

    <circle v-else cx="12" cy="12" r="7.5" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
  }>(),
  {
    size: 18
  }
);
</script>

<style scoped>
.agent-icon {
  color: currentColor;
  display: block;
  flex-shrink: 0;
}
</style>
