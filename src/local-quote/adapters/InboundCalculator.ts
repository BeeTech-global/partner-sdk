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
      exchangeRateAdjusted = this.adjustExchangeRate(quote, totalBaseAmount, amount, tax);
    }
    return {
      totalBaseAmount,
      exchangeRate: exchangeRateAdjusted
    }
  }

  adjustExchangeRate(quote: Quote, amount: number, totalQuotedAmount: number, tax: number) {
    const numberPrecision = this.precisionNumber.numberPrecision.bind(this.precisionNumber);
    const truncateMoney = this.precisionNumber.truncateMoney.bind(this.precisionNumber);

    const { spread } = quote;

    const bankFee = 0;
    const fixedTaxAmount = 0;
    const totalPercentualTax = tax;
    const totalReadjustedTax = 0;
    const spreadPrecision = numberPrecision(1).minus(((spread / 100))).toNumber();

    const marketRate =
    (amount + bankFee + fixedTaxAmount) /
    (totalQuotedAmount * spreadPrecision * (1 - totalPercentualTax - totalReadjustedTax));

    const exchangeRate = this.precisionNumber.truncateExchangeRate(marketRate * spreadPrecision);

    return exchangeRate;
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

  inverseFlow(totalAmount: number, exchangeRate: number, tax: number): number {
    const amount = totalAmount * (1 - tax);
    const value = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount)
        .times(exchangeRate).toNumber(),
    );
    return value;
  }
}
