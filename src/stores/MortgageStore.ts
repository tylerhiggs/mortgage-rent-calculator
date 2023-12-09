import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export enum Term {
    Thirty = 30,
    Fifteen = 15,
}

const DEFAULT_HOME_VALUE = 200000;
const PROPERTY_TAX_RATE = 0.000917;
const PMI_RATE_INVERTED = 1200;

export const useMortgageStore = defineStore('mortgage', () => {
    const homeValue = ref(DEFAULT_HOME_VALUE);
    /**
     * The interest rate, as a decimal.
     */
    const rate = ref(0.065);
    const term = ref(Term.Fifteen);
    const _downPayment = ref(DEFAULT_HOME_VALUE * 0.2);
    const principal = computed(() => homeValue.value - _downPayment.value);

    const downPayment = computed(() => _downPayment.value);
    const downPaymentPct = computed(() => _downPayment.value / homeValue.value);
    const setDownPayment = ({num, pct}: {num?: number, pct?: number}) => {
        if (!num && !pct) {
            return;
        }
        _downPayment.value = pct ? homeValue.value * pct : num || 0;
    }

    const monthlyPrincipalAndInterest = computed(() => {
        const p = principal.value;
        const r = rate.value / 12;
        const n = term.value * 12;
        const precomputed = Math.pow(1 + r, n);
        return (p * r * precomputed) / (precomputed - 1);
    });

    const monthlyPrincipal = computed(() => {
        return principal.value / term.value / 12
    });

    const monthlyInterest = computed(() => {
        return monthlyPrincipalAndInterest.value - monthlyPrincipal.value;
    });

    const monthlyPaymentFormatted = computed(() => {
        return `$${monthlyPrincipalAndInterest.value.toFixed(0)}`;
    });

    const monthlyPropertyTax = computed(() => {
        return homeValue.value * PROPERTY_TAX_RATE;
    });

    const monthlyPMI = computed(() => {
        return downPaymentPct.value < 0.2 ? principal.value / PMI_RATE_INVERTED : 0;
    });

    const monthlyHomeInsurance = ref(125);

    const monthlyPayment = computed(() => {
        return monthlyPrincipalAndInterest.value + monthlyPropertyTax.value + monthlyPMI.value + monthlyHomeInsurance.value;
    });

    const monthlyAssetLoss = computed(() => {
        return monthlyPayment.value - monthlyPrincipal.value;
    })

    return {
        principal,
        homeValue,
        rate,
        term,
        monthlyPrincipalAndInterest,
        monthlyPaymentFormatted,
        monthlyInterest,
        monthlyPropertyTax,
        downPayment,
        downPaymentPct,
        setDownPayment,
        monthlyPrincipal,
        monthlyPMI,
        monthlyHomeInsurance,
        monthlyPayment,
        monthlyAssetLoss,
    }
});