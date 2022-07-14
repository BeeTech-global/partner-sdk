import { Currencies, ICalculus, LocalQuote, Quote } from "../Quote";
import { roundHalfEven } from "../utils";

export default class OutboundCalculator implements ICalculus {

  calculate(quote: Quote, amount: number, tax: number): LocalQuote {
    const totalBaseAmount = amount;
    const quotedAmount = this.totalQuotedAmountCalculator(quote, amount, tax);

    const localQuote = {
        ...quote,
        quotedAmount,
        totalBaseAmount,
        tax
    };

    return localQuote;
  }

  private totalQuotedAmountCalculator(quote: Quote, amount: number, tax: number): number {
    const { exchangeRate, quotedCurrencyISO } = quote;

    if (quotedCurrencyISO === Currencies.BRL) {
      return this.quotedToBaseCurrency(amount, exchangeRate, tax);
    }

    return this.baseToQuotedCurrency(amount, exchangeRate, tax);
  }

  baseToQuotedCurrency(amount: number, exchangeRate: number, tax: number): number {
    const totalQuotedAmount = (amount * exchangeRate) * (1 + tax);
    return roundHalfEven(totalQuotedAmount, 2);
  }

  quotedToBaseCurrency(amount: number, exchangeRate: number, tax: number): number {
    const totalQuotedAmount = (amount / exchangeRate) * (1 - tax);
    return roundHalfEven(totalQuotedAmount, 2);
  }
}
