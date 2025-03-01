<template>
  <div
    class="flex flex-col m-2 justify-end relative"
    :class="[
      props.size === 'sm'
        ? 'w-full sm:w-24'
        : props.size === 'md'
          ? 'w-full sm:w-36'
          : 'w-full sm:w-48'
    ]"
  >
    <div class="flex items-center flex-wrap">
      <label :for="id" class="font-bold mr-1 whitespace-nowrap">{{ props.label }}</label>
      <InfoPopup v-if="props.info" :description="props.info" />
    </div>

    <div
      class="cursor-pointer focus-within:border-emerald-400 bg-white dark:bg-slate-700 flex justify-between w-full mt-1 rounded-md shadow-md focus:border-teal-300 sm:text-sm p-2 border dark:border-slate-500"
      @click="() => inputElement?.focus()"
    >
      <i
        v-if="props.isDollar"
        class="inline-flex items-cente text-left px-1 text-gray-500 text-sm font-bold"
        >$</i
      >
      <input
        ref="inputElement"
        :id="id"
        :value="props.disabled ? '' : stringValue"
        @input="onUpdate"
        :min="props.min"
        :max="props.max"
        class="w-full bg-transparent focus:outline-none focus:ring-0 disabled:cursor-default disabled:opacity-50"
        :disabled="props.disabled"
      />
      <i
        v-if="props.isPercent"
        class="inline-flex items-end justify-end px-3 text-gray-500 text-md text-left font-bold"
        >%</i
      >
      <i
        v-if="props.isMonth"
        class="inline-flex items-end justify-end px-2 text-gray-500 text-md text-left font-bold"
        >/MONTH</i
      >
      <i
        v-if="props.isYear"
        class="inline-flex items-end justify-end px-2 text-gray-500 text-md text-left font-bold"
        >/YEAR</i
      >
    </div>
    <i v-if="currentNumericValue === undefined" class="text-pink-500">* Enter a valid number</i>
    <i v-else-if="props.min && currentNumericValue < props.min" class="text-pink-500"
      >* Enter a number greater than {{ props.min.toLocaleString() }}
    </i>
    <i v-else-if="props.max && currentNumericValue > props.max" class="text-pink-500"
      >* Enter a number less than {{ props.max.toLocaleString() }}
    </i>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import InfoPopup from './InfoPopup.vue'

const inputElement = ref<HTMLDivElement>()

const props = defineProps<{
  value: number
  label?: string
  disabled?: boolean
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  isDollar?: boolean
  isPercent?: boolean
  isMonth?: boolean
  isYear?: boolean
  info?: string
}>()

const emit = defineEmits<{
  change: [value: number]
}>()

watch(
  () => props.value,
  (value) => {
    stringValue.value = value.toLocaleString()
  }
)

const id = Math.random().toString(36).substring(2, 9)

const unformat = (s: string) => s.replace(/[, ]/gm, '')

const stringValue = ref(props.value.toLocaleString())

const currentNumericValue = computed(() => {
  const unformatted = unformat(stringValue.value)
  const num = Number(unformatted)
  if (isNaN(num)) {
    console.log(`Invalid number: ${unformatted}`)
    return undefined
  }
  return num
})

const onUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement
  const num = Number(unformat(target.value))
  if (isNaN(num)) {
    target.value = String(props.value.toLocaleString())
    return
  }
  stringValue.value = target.value
  if (props.min !== undefined && num < props.min) {
    return
  }
  if (props.max !== undefined && num > props.max) {
    return
  }
  emit('change', num)
}
</script>
