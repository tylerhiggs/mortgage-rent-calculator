<template>
  <div
    class="flex flex-col m-2 justify-end relative"
    :style="{
      width: props.size === 'sm' ? '6rem' : props.size === 'md' ? '9rem' : '12rem'
    }"
  >
    <label :for="props.label" class="font-bold">{{ props.label }}</label>

    <div
      class="cursor-pointer focus-within:border-emerald-400 bg-white flex justify-between w-full mt-1 rounded-md shadow-md focus:border-teal-300 sm:text-sm p-2 border"
      @click="() => inputElement?.focus()"
    >
      <i
        v-if="props.isDollar"
        class="inline-flex items-cente text-left px-1 text-gray-500 text-sm font-bold"
        >$</i
      >
      <input
        ref="inputElement"
        :id="props.label"
        :value="stringValue"
        @input="onUpdate"
        :min="props.min"
        :max="props.max"
        class="w-full bg-transparent focus:outline-none focus:ring-0"
      />
      <i
        v-if="props.isPercent"
        class="inline-flex items-end justify-end px-3 text-gray-500 text-md text-left font-bold"
        >%</i
      >
    </div>
    <i v-if="currentNumericValue == undefined" class="text-pink-500">* Enter a valid number</i>
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

const inputElement = ref<HTMLDivElement>()

const props = defineProps<{
  value: number
  label?: string
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  isDollar?: boolean
  isPercent?: boolean
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
