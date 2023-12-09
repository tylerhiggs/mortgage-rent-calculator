import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRentStore = defineStore('rent', () => {
    const rent = ref(0);
    const squareFootage = ref(0);
    const annualRentIncrease = ref(0.03);

    return {
        rent,
        squareFootage,
        annualRentIncrease,
    };
});