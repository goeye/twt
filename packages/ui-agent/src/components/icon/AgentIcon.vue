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

    <g v-else-if="name === 'user-plus'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="8.5" r="3" />
      <path d="M4.8 19c.6-2.8 2.8-4.5 5.2-4.5c1.6 0 3 .7 4 1.8" />
      <path d="M18 14v5" />
      <path d="M15.5 16.5h5" />
    </g>

    <g v-else-if="name === 'transfer'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 17l-3-3l3-3" />
      <path d="M4 14h12" />
      <path d="M17 7l3 3l-3 3" />
      <path d="M20 10H8" />
    </g>

    <g v-else-if="name === 'mark-pending'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </g>

    <g v-else-if="name === 'remove-pending'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
      <path d="M9 9l6 6" stroke-width="2" />
    </g>

    <g v-else-if="name === 'close-session'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </g>

    <g v-else-if="name === 'group-chat'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16.5 13.5a3.5 3.5 0 1 0-1.3-6.7" />
      <path d="M17.8 19.5c.6-1.8 1.8-3 3.2-3" />
      <circle cx="9.5" cy="8.5" r="3.5" />
      <path d="M3 19.5c.8-3 3-5 6.5-5s5.7 2 6.5 5" />
    </g>

    <g v-else-if="name === 'add-member'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="8.5" r="3" />
      <path d="M4.8 19c.6-2.8 2.8-4.5 5.2-4.5c1.6 0 3 .7 4 1.8" />
      <path d="M18 14v5" />
      <path d="M15.5 16.5h5" />
    </g>

    <g v-else-if="name === 'delete'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 7h14" />
      <path d="M8 7V5.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M6.5 7l.8 12.5a1.5 1.5 0 0 0 1.5 1.5h6.4a1.5 1.5 0 0 0 1.5-1.5L17.5 7" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </g>

    <g v-else-if="name === 'email'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 8l8.5 5l8.5-5" />
    </g>

    <g v-else-if="name === 'gmail'" fill="currentColor" stroke="none">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
      <path d="M3.5 8l8.5 5l8.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <g v-else-if="name === 'web'" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.8 12h16.4" />
      <path d="M12 3.2a13 13 0 0 1 0 17.6a13 13 0 0 1 0-17.6Z" />
    </g>

    <g v-else-if="name === 'bold'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 5h6a4 4 0 0 1 0 8H7V5Z" />
      <path d="M7 13h7a4 4 0 0 1 0 8H7v-8Z" />
    </g>

    <g v-else-if="name === 'italic'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 5h6" />
      <path d="M8 19h6" />
      <path d="M14 5l-4 14" />
    </g>

    <g v-else-if="name === 'underline'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 4v7a5 5 0 0 0 10 0V4" />
      <path d="M5 20h14" />
    </g>

    <g v-else-if="name === 'list-ordered'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 6h9" />
      <path d="M11 12h9" />
      <path d="M11 18h9" />
      <path d="M4 6h1v4" />
      <path d="M4 16.5a1.5 1.5 0 1 1 3 0c0 .8-3 2.5-3 2.5h3" />
    </g>

    <g v-else-if="name === 'list-unordered'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <circle cx="5" cy="6" r="1" fill="currentColor" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="5" cy="18" r="1" fill="currentColor" />
    </g>

    <g v-else-if="name === 'link'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-.5.5" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l.5-.5" />
    </g>

    <g v-else-if="name === 'disconnect'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-.5.5" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l.5-.5" />
      <path d="M4 4l16 16" stroke-width="2" />
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
