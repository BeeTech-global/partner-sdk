import { AmountCalculator, BaseAmountCalculator, Currencies, ICalculus, LocalQuote, Quote } from "../Quote";
import PrecisionNumber from "../utils";

export default class OutboundCalculator implements ICalculus {
  precisionNumber: PrecisionNumber;

  constructor() {
    this.precisionNumber = new PrecisionNumber();
  }

  calculate(quote: Quote, amount: number, taxRate: number): LocalQuote {

    const percentualTaxRate = taxRate/100
    const {
      totalBaseAmount,
      taxBaseAmount,
      exchangeRate,
    } = this.baseAmountCalculator(quote,  amount, percentualTaxRate);

    const localQuote = {
      ...quote,
      quotedAmount: amount,
      totalBaseAmount,
      exchangeRate,
      tax: percentualTaxRate,
      taxBaseAmount,
    };

    return localQuote;
  }

  baseAmountCalculator(quote: Quote, amount: number, tax: number): AmountCalculator {
    const { exchangeRate, quotedCurrencyISO } = quote;
    let totalBaseAmount = 0, taxBaseAmount = 0, exchangeRateAdjusted = exchangeRate;

    switch (quotedCurrencyISO) {
      case Currencies.BRL:
        const inverseFlow = this.inverseFlow(amount, exchangeRate, tax);
        totalBaseAmount = inverseFlow.totalBaseAmount;
        taxBaseAmount = inverseFlow.taxBaseAmount;
        exchangeRateAdjusted = this.adjustExchangeRate(quote, inverseFlow.totalBaseAmount, amount, tax);
        break;
      default:
        const directFlow = this.directFlow(amount, exchangeRate, tax);
        totalBaseAmount = directFlow.totalBaseAmount;
        taxBaseAmount = directFlow.taxBaseAmount;
        break;
    }

    return {
      totalBaseAmount,
      taxBaseAmount,
      exchangeRate: exchangeRateAdjusted
    }
  }

  adjustExchangeRate(quote: Quote, amount: number, totalQuotedAmount: number, tax: number) {
    if (amount === 0) {
      return quote.exchangeRate;
    }

    const { spread } = quote;
    const bankFee = 0;
    const fixedTaxAmount = 0;
    const totalPercentualTax = tax;
    const totalReadjustedTax = 0;
    const spreadPrecision = this.precisionNumber
      .numberPrecision(((spread / 100))).plus(1).toNumber();

    const marketRate =
    (totalQuotedAmount - bankFee - fixedTaxAmount) /
    (amount * spreadPrecision * (1 + totalPercentualTax + totalReadjustedTax));

    const exchangeRate = this.precisionNumber.truncateExchangeRate(marketRate * spreadPrecision);

    return exchangeRate;
  }

  inverseFlow(totalAmount: number, exchangeRate: number, tax: number): BaseAmountCalculator {
    const totalWithTaxBaseAmount = this.precisionNumber.truncateMoney(totalAmount / (1 + tax));
    const totalBaseAmount = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(totalWithTaxBaseAmount)
        .dividedBy(exchangeRate).toNumber(),
    );
    const taxBaseAmount = this.precisionNumber.truncateMoney(totalWithTaxBaseAmount * tax);
    return {
      taxBaseAmount,
      totalBaseAmount,
    };
  }

  directFlow(amount: number, exchangeRate: number, tax: number): BaseAmountCalculator {
    const taxFlow = (1 + tax);
    const totalWithTaxBaseAmount = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount)
        .times(exchangeRate).toNumber(),
    );
    const totalBaseAmount = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(totalWithTaxBaseAmount)
        .times(taxFlow).toNumber(),
    );
    const taxBaseAmount = this.precisionNumber.truncateMoney(totalBaseAmount - totalWithTaxBaseAmount);
    return {
      taxBaseAmount,
      totalBaseAmount,
    };
  }
}
