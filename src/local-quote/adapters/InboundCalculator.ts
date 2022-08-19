import {
  AmountCalculator,
  Currencies,
  ICalculus,
  LocalQuote,
  Quote,
} from "../Quote";
import PrecisionNumber from "../utils";

export default class InboundCalculator implements ICalculus{
  precisionNumber: PrecisionNumber;

  constructor() {
    this.precisionNumber = new PrecisionNumber();
  }

  calculate(quote: Quote, amount: number, tax: number): LocalQuote {
    const {
      totalBaseAmount,
      exchangeRate,
    } = this.baseAmountCalculator(quote, amount, tax);

    const localQuote = {
      ...quote,
      quotedAmount: amount,
      totalBaseAmount,
      exchangeRate,
      tax
    };

    return localQuote;
  }

  baseAmountCalculator(quote: Quote, amount: number, tax: number): AmountCalculator {
    const { exchangeRate, quotedCurrencyISO } = quote;
    let totalBaseAmount = 0, exchangeRateAdjusted = exchangeRate;

    if (quotedCurrencyISO === Currencies.BRL) {
      totalBaseAmount = this.directFlow(amount, exchangeRate, tax);
    } else {
      totalBaseAmount = this.inverseFlow(amount, exchangeRate, tax);
    }
    return {
      totalBaseAmount,
      exchangeRate: exchangeRateAdjusted
    }
  }

  directFlow(amount: number, exchangeRate: number, tax: number): number {
    const taxFlow = (1 - tax);
    const exchangeRatePrecision = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount)
        .dividedBy(exchangeRate).toNumber(),
    );
    const value = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(exchangeRatePrecision)
        .times(taxFlow).toNumber(),
    );
    return value;
  }

  inverseFlow(amount: number, exchangeRate: number, tax: number): number {
    const taxFlow = (1 - tax)
    const exchangeRateTaxPrecision = exchangeRate * taxFlow;
    const value = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount)
        .times(exchangeRateTaxPrecision).toNumber(),
    );
    return value;
  }
}
