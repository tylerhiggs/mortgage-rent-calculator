<script setup lang="ts">
import { defineProps, computed } from 'vue'
import InfoPopup from './InfoPopup.vue'

const props = defineProps<{
  title: string
  pieTitle?: string
  values: Array<{
    name: string
    value: number
    color: string
    info?: string
  }>
  info?: string
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
  width: 250px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: conic-gradient(v-bind(conicGradientString));
}
</style>

<template>
  <div class="mt-2 flex items-center sm:flex-row flex-col">
    <div class="w-full sm:w-auto">
      <div class="font-bold flex items-center">
        {{ props.title }}:
        <InfoPopup v-if="props.info" :description="props.info" class="mx-1" />
      </div>
      <div class="flex flex-col sm:w-80 w-full mr-4">
        <div
          v-for="value in props.values.filter((value) => value.value > 0)"
          :key="value.name"
          class="flex items-center justify-between w-full my-1 py-1 rounded-lg text-white px-2 group"
          :style="{ backgroundColor: value.color }"
        >
          <div class="flex items-center w-52">
            <p>{{ value.name }}:</p>
            <InfoPopup
              class="ml-1 group-hover:visible sm:invisible"
              v-if="value.info"
              :description="value.info"
            />
          </div>
          <div>${{ Math.round(value.value).toLocaleString() }}</div>
        </div>
      </div>
      +
      <hr class="w-72" />
      <div class="font-bold">${{ Math.round(total).toLocaleString() }}</div>
    </div>
    <div class="pie-chart">
      <div class="z-10 font-bold flex flex-col justify-center items-center">
        <div class="text-lg">{{ props?.pieTitle || props.title }}</div>
        <div class="text-2xl">${{ Math.round(total).toLocaleString() }}</div>
      </div>
      <div class="absolute h-[200px] w-[200px] rounded-full bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
</template>
