import { Currencies, Direction, ICalculus, LocalQuote, Quote } from "../Quote";
import { roundHalfEven } from "../utils";

export default class InboundCalculator implements ICalculus{

  calculate(quote: Quote, amount: number, tax: number): LocalQuote {
    const totalBaseAmount = this.totalBaseAmountCalculator(quote, amount, tax);
    const quotedAmount = amount;

    const localQuote = {
        ...quote,
        quotedAmount,
        totalBaseAmount,
        tax
    };

    return localQuote;
  }

  private totalBaseAmountCalculator(quote: Quote, amount: number, tax: number): number {
    const { exchangeRate, quotedCurrencyISO } = quote;

    if (quotedCurrencyISO === Currencies.BRL) {
      return this.quotedToBaseCurrency(amount, exchangeRate, tax);
    }

    return this.baseToQuotedCurrency(amount, exchangeRate, tax);
  }

  baseToQuotedCurrency(amount: number, exchangeRate: number, tax: number): number {
    const totalBaseAmount = (amount / exchangeRate) * (1 - tax);
    return roundHalfEven(totalBaseAmount, 2);
  }

  quotedToBaseCurrency(amount: number, exchangeRate: number, tax: number): number {
    const totalBaseAmount = amount * exchangeRate * (1 - tax);
    return roundHalfEven(totalBaseAmount, 2);
  }
}
