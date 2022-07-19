import { Currencies, ICalculus, LocalQuote, Quote } from "../Quote";
import { roundHalfEven } from "../utils";

export default class OutboundCalculator implements ICalculus {
  calculate(quote: Quote, amount: number, tax: number): LocalQuote {
    const totalBaseAmount = this.amountCalculator(quote, amount, tax);

    const localQuote = {
        ...quote,
        quotedAmount: amount,
        totalBaseAmount,
        tax
    };

    return localQuote;
  }

  amountCalculator(quote: Quote, amount: number, tax: number): number {
    const { exchangeRate, quotedCurrencyISO } = quote;

    if (quotedCurrencyISO === Currencies.BRL) {
      return this.quotedToBaseCurrency(amount, exchangeRate, tax);
    }

    return this.baseToQuotedCurrency(amount, exchangeRate, tax);
  }

  quotedToBaseCurrency(amount: number, exchangeRate: number, tax: number): number {
    const totalAmount = (amount / exchangeRate) * (1 - tax);
    return roundHalfEven(totalAmount, 2);
  }

  baseToQuotedCurrency(amount: number, exchangeRate: number, tax: number): number {
    const totalAmount = (amount * exchangeRate) * (1 + tax);
    return roundHalfEven(totalAmount, 2);
  }
}
