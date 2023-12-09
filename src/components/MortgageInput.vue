<script setup lang="ts">
import DropdownList from './DropdownList.vue'
import NumberInput from './NumberInput.vue'
import { useMortgageStore, Term } from '@/stores/MortgageStore'
import { computed } from 'vue'
const mortgageStore = useMortgageStore()

const termOptions = [
  { id: '15', name: '15 years', value: Term.Fifteen },
  { id: '30', name: '30 years', value: Term.Thirty }
]

const selectedTerm = computed(() => {
  return termOptions.find((option) => option.value === mortgageStore.term) || termOptions[0]
})

const selectTerm = (term: Term) => {
  mortgageStore.term = term
}

const updateHomeValue = (homeValue: number) => {
  mortgageStore.homeValue = homeValue
}

const updateRate = (rate: number) => {
  mortgageStore.rate = rate / 100
}
</script>

<template>
  <form class="flex flex-col">
    <NumberInput
      label="Home Price"
      :value="mortgageStore.homeValue"
      :min="0"
      @change="updateHomeValue"
      isDollar
    />
    <NumberInput
      label="Mortgage Rate (APR)"
      size="sm"
      :value="mortgageStore.rate * 100"
      :min="0"
      :max="100"
      @change="updateRate"
      isPercent
    />
    <div class="grid grid-rows-1 grid-cols-2 w-72 gap-4">
      <NumberInput
        label="Down Payment"
        size="md"
        :value="Math.round(mortgageStore.downPayment)"
        :min="0"
        :max="mortgageStore.homeValue"
        @change="mortgageStore.setDownPayment({ num: $event })"
        isDollar
      />
      <NumberInput
        size="sm"
        :value="Math.round(mortgageStore.downPaymentPct * 100)"
        :min="0"
        :max="100"
        @change="mortgageStore.setDownPayment({ pct: $event / 100 })"
        isPercent
      />
    </div>
    <DropdownList
      :options="termOptions"
      :value="selectedTerm"
      @change="(termOption) => selectTerm(termOption.value)"
      label="Mortgage Term"
    />
  </form>
</template>
