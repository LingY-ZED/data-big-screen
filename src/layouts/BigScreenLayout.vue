<template>
  <div class="screen-viewport">
    <div class="screen-stage" :style="stageStyle">
      <main class="screen-canvas" :style="canvasStyle" aria-label="数据大屏画布">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const designWidth = 1920
const designHeight = 1080
const scale = ref(1)

const canvasStyle = computed(() => ({
  transform: `scale(${scale.value})`,
}))

const stageStyle = computed(() => ({
  height: `${designHeight * scale.value}px`,
  width: `${designWidth * scale.value}px`,
}))

function updateScale() {
  scale.value = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight)
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale)
})
</script>

<style scoped>
.screen-viewport {
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  place-items: center;
}

.screen-stage {
  position: relative;
  overflow: hidden;
}

.screen-canvas {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  transform-origin: left top;
}
</style>
