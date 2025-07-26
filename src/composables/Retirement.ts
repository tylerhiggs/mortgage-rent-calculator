import { computed, shallowRef } from 'vue'
import { useMortgageStore } from '@/stores/MortgageStore'

export function useRetirement() {
  const mortgageStore = useMortgageStore()

  const currentAge = shallowRef(24)
  const retirementAge = shallowRef(65)

  const yearsToRetirement = computed(() => {
    return retirementAge.value - currentAge.value
  })

  const monthlyContribution = shallowRef(300)
  const currentSavings = shallowRef(10000)
  const interestRate = shallowRef(0.08)

  /**
   * monthly rent in dollars
   */
  const rent = shallowRef(1200)

  /**
   * As percentage
   */
  const annualRentIncrease = shallowRef(0.03)

  /**
   * As percentage
   */
  const annualHomeAppreciation = shallowRef(0.05)

  const yearsToHomePurchase = shallowRef<number | undefined>()

  const rentIsHigherThanMortgage = computed(() => {
    return rent.value > mortgageStore.monthlyPayment
  })

  const mortgageIsHigherThanRent = computed(() => {
    return mortgageStore.monthlyPayment > rent.value
  })

  const isMortgagePaidBeforeRetirement = computed(() => {
    return mortgageStore.term < yearsToRetirement.value
  })

  /**
   * ```math
   * P_I (1 + r)^n + \frac{x((1 + r/12)^{12n} - 1)}{r/12}
   * ```
   *
   * @param r annual interest rate
   * @param n number of years invested
   * @param x monthly contribution
   * @returns dollar amount at the end of `n` years if `x` is contributed monthly
   */
  const futureValueWithContributions = (r: number, n: number, x: number) => {
    if (r === 0) return x * 12 * n
    return (x * ((1 + r / 12) ** (12 * n) - 1)) / (r / 12)
  }

  /**
   *
   * One time investment
   *
   * @param r annual interest rate
   * @param n number of years invested
   * @param i initial investment
   * @returns dollar amount if `i` grows at `r` for `n` years
   */
  const basicIraHelper = (r: number, n: number, i: number) => {
    return i * (1 + r) ** n
  }

  /**
   * IRA value at retirement if owning a home. This does not include
   * the value of the home itself.
   *
   * We assume if the mortgage is less than rent would have been,
   * the difference will be contributed to the IRA.
   *
   * We also assume that once the mortgage is paid off, what would
   * have been paid into the mortgage is contributed to the IRA.
   */
  const retirementIraValueHome = computed(() => {
    // See README for formula
    // If rent is higher than mortgage, the additional amount is contributed to the IRA
    const additionalContribution = rentIsHigherThanMortgage.value
      ? rent.value - mortgageStore.monthlyPayment
      : 0
    const totalContribution = monthlyContribution.value + additionalContribution

    const fromAfterMortgagePayments =
      yearsToRetirement.value > mortgageStore.term
        ? futureValueWithContributions(
            interestRate.value,
            yearsToRetirement.value - mortgageStore.term,
            mortgageStore.monthlyPayment
          )
        : 0

    const fromInitial = basicIraHelper(
      interestRate.value,
      yearsToRetirement.value,
      currentSavings.value
    )
    const fromContributions = futureValueWithContributions(
      interestRate.value,
      yearsToRetirement.value,
      totalContribution
    )
    const total = fromAfterMortgagePayments + fromInitial + fromContributions
    return { fromInitial, fromAfterMortgagePayments, fromContributions, total }
  })

  /**
   * IRA value at retirement if renting till retirement
   *
   * We assume the if renting till retirement, the down payment is
   * invested immediately.
   *
   * We also assume that the additional amount that would have been
   * paid into the mortgage is invested into the IRA.
   */
  const retirementIraValueRent = computed(() => {
    const additionalContribution =
      rent.value < mortgageStore.monthlyPayment ? mortgageStore.monthlyPayment - rent.value : 0
    const totalContribution = monthlyContribution.value + additionalContribution

    const fromRegularSavings = basicIraHelper(
      interestRate.value,
      yearsToRetirement.value,
      currentSavings.value
    )
    const fromWouldHaveBeenDownPayment = basicIraHelper(
      interestRate.value,
      yearsToRetirement.value,
      mortgageStore.downPayment
    )
    const fromContributions = futureValueWithContributions(
      interestRate.value,
      yearsToRetirement.value,
      totalContribution
    )
    const total = fromRegularSavings + fromWouldHaveBeenDownPayment + fromContributions
    return { fromRegularSavings, fromWouldHaveBeenDownPayment, fromContributions, total }
  })

  const retirementHomeValue = computed(() => {
    return mortgageStore.homeValue * (1 + annualHomeAppreciation.value) ** yearsToRetirement.value
  })

  return {
    currentAge,
    retirementAge,
    yearsToRetirement,
    monthlyContribution,
    currentSavings,
    interestRate,
    rent,
    annualRentIncrease,
    annualHomeAppreciation,
    yearsToHomePurchase,
    retirementIraValueHome,
    retirementIraValueRent,
    retirementHomeValue,
    rentIsHigherThanMortgage,
    mortgageIsHigherThanRent,
    isMortgagePaidBeforeRetirement
  }
}
