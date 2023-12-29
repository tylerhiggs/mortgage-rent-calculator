<script setup lang="ts">
import { defineProps } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/20/solid'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const props = defineProps<{
  description: string
}>()
</script>

<template>
  <Popover class="relative">
    <PopoverButton class="flex items-center border-none outline-none">
      <InformationCircleIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
    </PopoverButton>

    <PopoverPanel class="absolute w-72 z-30">
      <div class="bg-white shadow-lg rounded-lg p-3">
        <p class="text-gray-500">{{ props.description }}</p>
      </div>
    </PopoverPanel>
  </Popover>
</template>
