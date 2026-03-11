<template>
  <BaseModal :open="open" title="图片裁剪" max-width="580px" @close="handleClose">
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
        <button type="button" class="agent-btn agent-btn--ghost" @click="handleClose">取消</button>
        <button type="button" class="agent-btn agent-btn--primary" @click="confirmCropImage">确定</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BaseModal } from "@twt/ui-agent";

interface CropState {
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  offsetX: number;
  offsetY: number;
}

const AVATAR_CROP_SIZE = 240;
const AVATAR_CROP_DRAG_SCALE = 1.1;

const createEmptyCropState = (): CropState => ({
  imageSrc: "",
  naturalWidth: 0,
  naturalHeight: 0,
  offsetX: 0,
  offsetY: 0
});

const props = defineProps<{
  open: boolean;
  imageSrc: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", dataUrl: string): void;
}>();

const cropDragging = ref(false);
const cropDragStart = ref({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
const cropState = ref<CropState>(createEmptyCropState());

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

const initCropState = async (source: string) => {
  if (!source) return;
  try {
    const meta = await loadImageMeta(source);
    cropState.value = {
      imageSrc: source,
      naturalWidth: meta.width,
      naturalHeight: meta.height,
      offsetX: 0,
      offsetY: 0
    };
  } catch {
    // image load failed — reset state
    cropState.value = createEmptyCropState();
  }
};

const resetState = () => {
  cropDragging.value = false;
  cropState.value = createEmptyCropState();
};

const handleClose = () => {
  resetState();
  emit("close");
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
    const dataUrl = canvas.toDataURL("image/png");
    resetState();
    emit("confirm", dataUrl);
  } catch {
    // crop failed — keep modal open so user can retry
  }
};

watch(
  () => props.imageSrc,
  (newSrc) => {
    if (newSrc) {
      initCropState(newSrc);
    } else {
      cropState.value = createEmptyCropState();
    }
  }
);
</script>

<style scoped>
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
</style>
