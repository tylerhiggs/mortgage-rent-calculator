<script setup lang="ts">
import MortgageInput from './components/MortgageInput.vue'
import MortgageMonthlyPayments from './components/MortgageMonthlyPayments.vue'
import MortgageMonthlyAssetChange from './components/MortgageMonthlyAssetChange.vue'
</script>

<template>
  <main class="bg-gray-100 flex">
    <MortgageInput />
    <div class="flex flex-col">
      <MortgageMonthlyPayments />
      <MortgageMonthlyAssetChange />
    </div>
  </main>
</template>
