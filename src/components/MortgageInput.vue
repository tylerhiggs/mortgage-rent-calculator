<script setup lang="ts">
import DropdownList from '@/lib/DropdownList.vue'
import NumberInput from '@/lib/NumberInput.vue'
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
  <div class="flex flex-col w-full">
    <NumberInput
      label="Home Price"
      :value="mortgageStore.homeValue"
      :min="mortgageStore.downPayment"
      @change="updateHomeValue"
      info="The price of the home you are looking to buy."
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
      info="The annual percentage rate (APR) of your mortgage. This is the interest rate you will pay on your mortgage."
    />
    <div class="grid grid-rows-1 grid-cols-1 sm:grid-cols-2 w-full sm:w-72 gap-4">
      <NumberInput
        label="Down Payment"
        size="md"
        :value="Math.round(mortgageStore.downPayment)"
        :min="0"
        :max="mortgageStore.homeValue"
        @change="mortgageStore.setDownPayment({ num: $event })"
        isDollar
        info="The amount of money you will put down on your home."
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
      info="The length of your mortgage in years."
    />
    <button @click.prevent="toggleExpanded" class="flex items-center mt-4 ml-2 text-emerald-500">
      {{ isExpanded ? 'Hide' : 'Edit' }} Insurance and Taxes
      <ChevronUpIcon v-if="isExpanded" class="h-5 w-5 text-emerald-500" aria-hidden="true" />
      <ChevronDownIcon v-else class="h-5 w-5 text-emerald-500" aria-hidden="true" />
    </button>
    <div v-if="isExpanded">
      <div class="grid grid-rows-1 grid-cols-1 sm:grid-cols-2 w-72 gap-4">
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
          v-if="mortgageStore.downPaymentPct < 0.2"
          info="Private Mortgage Insurance (PMI) is required if your down payment is less than 20% of the home price. This does not insure your home, but rather insures the lender in case you default on your loan. This is why you should try to avoid a down payment of less than 20%."
        />
        <NumberInput
          size="sm"
          :value="mortgageStore.pmiRate * 100"
          :min="0"
          :max="100"
          @change="(pct: number) => (mortgageStore.pmiRate = pct / 100)"
          isPercent
          v-if="mortgageStore.downPaymentPct < 0.2"
        />
      </div>
      <div class="grid grid-rows-1 grid-cols-1 sm:grid-cols-2 w-72 gap-4">
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
          info="Property taxes are based on the assessed value of your home. This is usually a percentage of the home value."
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
        info="Home insurance is required by your lender. This insures your home in case of damage or theft."
      />
      <NumberInput
        size="lg"
        label="HOA"
        :value="mortgageStore.monthlyHOA"
        :min="0"
        @change="(dollars: number) => (mortgageStore.monthlyHOA = dollars)"
        isDollar
        isMonth
        info="Homeowners Association (HOA) fees are required if you live in a community with an HOA. These fees are used to maintain the community."
      />
    </div>
  </div>
</template>
