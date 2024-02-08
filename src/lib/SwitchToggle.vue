<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  enabled: boolean
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  change: [value: boolean]
}>()

const enabled = ref(props.enabled)

watch(
  () => props.enabled,
  (value) => {
    enabled.value = value
  }
)

watch(
  () => enabled.value,
  (value) => {
    emit('change', value)
  }
)
</script>

<template>
  <Switch
    v-model="enabled"
    :class="enabled ? 'bg-emerald-500' : 'bg-gray-200'"
    class="relative inline-flex h-6 w-11 items-center rounded-full"
  >
    <span
      :class="enabled ? 'translate-x-6' : 'translate-x-1'"
      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
    />
  </Switch>
</template>
