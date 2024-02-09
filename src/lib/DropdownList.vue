<template>
  <div class="w-36 m-2">
    <div class="flex items-center">
      <label v-if="props.label" class="font-bold mb-1 mr-1">{{ props.label }}</label>
      <InfoPopup v-if="props.info" :description="props.info" />
    </div>
    <Listbox :value="props.value">
      <div class="relative mt-1 cursor-pointer">
        <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-white dark:bg-slate-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        >
          <span class="block truncate">{{ props.value.name }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in props.options"
              :key="option.id"
              :value="option"
              as="template"
              @click="onUpdate(option)"
            >
              <li
                :class="[
                  active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900 dark:text-slate-100',
                  'relative cursor-pointer select-none py-2 pl-10 pr-4'
                ]"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                  option.name
                }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: string; name: string }">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import InfoPopup from './InfoPopup.vue'

const props = defineProps<{
  options: Array<T>
  value: T
  label?: string
  info?: string
}>()

const emit = defineEmits<{
  change: [value: T]
}>()

const onUpdate = (value: T) => {
  emit('change', value)
}
</script>
