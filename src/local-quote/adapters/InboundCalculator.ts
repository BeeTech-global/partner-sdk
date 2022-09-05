import {
  AmountCalculator,
  BaseAmountCalculator,
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
      taxBaseAmount,
      exchangeRate,
    } = this.baseAmountCalculator(quote, amount, tax);


    const localQuote = {
      ...quote,
      quotedAmount: amount,
      totalBaseAmount,
      exchangeRate,
      tax,
      taxBaseAmount,
    };

    return localQuote;
  }

  baseAmountCalculator(quote: Quote, amount: number, tax: number): AmountCalculator {
    const { exchangeRate, quotedCurrencyISO } = quote;
    let totalBaseAmount = 0, taxBaseAmount = 0, exchangeRateAdjusted = exchangeRate;

    switch (quotedCurrencyISO) {
      case Currencies.BRL:
        const directFlow = this.directFlow(amount, exchangeRate, tax);
        totalBaseAmount = directFlow.totalBaseAmount;
        taxBaseAmount = directFlow.taxBaseAmount;
        break;
      default:
        const inverseFlow = this.inverseFlow(amount, exchangeRate, tax);
        totalBaseAmount = inverseFlow.totalBaseAmount;
        taxBaseAmount = inverseFlow.taxBaseAmount;
        exchangeRateAdjusted = this.adjustExchangeRate(quote, inverseFlow.totalBaseAmount, amount, tax);
        break;
    }

    return {
      totalBaseAmount,
      taxBaseAmount,
      exchangeRate: exchangeRateAdjusted
    }
  }

  private adjustExchangeRate(quote: Quote, amount: number, totalQuotedAmount: number, tax: number) {
    const { spread } = quote;

    const bankFee = 0;
    const fixedTaxAmount = 0;
    const totalPercentualTax = tax;
    const totalReadjustedTax = 0;
    const spreadPrecision = this.precisionNumber
      .numberPrecision(1).minus(((spread / 100))).toNumber();

    const marketRate =
    (amount + bankFee + fixedTaxAmount) /
    (totalQuotedAmount * spreadPrecision * (1 - totalPercentualTax - totalReadjustedTax));

    const exchangeRate = this.precisionNumber.truncateExchangeRate(marketRate * spreadPrecision);

    return exchangeRate;
  }

  directFlow(amount: number, exchangeRate: number, tax: number): BaseAmountCalculator {
    const taxFlow = (1 + tax);
    const totalWithTaxBaseAmount = this.precisionNumber.truncateMoney(
      this.precisionNumber.numberPrecision(amount)
        .dividedBy(exchangeRate).toNumber(),
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

  inverseFlow(totalAmount: number, exchangeRate: number, tax: number): BaseAmountCalculator {
    const totalWithTaxBaseAmount = this.precisionNumber.truncateMoney(exchangeRate * totalAmount);
    const totalBaseAmount =  this.precisionNumber.truncateMoney(totalWithTaxBaseAmount * (1 - tax));
    const taxBaseAmount = this.precisionNumber.truncateMoney(totalWithTaxBaseAmount - totalBaseAmount);
    return {
      taxBaseAmount,
      totalBaseAmount,
    };
  }
}
