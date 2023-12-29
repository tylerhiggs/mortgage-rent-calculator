<script setup lang="ts">
import MortgageInput from './components/MortgageInput.vue'
import PieSum from '@/lib/PieSum.vue'
import { useMortgageStore } from '@/stores/MortgageStore'
import { computed } from 'vue'
import { emerald, amber, fuchsia, rose, indigo, purple } from 'tailwindcss/colors'

const mortgageStore = useMortgageStore()

const baseValues = computed(() => [
  {
    name: 'Interest',
    value: mortgageStore.monthlyInterest,
    color: rose['400']
  },
  {
    name: 'Property Tax',
    value: mortgageStore.monthlyPropertyTax,
    color: amber['400']
  },
  {
    name: 'PMI',
    value: mortgageStore.monthlyPMI,
    color: indigo['400']
  },
  {
    name: 'Home Insurance',
    value: mortgageStore.monthlyHomeInsurance,
    color: fuchsia['400']
  },
  {
    name: 'HOA',
    value: mortgageStore.monthlyHOA,
    color: purple['400']
  }
])

const values = computed(() => {
  return [
    {
      name: 'Principal',
      value: mortgageStore.monthlyPrincipal,
      color: emerald['400']
    },
    ...baseValues.value
  ]
})
</script>

<template>
  <main class="bg-gray-100 h-screen">
    <h1 class="font-bold text-3xl p-4">🏡 Mortgage and Rent Calculator</h1>
    <div class="flex justify-around">
      <MortgageInput />
      <div class="flex flex-col">
        <PieSum title="Monthly" :values="values" />
        <PieSum title="Asset Loss" :values="baseValues" />
      </div>
    </div>
  </main>
</template>
