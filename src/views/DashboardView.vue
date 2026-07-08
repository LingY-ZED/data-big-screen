<template>
  <BigScreenLayout>
    <section class="dashboard-view">
      <ScreenHeader :updated-at="dashboard?.updatedAt" />

      <section class="metric-grid" aria-label="核心指标">
        <MetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
      </section>

      <section class="dashboard-content" aria-label="数据可视化区域">
        <BasePanel class="trend-panel" title="资源趋势" subtitle="CPU / Memory / Network">
          <LineTrendChart :data="trends" />
        </BasePanel>

        <BasePanel class="pie-panel" title="机房主机分布" subtitle="Hosts by room">
          <PieStatusChart :data="categories" />
        </BasePanel>

        <BasePanel class="map-panel" title="机房运行态势" subtitle="Realtime data center overview">
          <MapOverviewChart :data="map" />
        </BasePanel>

        <BasePanel class="ranking-panel" title="主机负载排名" subtitle="Top load average hosts">
          <BarRankingChart :data="rankings" />
        </BasePanel>

        <BasePanel class="radar-panel" title="资源健康雷达" subtitle="Resource health model">
          <RadarAbilityChart :data="radar" />
        </BasePanel>

        <BasePanel class="activity-panel" title="实时告警" subtitle="Events & alerts">
          <ul class="activity-list">
            <li
              v-for="activity in activities"
              :key="activity.id"
              class="activity-item"
              :class="`activity-item-${activity.level}`"
            >
              <time>{{ activity.time }}</time>
              <div>
                <strong>{{ activity.title }}</strong>
                <p>{{ activity.description }}</p>
              </div>
            </li>
          </ul>
        </BasePanel>
      </section>

      <div v-if="loading" class="state-overlay">数据加载中...</div>
      <div v-else-if="error" class="state-overlay state-overlay-error">{{ error }}</div>
    </section>
  </BigScreenLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import BarRankingChart from '@/charts/BarRankingChart.vue'
import LineTrendChart from '@/charts/LineTrendChart.vue'
import MapOverviewChart from '@/charts/MapOverviewChart.vue'
import PieStatusChart from '@/charts/PieStatusChart.vue'
import RadarAbilityChart from '@/charts/RadarAbilityChart.vue'
import BasePanel from '@/components/BasePanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import BigScreenLayout from '@/layouts/BigScreenLayout.vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const store = useDashboardStore()
const { activities, categories, dashboard, error, loading, map, metrics, radar, rankings, trends } =
  storeToRefs(store)

onMounted(() => {
  void store.fetchDashboard()
})
</script>

<style scoped>
.dashboard-view {
  position: relative;
  display: grid;
  grid-template-rows: 86px 126px 1fr;
  gap: 18px;
  width: 100%;
  height: 100%;
  padding: 24px 30px 28px;
  overflow: hidden;
  background:
    linear-gradient(rgb(101 231 255 / 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(101 231 255 / 4%) 1px, transparent 1px),
    radial-gradient(circle at 50% 48%, rgb(36 215 255 / 16%), transparent 38%),
    linear-gradient(160deg, #061526 0%, #071c2e 46%, #04111f 100%);
  background-size:
    40px 40px,
    40px 40px,
    auto,
    auto;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
  min-width: 0;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 450px 1fr 450px;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) 198px;
  gap: 18px;
  min-width: 0;
  min-height: 0;
}

.trend-panel {
  grid-column: 1;
  grid-row: 1;
}

.pie-panel {
  grid-column: 1;
  grid-row: 2;
}

.map-panel {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.ranking-panel {
  grid-column: 3;
  grid-row: 1;
}

.radar-panel {
  grid-column: 3;
  grid-row: 2;
}

.activity-panel {
  grid-column: 1 / -1;
  grid-row: 3;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.activity-item {
  position: relative;
  display: grid;
  grid-template-columns: 78px 1fr;
  gap: 12px;
  min-width: 0;
  min-height: 116px;
  padding: 14px;
  overflow: hidden;
  background: rgb(7 27 46 / 72%);
  border: 1px solid rgb(101 231 255 / 16%);
  border-radius: 8px;
}

.activity-item::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  content: '';
  background: #24d7ff;
}

.activity-item-success::before {
  background: #45f0a0;
}

.activity-item-warning::before {
  background: #ffcf5a;
}

.activity-item-error::before {
  background: #ff7a90;
}

.activity-item time {
  color: #65e7ff;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.activity-item strong {
  display: block;
  margin-bottom: 8px;
  overflow: hidden;
  color: #ecfdff;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-item p {
  max-height: 42px;
  margin: 0;
  overflow: hidden;
  color: #8fbfd0;
  font-size: 13px;
  line-height: 1.6;
}

.state-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  color: #65e7ff;
  font-size: 28px;
  background: rgb(4 17 31 / 58%);
  backdrop-filter: blur(6px);
}

.state-overlay-error {
  color: #ff7a90;
}
</style>
