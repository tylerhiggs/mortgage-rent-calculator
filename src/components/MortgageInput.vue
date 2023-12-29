<script setup lang="ts">
import DropdownList from './DropdownList.vue'
import NumberInput from './NumberInput.vue'
import { useMortgageStore, Term } from '@/stores/MortgageStore'
import { computed, ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/20/solid'
const mortgageStore = useMortgageStore()

const termOptions = [
  { id: '15', name: '15 years', value: Term.Fifteen },
  { id: '30', name: '30 years', value: Term.Thirty }
]

const isExpanded = ref(false)

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

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="flex flex-col">
    <NumberInput
      label="Home Price"
      :value="mortgageStore.homeValue"
      :min="mortgageStore.downPayment"
      @change="updateHomeValue"
      isDollar
    />
    <NumberInput
      label="Mortgage Rate (APR)"
      size="sm"
      :value="mortgageStore.rate * 100"
      :min="0.001"
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
    <button @click.prevent="toggleExpanded" class="flex items-center mt-4 ml-2 text-emerald-400">
      {{ isExpanded ? 'Hide' : 'Edit' }} Insurance and Taxes
      <ChevronUpIcon v-if="isExpanded" class="h-5 w-5 text-emerald-400" aria-hidden="true" />
      <ChevronDownIcon v-else class="h-5 w-5 text-emerald-400" aria-hidden="true" />
    </button>
    <div v-if="isExpanded">
      <div class="grid grid-rows-1 grid-cols-2 w-72 gap-4">
        <NumberInput
          size="md"
          label="PMI"
          :value="mortgageStore.monthlyPMI"
          :min="0"
          @change="
            (dollars: number) => (mortgageStore.pmiRate = (dollars * 12) / mortgageStore.principal)
          "
          isDollar
          isMonth
        />
        <NumberInput
          size="sm"
          :value="mortgageStore.pmiRate * 100"
          :min="0"
          :max="100"
          @change="(pct: number) => (mortgageStore.pmiRate = pct / 100)"
          isPercent
        />
      </div>
      <div class="grid grid-rows-1 grid-cols-2 w-72 gap-4">
        <NumberInput
          size="md"
          label="Property Tax"
          :value="Math.round(mortgageStore.propertyTaxRate * mortgageStore.homeValue)"
          :min="0"
          @change="
            (dollars: number) => (mortgageStore.propertyTaxRate = dollars / mortgageStore.homeValue)
          "
          isDollar
          isYear
        />
        <NumberInput
          size="sm"
          :value="mortgageStore.propertyTaxRate * 100"
          :min="0"
          :max="100"
          @change="(pct: number) => (mortgageStore.propertyTaxRate = pct / 100)"
          isPercent
        />
      </div>
      <NumberInput
        size="lg"
        label="Home Insurance"
        :value="mortgageStore.monthlyHomeInsurance"
        :min="0"
        @change="(dollars: number) => (mortgageStore.monthlyHomeInsurance = dollars)"
        isDollar
        isMonth
      />
      <NumberInput
        size="lg"
        label="HOA"
        :value="mortgageStore.monthlyHOA"
        :min="0"
        @change="(dollars: number) => (mortgageStore.monthlyHOA = dollars)"
        isDollar
        isMonth
      />
    </div>
  </div>
</template>
