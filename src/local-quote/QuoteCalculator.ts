import settings from "./settings";
import { roundHalfEven } from "./utils";

export enum Direction{
  INBOUND='INBOUND',
  OUTBOUND='OUTBOUND'
}

export type Quote = {
  id: string,
  direction: Direction.INBOUND | Direction.OUTBOUND,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  exchangeRate: number,
}

type LocalQuote = {
  id: string,
  direction: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  amount: number,
  totalBaseAmount: number,
  exchangeRate: number,
  tax: number,
}

const IOF = settings.taxes.IOF.value;

export default class QuoteCalculator {

  calculate(quote: Quote, amount: number): LocalQuote {

    const {exchangeRate, direction} = quote

    const roundedQuotedAmount = roundHalfEven(amount,2)

    const roundedExchangeRate = roundHalfEven(exchangeRate,6)

    const totalBaseAmount = direction === Direction.OUTBOUND ?
      this.outboundCalculator(roundedQuotedAmount, roundedExchangeRate) :
      this.inboundCalculator(roundedQuotedAmount, roundedExchangeRate)

    const localQuote: LocalQuote = {
      ...quote,
      amount: roundedQuotedAmount,
      totalBaseAmount,
      tax: IOF
    }

    return localQuote
  }

  private inboundCalculator(quotedAmount: number, exchangeRate: number): number  {
    const totalBaseAmount = (quotedAmount * (1 - IOF)) / exchangeRate;
    return roundHalfEven(totalBaseAmount,2)
  }

  private outboundCalculator(quotedAmount: number, exchangeRate: number): number {
    const totalBaseAmount = quotedAmount * exchangeRate * (1 - IOF);
    return roundHalfEven(totalBaseAmount,2)
  }
}
