<template>
  <section class="base-panel">
    <div class="panel-border panel-border-top-left" />
    <div class="panel-border panel-border-top-right" />
    <header class="panel-header">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  subtitle?: string
  title: string
}>()
</script>

<style scoped>
.base-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgb(36 215 255 / 10%), transparent 34%),
    linear-gradient(180deg, rgb(10 32 54 / 88%), rgb(6 20 34 / 78%));
  border: 1px solid rgb(101 231 255 / 20%);
  border-radius: 8px;
  box-shadow:
    inset 0 0 24px rgb(36 215 255 / 8%),
    0 14px 42px rgb(0 0 0 / 26%);
}

.base-panel::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(90deg, transparent 0 12px, rgb(101 231 255 / 14%) 12px 13px, transparent 13px),
    linear-gradient(0deg, transparent 0 12px, rgb(101 231 255 / 10%) 12px 13px, transparent 13px);
  background-size: 26px 26px;
  mask-image: linear-gradient(180deg, black, transparent 72%);
}

.panel-border {
  position: absolute;
  top: 0;
  width: 58px;
  height: 2px;
  background: linear-gradient(90deg, #24d7ff, transparent);
}

.panel-border-top-left {
  left: 0;
}

.panel-border-top-right {
  right: 0;
  transform: rotate(180deg);
}

.panel-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 14px 18px 8px;
}

.panel-header h2 {
  margin: 0;
  color: #ecfdff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
}

.panel-header p {
  margin: 4px 0 0;
  color: #74aabd;
  font-size: 12px;
}

.panel-body {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  padding: 0 14px 14px;
}
</style>
