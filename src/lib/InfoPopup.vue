<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/20/solid'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

defineProps<{ description: string }>()
</script>

<template>
  <Popover class="relative">
    <PopoverButton class="flex items-center border-none outline-none">
      <InformationCircleIcon class="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
    </PopoverButton>

    <PopoverPanel class="absolute w-72 z-30">
      <div class="bg-white shadow-lg rounded-lg p-3">
        <p class="text-gray-500 font-normal text-base">{{ description }}</p>
      </div>
    </PopoverPanel>
  </Popover>
</template>
