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
    <!-- ===== Nav Rail Icons ===== -->

    <g v-if="name === 'home'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.5 10.5L12 3.5l8.5 7" />
      <path d="M5.5 9.5V19c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5V9.5" />
      <path d="M10 20.5v-5c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v5" />
    </g>

    <g v-else-if="name === 'conversation'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 14.5c0 1.1-.9 2-2 2H7.5L3.5 20V5.5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v9z" />
      <path d="M8 8h8" />
      <path d="M8 11.5h5" />
    </g>

    <g v-else-if="name === 'files'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7c0-1.1.9-2 2-2h3.2l2.3 2.5H18c1.1 0 2 .9 2 2V18c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7z" />
    </g>

    <g v-else-if="name === 'visitors'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12h17" />
      <path d="M12 3c2.3 2.5 3.5 5.6 3.5 9s-1.2 6.5-3.5 9c-2.3-2.5-3.5-5.6-3.5-9s1.2-6.5 3.5-9z" />
    </g>

    <g v-else-if="name === 'customer'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0114 0" />
    </g>

    <g v-else-if="name === 'campaign'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 5L7 9H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2l12 4V5z" />
      <path d="M7.5 15v3.5c0 .8.7 1.5 1.5 1.5h1c.8 0 1.5-.7 1.5-1.5V16" />
    </g>

    <g v-else-if="name === 'report'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 14v3" />
      <path d="M12 10v7" />
      <path d="M16 7v10" />
    </g>

    <g v-else-if="name === 'ai-agent'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5v2.5" />
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 16h6" />
    </g>

    <!-- ===== Sub-nav / Misc Icons ===== -->

    <g v-else-if="name === 'service'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4.2l6.4 3.2v9.2L12 20l-6.4-3.4V7.4L12 4.2Z" />
      <path d="M12 9.2l2.8 1.4V14L12 15.4l-2.8-1.4v-3.4L12 9.2Z" />
    </g>

    <g v-else-if="name === 'help'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5" />
      <circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none" />
    </g>

    <g v-else-if="name === 'settings'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </g>

    <g v-else-if="name === 'book'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.2 6.4a2 2 0 0 1 2-2H20v14.8H6.2a2 2 0 0 0-2 2V6.4Z" />
      <path d="M8.5 8.5h7.7" />
      <path d="M8.5 12h7.7" />
    </g>

    <g v-else-if="name === 'faq-user'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10.2" cy="9.2" r="2.6" />
      <path d="M5.4 18c.6-2.4 2.7-4 4.8-4c2.2 0 4.3 1.6 4.8 4" />
      <path d="M17.5 8.1a2 2 0 0 1 3.8.7c0 1.1-1.9 1.5-1.9 2.5" />
      <circle cx="19.4" cy="14.1" r=".7" fill="currentColor" stroke="none" />
    </g>

    <g v-else-if="name === 'copilot'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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

    <g v-else-if="name === 'filter'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 6.2h15" />
      <path d="M7.5 11.8h9" />
      <path d="M10 17.4h4" />
    </g>

    <g v-else-if="name === 'search'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10.8" cy="10.8" r="5.8" />
      <path d="M15.3 15.3L19.2 19.2" />
    </g>

    <g v-else-if="name === 'calendar'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.5" y="6.2" width="15" height="13.3" rx="2" />
      <path d="M8 4.5v3.4" />
      <path d="M16 4.5v3.4" />
      <path d="M4.5 9.8h15" />
    </g>

    <g v-else-if="name === 'edit'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.7 19.3l3.4-.7L18.6 8.1a1.7 1.7 0 0 0 0-2.4l-.3-.3a1.7 1.7 0 0 0-2.4 0L5.4 15.9l-.7 3.4Z" />
      <path d="M13.8 7.5l2.7 2.7" />
    </g>

    <g v-else-if="name === 'user-plus'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="8.5" r="3" />
      <path d="M4.8 19c.6-2.8 2.8-4.5 5.2-4.5c1.6 0 3 .7 4 1.8" />
      <path d="M18 14v5" />
      <path d="M15.5 16.5h5" />
    </g>

    <g v-else-if="name === 'transfer'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 17l-3-3l3-3" />
      <path d="M4 14h12" />
      <path d="M17 7l3 3l-3 3" />
      <path d="M20 10H8" />
    </g>

    <g v-else-if="name === 'mark-pending'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </g>

    <g v-else-if="name === 'remove-pending'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
      <path d="M9 9l6 6" stroke-width="2" />
    </g>

    <g v-else-if="name === 'close-session'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </g>

    <g v-else-if="name === 'check'" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 12.5l3.1 3.1L17.5 8.2" />
    </g>

    <g v-else-if="name === 'check-circle'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M9 12l2 2l4-4" />
    </g>

    <g v-else-if="name === 'group-chat'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16.5 13.5a3.5 3.5 0 1 0-1.3-6.7" />
      <path d="M17.8 19.5c.6-1.8 1.8-3 3.2-3" />
      <circle cx="9.5" cy="8.5" r="3.5" />
      <path d="M3 19.5c.8-3 3-5 6.5-5s5.7 2 6.5 5" />
    </g>

    <g v-else-if="name === 'add-member'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10" cy="8.5" r="3" />
      <path d="M4.8 19c.6-2.8 2.8-4.5 5.2-4.5c1.6 0 3 .7 4 1.8" />
      <path d="M18 14v5" />
      <path d="M15.5 16.5h5" />
    </g>

    <g v-else-if="name === 'delete'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 7h14" />
      <path d="M8 7V5.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M6.5 7l.8 12.5a1.5 1.5 0 0 0 1.5 1.5h6.4a1.5 1.5 0 0 0 1.5-1.5L17.5 7" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </g>

    <g v-else-if="name === 'email'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 8l8.5 5l8.5-5" />
    </g>

    <g v-else-if="name === 'gmail'" fill="currentColor" stroke="none">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M3.5 8l8.5 5l8.5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <g v-else-if="name === 'web'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12h17" />
      <path d="M12 3c2.3 2.5 3.5 5.6 3.5 9s-1.2 6.5-3.5 9c-2.3-2.5-3.5-5.6-3.5-9s1.2-6.5 3.5-9z" />
    </g>

    <g v-else-if="name === 'widget'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M4.5 9.5h15" />
      <path d="M8 7.5v-3" />
      <path d="M12 7.5v-3" />
      <path d="M16 7.5v-3" />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 17.5h6" />
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

    <g v-else-if="name === 'list-ordered'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 6h9" />
      <path d="M11 12h9" />
      <path d="M11 18h9" />
      <path d="M4 6h1v4" />
      <path d="M4 16.5a1.5 1.5 0 1 1 3 0c0 .8-3 2.5-3 2.5h3" />
    </g>

    <g v-else-if="name === 'list-unordered'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <circle cx="5" cy="6" r="1" fill="currentColor" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="5" cy="18" r="1" fill="currentColor" />
    </g>

    <g v-else-if="name === 'link'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-.5.5" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l.5-.5" />
    </g>

    <g v-else-if="name === 'disconnect'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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
