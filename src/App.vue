<script setup lang="ts">
import MortgageInput from './components/MortgageInput.vue'
import MortgageMonthlyPayments from './components/MortgageMonthlyPayments.vue'
import MortgageMonthlyAssetChange from './components/MortgageMonthlyAssetChange.vue'
</script>

<template>
  <main class="bg-gray-100">
    <h1 class="font-bold text-3xl p-4">🏡 Mortgage and Rent Calculator</h1>
    <div class="flex">
      <MortgageInput />
      <div class="flex flex-col">
        <MortgageMonthlyPayments />
        <MortgageMonthlyAssetChange />
      </div>
    </div>
  </main>
</template>
