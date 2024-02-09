<script setup lang="ts">
import MortgageInput from './components/MortgageInput.vue'
import PieSum from '@/lib/PieSum.vue'
import RetirementSummary from './components/RetirementSummary.vue'
import { useMortgageStore } from '@/stores/MortgageStore'
import { computed } from 'vue'
import { emerald, amber, fuchsia, rose, indigo, purple } from 'tailwindcss/colors'

const mortgageStore = useMortgageStore()

const baseValues = computed(() => [
  {
    name: 'Interest',
    value: mortgageStore.monthlyInterest,
    color: rose['400'],
    info: 'This is the amount of your monthly payment that goes to paying interest on your mortgage. Paying this is a loss in asset value.'
  },
  {
    name: 'Property Tax',
    value: mortgageStore.monthlyPropertyTax,
    color: amber['400'],
    info: 'This is the amount of your monthly payment that goes to paying property taxes. Paying this is a loss in asset value.'
  },
  {
    name: 'PMI',
    value: mortgageStore.monthlyPMI,
    color: indigo['400'],
    info: 'This is the amount of your monthly payment that goes to paying private mortgage insurance. Paying this is a loss in asset value. Additionally, the PMI is only insurance for the lender, and does not actually insure you!'
  },
  {
    name: 'Home Insurance',
    value: mortgageStore.monthlyHomeInsurance,
    color: fuchsia['400'],
    info: 'This is the amount of your monthly payment that goes to paying home insurance. Paying this is a loss in asset value, but does protect you against disaster.'
  },
  {
    name: 'HOA',
    value: mortgageStore.monthlyHOA,
    color: purple['400'],
    info: 'This is the amount of your monthly payment that goes to paying Home Owners Association fees. Paying this is a loss in asset value, but may include costs you would have had otherwise like garbage, landscaping, sewer, etc.'
  }
])

const values = computed(() => {
  return [
    {
      name: 'Principal',
      value: mortgageStore.monthlyPrincipal,
      color: emerald['400'],
      info: 'This is the amount of your monthly payment that goes to paying down the principal of your mortgage. Paying this is jsut a transfer of your liquid assets (cash) to illiquid assets (your home value, which is also appreciating).'
    },
    ...baseValues.value
  ]
})
</script>

<template>
  <main class="bg-slate-100 xl:bg-emerald-200 xl:dark:bg-slate-700 dark:bg-slate-700 h-full">
    <h1 class="font-bold text-3xl p-4 dark:text-slate-100">
      🏡 Mortgage and Rent Retirement Calculator
    </h1>
    <div class="flex flex-col items-center">
      <div
        class="w-full xl:w-8/12 flex flex-col items-center bg-slate-100 dark:bg-slate-800 dark:text-slate-100 rounded-2xl p-4"
      >
        <h2 class="font-bold text-2xl">Monthly Mortgage Breakdown</h2>
        <div class="flex lg:flex-row flex-col lg:justify-around items-center w-full lg:w-auto">
          <MortgageInput />
          <div class="flex flex-col w-full items-center">
            <PieSum
              title="Monthly"
              :values="values"
              info="This is your total monthly payment for the duration of the mortgage."
              class="w-full sm:w-auto"
            />
            <PieSum
              title="Asset Loss"
              :values="baseValues"
              info="This is how much your total net worth goes down per month due to mortgage payments. Notice it is less than the monthly payment because you are building equity in your home."
              class="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
      <RetirementSummary class="mt-4" />
    </div>
  </main>
</template>
