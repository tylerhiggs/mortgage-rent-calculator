<script setup lang="ts">
import { computed } from 'vue'
import { useMortgageStore } from '@/stores/MortgageStore'
const mortgageStore = useMortgageStore()

const principalPercentage = computed(() => {
  return mortgageStore.monthlyPrincipal / mortgageStore.monthlyPayment
})
const principalPercentageString = computed(() => {
  return `${principalPercentage.value * 100}%`
})

const interestPercentage = computed(() => {
  return principalPercentage.value + mortgageStore.monthlyInterest / mortgageStore.monthlyPayment
})
const interestPercentageString = computed(() => {
  return `${interestPercentage.value * 100}%`
})
const propertyTaxPercentage = computed(() => {
  return interestPercentage.value + mortgageStore.monthlyPropertyTax / mortgageStore.monthlyPayment
})
const propertyTaxPercentageString = computed(() => {
  return `${propertyTaxPercentage.value * 100}%`
})
const pmiPercentage = computed(() => {
  return propertyTaxPercentage.value + mortgageStore.monthlyPMI / mortgageStore.monthlyPayment
})

const pmiPercentageString = computed(() => {
  return `${pmiPercentage.value * 100}%`
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
  background: conic-gradient(
    rgb(74 222 128) 0% v-bind(principalPercentageString),
    rgb(244 114 182) v-bind(principalPercentageString) v-bind(interestPercentageString),
    rgb(251 191 36) v-bind(interestPercentageString) v-bind(propertyTaxPercentageString),
    rgb(232 121 249) v-bind(propertyTaxPercentageString) v-bind(pmiPercentageString),
    rgb(129 140 248) v-bind(pmiPercentageString)
  );
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
  <div class="mt-2 flex">
    <div>
      <div class="font-bold">Monthly Payment Breakdown</div>
      <div class="grid grid-cols-5 w-72">
        <div class="flex items-center col-span-4">
          <div class="mr-3 h-5 w-5 bg-emerald-400 rounded-full" />
          Principal:
        </div>
        <div>${{ mortgageStore.monthlyPrincipal.toFixed(0) }}</div>
        <div class="flex items-center col-span-4">
          <div class="mr-3 h-5 w-5 bg-pink-400 rounded-full" />
          Interest:
        </div>
        <div>${{ mortgageStore.monthlyInterest.toFixed(0) }}</div>
        <div class="flex items-center col-span-4">
          <div class="mr-3 h-5 w-5 bg-amber-400 rounded-full" />
          PropertyTax:
        </div>
        <div>${{ mortgageStore.monthlyPropertyTax.toFixed(0) }}</div>
        <div class="flex items-center col-span-4" v-if="mortgageStore.monthlyPMI">
          <div class="mr-3 h-5 w-5 bg-fuchsia-400 rounded-full" />
          PMI:
        </div>
        <div v-if="mortgageStore.monthlyPMI">${{ mortgageStore.monthlyPMI.toFixed(0) }}</div>
        <div class="flex items-center col-span-4">
          <div class="mr-3 h-5 w-5 bg-indigo-400 rounded-full" />
          Home Insurance:
        </div>
        <div>${{ mortgageStore.monthlyHomeInsurance.toFixed(0) }}</div>
      </div>
      +
      <hr class="w-72" />
      <div class="font-bold">Total Monthly Payment:</div>
      <div class="font-bold">${{ mortgageStore.monthlyPayment.toFixed(0) }}</div>
    </div>
    <div class="pie-chart">
      <div class="z-10 font-bold flex flex-col justify-center items-center">
        <div class="text-xl">Total Payment</div>
        <div class="text-3xl">${{ mortgageStore.monthlyPayment.toFixed(0) }}</div>
      </div>
    </div>
  </div>
</template>
