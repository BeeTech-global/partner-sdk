import { Currencies, ICalculus, LocalQuote, Quote } from "../Quote";
import PrecisionNumber from "../utils";

export default class OutboundCalculator implements ICalculus {
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
      return this.inverseFlow(amount, exchangeRate, tax);
    }

    return this.directFlow(amount, exchangeRate, tax);
  }

  inverseFlow(amount: number, exchangeRate: number, tax: number): number {
    const taxFlow = (1 + tax)
    const exchangeRateTaxPrecision = exchangeRate * taxFlow;
    const value = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount)
        .dividedBy(exchangeRateTaxPrecision).toNumber(),
    );
    return value;
  }

  directFlow(amount: number, exchangeRate: number, tax: number): number {
    const taxFlow = (1 + tax);
    const exchangeRatePrecision = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount).times(exchangeRate).toNumber(),
    );
    const value = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(exchangeRatePrecision)
        .times(taxFlow).toNumber(),
    );
    return value;
  }
}
