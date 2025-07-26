import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

export enum Term {
  Thirty = 30,
  Fifteen = 15
}

const DEFAULT_HOME_VALUE = 200000

export const useMortgageStore = defineStore('mortgage', () => {
  const homeValue = shallowRef(DEFAULT_HOME_VALUE)
  /**
   * The interest rate, as a decimal.
   */
  const rate = shallowRef(0.05)
  const term = shallowRef(Term.Fifteen)
  const _downPayment = shallowRef(DEFAULT_HOME_VALUE * 0.2)
  const principal = computed(() => homeValue.value - _downPayment.value)

  const downPayment = computed(() => _downPayment.value)
  const downPaymentPct = computed(() => _downPayment.value / homeValue.value)
  const setDownPayment = ({ num, pct }: { num?: number; pct?: number }) => {
    if (!num && !pct) {
      return
    }
    _downPayment.value = pct ? homeValue.value * pct : num || 0
  }

  /**
   * Annual rate of property tax, as a decimal.
   */
  const propertyTaxRate = shallowRef(0.011)
  /**
   * Annual PMI rate, as a decimal.
   */
  const pmiRate = shallowRef(0.01)

  /**
   * monthly principal and interest payment, computed using the formula:
   * ```math
   * M = P \frac{r(1 + r)^n}{(1 + r)^n - 1}
   * ```
   * where:
   * - `M` is the monthly payment
   * - `P` is the principal loan amount
   * - `r` is the monthly interest rate (annual rate / 12)
   * - `n` is the number of payments (loan term in months)
   */
  const monthlyPrincipalAndInterest = computed(() => {
    if (principal.value === 0) {
      return 0
    }
    if (rate.value === 0) {
      return principal.value / term.value / 12
    }
    const p = principal.value
    const r = rate.value / 12
    const n = term.value * 12
    const precomputed = Math.pow(1 + r, n)
    return (p * r * precomputed) / (precomputed - 1)
  })

  const monthlyPrincipal = computed(() => {
    return principal.value / term.value / 12
  })

  const monthlyInterest = computed(() => {
    return monthlyPrincipalAndInterest.value - monthlyPrincipal.value
  })

  const monthlyPaymentFormatted = computed(() => {
    return `$${monthlyPrincipalAndInterest.value.toFixed(0)}`
  })

  const monthlyPropertyTax = computed(() => {
    return (homeValue.value * propertyTaxRate.value) / 12
  })

  const monthlyPMI = computed(() => {
    return downPaymentPct.value < 0.2 ? (principal.value * pmiRate.value) / 12 : 0
  })

  const monthlyHomeInsurance = shallowRef(125)

  const monthlyHOA = shallowRef(0)

  const monthlyPayment = computed(() => {
    return (
      monthlyPrincipalAndInterest.value +
      monthlyPropertyTax.value +
      monthlyPMI.value +
      monthlyHomeInsurance.value +
      monthlyHOA.value
    )
  })

  const monthlyAssetLoss = computed(() => {
    return monthlyPayment.value - monthlyPrincipal.value
  })

  return {
    principal,
    homeValue,
    rate,
    term,
    propertyTaxRate,
    monthlyPrincipalAndInterest,
    monthlyPaymentFormatted,
    monthlyInterest,
    monthlyPropertyTax,
    downPayment,
    downPaymentPct,
    setDownPayment,
    monthlyPrincipal,
    monthlyPMI,
    pmiRate,
    monthlyHOA,
    monthlyHomeInsurance,
    monthlyPayment,
    monthlyAssetLoss
  }
})
