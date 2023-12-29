<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps<{
  title: string
  values: Array<{
    name: string
    value: number
    color: string
  }>
}>()

const total = computed(() => {
  return props.values.reduce((acc, cur) => acc + cur.value, 0)
})

const percentages = computed(() => {
  return props.values.reduce(
    (acc, cur, index) => {
      return [
        ...acc,
        {
          ...cur,
          percentage: (index ? acc[index - 1].percentage : 0) + cur.value / total.value
        }
      ]
    },
    new Array<{
      name: string
      value: number
      color: string
      percentage: number
    }>()
  )
})

const conicGradientString = computed(() => {
  return percentages.value.reduce((acc, cur, i) => {
    return `${acc} ${cur.color} 0% ${cur.percentage * 100}%${
      i === percentages.value.length - 1 ? '' : ','
    }`
  }, '')
})
</script>

<style scoped>
.pie-chart {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: conic-gradient(v-bind(conicGradientString));
}

.pie-chart::after {
  content: '';
  position: absolute;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  background-color: #ffffff;
}
</style>

<template>
  <div class="mt-2 flex items-center">
    <div>
      <div class="font-bold">{{ props.title }}:</div>
      <div class="flex flex-col w-72 mr-4">
        <div
          v-for="value in props.values.filter((value) => value.value > 0)"
          :key="value.name"
          class="flex items-center justify-between w-full"
        >
          <div class="flex items-center">
            <div :style="{ backgroundColor: value.color }" class="mr-3 h-5 w-5 rounded-full" />
            {{ value.name }}:
          </div>
          <div>${{ value.value.toFixed(0) }}</div>
        </div>
      </div>
      +
      <hr class="w-72" />
      <div class="font-bold">${{ total.toFixed(0) }}</div>
    </div>
    <div class="pie-chart">
      <div class="z-10 font-bold flex flex-col justify-center items-center">
        <div class="text-xl">{{ props.title }}</div>
        <div class="text-3xl">${{ total.toFixed(0) }}</div>
      </div>
    </div>
  </div>
</template>
