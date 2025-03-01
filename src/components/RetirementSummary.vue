<script setup lang="ts">
import NumberInput from '@/lib/NumberInput.vue'
import { useRetirement } from '@/composables/Retirement'
import { useMortgageStore } from '@/stores/MortgageStore'
import PieSum from '@/lib/PieSum.vue'
import { emerald, amber, fuchsia, indigo } from 'tailwindcss/colors'
import { computed } from 'vue'

const {
  currentAge,
  retirementAge,
  monthlyContribution,
  currentSavings,
  interestRate,
  rent,
  annualHomeAppreciation,
  retirementHomeValue,
  retirementIraValueHome,
  retirementIraValueRent,
  mortgageIsHigherThanRent,
  rentIsHigherThanMortgage,
  isMortgagePaidBeforeRetirement
} = useRetirement()

const mortgageStore = useMortgageStore()

const homeRetirementPercentages = computed(() => [
  {
    name: 'Current Savings',
    value: retirementIraValueHome.value.fromInitial,
    color: emerald['300'],
    info: `The amount you currently have saved for retirement that has grown for ${
      retirementAge.value - currentAge.value
    } years by your retirement age (${retirementAge.value}) at a rate of ${
      interestRate.value * 100
    }%. This does not include any of the amount you would use for a down payment.`
  },
  {
    name: 'Home Appreciation',
    value: retirementHomeValue.value,
    color: amber['300'],
    info: `The value of your home at your retirement age (${retirementAge.value}) after ${
      retirementAge.value - currentAge.value
    } years of appreciation at a rate of ${annualHomeAppreciation.value * 100}%.`
  },
  {
    name: 'IRA Contributions',
    value: retirementIraValueHome.value.fromContributions,
    color: fuchsia['300'],
    info: `This is the portion of your retirement savings that comes from your monthly IRA contributions of $${
      monthlyContribution.value
    }${
      rentIsHigherThanMortgage.value
        ? ` + $${(rent.value - mortgageStore.monthlyPayment).toFixed(
            0
          )} (how much you save by renting instead of buying)`
        : ''
    } growing at a rate of ${interestRate.value * 100}% until your retirement age (${
      retirementAge.value
    }).`
  },
  {
    name: 'Additional Contributions (After Mortgage)',
    value: retirementIraValueHome.value.fromAfterMortgagePayments,
    color: indigo['300'],
    info: `This is the portion of your retirement savings that comes from putting extra money into your IRA after your mortgage is paid off. This is the amount you were paying for your mortgage (${
      retirementIraValueHome.value.fromAfterMortgagePayments
    }) growing at a rate of ${interestRate.value * 100}% until your retirement age (${
      retirementAge.value
    }).`
  }
])

const rentRetirementPercentages = computed(() => [
  {
    name: 'Current Savings',
    value: retirementIraValueRent.value.fromRegularSavings,
    color: emerald['300'],
    info: `The amount you currently have saved for retirement that has grown for ${
      retirementAge.value - currentAge.value
    } years by your retirement age (${retirementAge.value}) at a rate of ${
      interestRate.value * 100
    }%. This does not include any of the amount you would have used for a down payment.`
  },
  {
    name: 'Down Payment Savings',
    value: retirementIraValueRent.value.fromWouldHaveBeenDownPayment,
    color: amber['300'],
    info: `If you choose to rent instead of buy, you can invest the amount you would have used for a down payment (${
      retirementIraValueRent.value.fromWouldHaveBeenDownPayment
    }) in your IRA. This amount grows at a rate of ${
      interestRate.value * 100
    }% until your retirement age (${retirementAge.value}).`
  },
  {
    name: 'IRA Contributions',
    value: retirementIraValueRent.value.fromContributions,
    color: fuchsia['300'],
    info: `This is the portion of your retirement savings that comes from your monthly IRA contributions of $${
      monthlyContribution.value
    }${
      mortgageIsHigherThanRent.value
        ? ` + $${(mortgageStore.monthlyPayment - rent.value).toFixed(
            0
          )} (how much you save by renting instead of buying)`
        : ''
    } growing at a rate of ${interestRate.value * 100}% until your retirement age (${
      retirementAge.value
    }).`
  }
])
</script>

<template>
  <div
    class="2xl:w-8/12 w-full flex flex-col items-center bg-slate-100 dark:bg-slate-800 dark:text-slate-100 rounded-2xl p-4"
  >
    <h2 class="font-bold text-2xl">Retirement Breakdown</h2>
    <div class="flex lg:flex-row flex-col lg:justify-around items-center w-full">
      <div class="flex flex-col w-full">
        <div class="flex sm:flex-row flex-col">
          <NumberInput
            size="sm"
            label="Current Age"
            :value="currentAge"
            :min="0"
            :max="100"
            @change="(value: number) => (currentAge = value)"
          />
          <NumberInput
            size="sm"
            label="Retirement Age"
            :value="retirementAge"
            :min="0"
            :max="100"
            @change="(value: number) => (retirementAge = value)"
          />
        </div>
        <NumberInput
          label="Monthly IRA Contribution"
          :value="monthlyContribution"
          :min="0"
          @change="(value: number) => (monthlyContribution = value)"
          isDollar
          info="The amount you will contribute to your retirement account each month."
        />
        <NumberInput
          label="Interest Rate"
          size="sm"
          :value="interestRate * 100"
          :min="0.001"
          :max="100"
          @change="(value: number) => (interestRate = value / 100)"
          isPercent
          info="The annual interest rate of your retirement account. This is the interest rate you will earn on your retirement savings. Historically, this is somewhere between 8 and 12 percent."
        />
        <NumberInput
          label="Current Savings"
          :value="currentSavings"
          :min="0"
          @change="(value: number) => (currentSavings = value)"
          isDollar
          info="The amount you currently have saved for retirement. Do not include any of the amount you would use for the down paymen (we already account for that in our calculations)."
        />
        <NumberInput
          label="Rent"
          :value="rent"
          :min="0"
          @change="(value: number) => (rent = value)"
          isDollar
          info="The amount you will pay in rent each month."
        />
        <NumberInput
          label="Annual Home Appreciation"
          size="sm"
          :value="annualHomeAppreciation * 100"
          :min="0"
          :max="100"
          @change="(value: number) => (annualHomeAppreciation = value / 100)"
          isPercent
          info="The annual appreciation of your home. Historically, this is somewhere between 3 and 5 percent."
        />
      </div>
      <div class="flex flex-col mt-4 w-full sm:w-auto">
        <h3 class="font-bold text-xl">Retirement Assets if you...</h3>
        <PieSum
          title="Purchase a Home"
          pieTitle="Home Retirement"
          :info="`Invest in your home which is an appreciating asset${
            rentIsHigherThanMortgage
              ? ', invest what you save by paying less on your mortgage than you would have for rent'
              : ''
          }${
            isMortgagePaidBeforeRetirement
              ? ', and invest more after the mortgage is paid off by contributing what you were paying for the mortgage in addition to your monthly IRA contributions.'
              : '.'
          }`"
          :values="homeRetirementPercentages"
        />
        <PieSum
          title="Rent"
          pieTitle="Rent Retirement"
          :info="`Invest what you would have paid for a down payment${
            mortgageIsHigherThanRent
              ? ', and invest what you save by paying less for rent than you would have for a mortgage.'
              : '.'
          }`"
          :values="rentRetirementPercentages"
        />
      </div>
    </div>
  </div>
</template>
