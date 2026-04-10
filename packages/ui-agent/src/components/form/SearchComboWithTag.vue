<template>
  <div class="search-combo" ref="containerRef">
    <div class="search-combo__input-wrap">
      <span v-if="hasUserSelected" class="search-combo__tag">
        {{ selectedLabel }}
      </span>

      <input
        ref="inputRef"
        v-model="keyword"
        :placeholder="computedPlaceholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @click="handleInputClick"
        class="search-combo__input"
      />

      <button
        v-if="isFocused && (keyword || props.selectedField !== 'all')"
        @mousedown.prevent
        @click="clearAll"
        class="search-combo__clear"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15"/>
          <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="showDropdown"
        ref="dropdownRef"
        class="search-combo__dropdown"
        :style="dropdownStyle"
      >
        <div
          v-for="(option, index) in props.options"
          :key="option.value"
          :class="[
            'search-combo__option',
            { 'search-combo__option--active': index === activeIndex }
          ]"
          @mousedown.prevent="selectOption(option)"
          @mouseenter="activeIndex = index"
        >
          搜索 {{ option.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import AgentIcon from "../icon/AgentIcon.vue";

interface SearchOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  selectedField: string;
  options: SearchOption[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "搜索"
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:selectedField", value: string): void;
  (e: "search"): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const showDropdown = ref(false);
const isFocused = ref(false);
const activeIndex = ref(0);
const dropdownStyle = ref<Record<string, string>>({});
const hasUserSelected = ref(false); // 跟踪用户是否主动选择过选项

const keyword = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value)
});

const selectedLabel = computed(() => {
  const option = props.options.find(o => o.value === props.selectedField);
  return option?.label || "";
});

const computedPlaceholder = computed(() => {
  if (props.selectedField === "all") {
    return props.placeholder;
  }
  return selectedLabel.value ? `搜索${selectedLabel.value}` : props.placeholder;
});

const updateDropdownPosition = () => {
  if (!inputRef.value || !containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`
  };
};

const handleFocus = () => {
  isFocused.value = true;
};

const handleInputClick = () => {
  if (!showDropdown.value) {
    showDropdown.value = true;
    activeIndex.value = props.options.findIndex(o => o.value === props.selectedField);
    if (activeIndex.value === -1) activeIndex.value = 0;
    nextTick(() => {
      updateDropdownPosition();
    });
  }
};

const handleBlur = () => {
  isFocused.value = false;
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (showDropdown.value) {
    // 下拉面板打开时的键盘导航
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activeIndex.value = Math.min(activeIndex.value + 1, props.options.length - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        activeIndex.value = Math.max(activeIndex.value - 1, 0);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex.value >= 0 && activeIndex.value < props.options.length) {
          selectOption(props.options[activeIndex.value]);
        }
        break;
      case "Escape":
        e.preventDefault();
        showDropdown.value = false;
        inputRef.value?.blur();
        break;
    }
  } else {
    // 下拉面板关闭时
    if (e.key === "Enter") {
      e.preventDefault();
      // 如果没有输入关键词，回车键打开下拉菜单
      if (!keyword.value.trim()) {
        showDropdown.value = true;
        activeIndex.value = props.options.findIndex(o => o.value === props.selectedField);
        if (activeIndex.value === -1) activeIndex.value = 0;
        nextTick(() => {
          updateDropdownPosition();
        });
      } else {
        // 有关键词时触发搜索
        emit("search");
      }
    }
  }
};

const selectOption = (option: SearchOption) => {
  emit("update:selectedField", option.value);
  hasUserSelected.value = true; // 标记用户已选择
  showDropdown.value = false;

  if (keyword.value.trim()) {
    emit("search");
  }

  nextTick(() => {
    inputRef.value?.focus();
  });
};

const clearAll = () => {
  emit("update:modelValue", "");
  emit("update:selectedField", "all");
  hasUserSelected.value = false; // 重置选择状态
  emit("search"); // 触发搜索以清空过滤
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleScroll = () => {
  if (showDropdown.value) {
    updateDropdownPosition();
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, true);
  window.addEventListener("resize", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll, true);
  window.removeEventListener("resize", handleScroll);
});

watch(showDropdown, (visible) => {
  if (visible) {
    updateDropdownPosition();
  }
});
</script>

<style scoped>
.search-combo {
  position: relative;
}

.search-combo__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--agent-space-8);
  padding: 8px 12px;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  background: var(--agent-color-bg-panel);
  transition: border-color var(--agent-motion-fast);
}

.search-combo__input-wrap:focus-within {
  border-color: var(--agent-color-brand-primary);
}

.search-combo__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: var(--agent-color-brand-soft);
  color: var(--agent-color-brand-primary);
  border-radius: var(--agent-radius-sm);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-medium);
  white-space: nowrap;
  flex-shrink: 0;
}

.search-combo__icon {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
}

.search-combo__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  min-width: 0;
}

.search-combo__input::placeholder {
  color: var(--agent-color-text-tertiary);
}

.search-combo__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  flex-shrink: 0;
  transition: color var(--agent-motion-fast);
}

.search-combo__clear:hover {
  color: var(--agent-color-text-secondary);
}

.search-combo__dropdown {
  position: fixed;
  background: var(--agent-color-bg-panel);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-lg);
  box-shadow: var(--agent-shadow-md);
  padding: var(--agent-space-8);
  z-index: var(--agent-z-dropdown);
  max-height: 300px;
  overflow-y: auto;
}

.search-combo__option {
  padding: 8px 12px;
  border-radius: var(--agent-radius-md);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  color: var(--agent-color-text-primary);
  transition: background var(--agent-motion-fast);
  user-select: none;
}

.search-combo__option--active {
  background: var(--agent-color-bg-muted);
}

.search-combo__option:hover {
  background: var(--agent-color-bg-muted);
}
</style>
