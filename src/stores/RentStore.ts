import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useRentStore = defineStore('rent', () => {
  const rent = shallowRef(0)
  const squareFootage = shallowRef(0)
  const annualRentIncrease = shallowRef(0.03)

  return {
    rent,
    squareFootage,
    annualRentIncrease
  }
})
