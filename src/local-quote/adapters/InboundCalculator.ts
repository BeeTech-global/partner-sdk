import { Currencies, ICalculus, LocalQuote, Quote } from "../Quote";
import PrecisionNumber from "../utils";

export default class InboundCalculator implements ICalculus{
  precisionNumber: PrecisionNumber;

  constructor() {
    this.precisionNumber = new PrecisionNumber();
  }

  calculate(quote: Quote, amount: number, tax: number): LocalQuote {
    const totalBaseAmount = this.baseAmountCalculator(quote, amount, tax);

    const localQuote = {
        ...quote,
        quotedAmount: amount,
        totalBaseAmount,
        tax
    };

    return localQuote;
  }

  baseAmountCalculator(quote: Quote, amount: number, tax: number): number {
    const { exchangeRate, quotedCurrencyISO } = quote;

    if (quotedCurrencyISO === Currencies.BRL) {
      return this.directFlow(amount, exchangeRate, tax);
    }

    return this.inverseFlow(amount, exchangeRate, tax);
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
