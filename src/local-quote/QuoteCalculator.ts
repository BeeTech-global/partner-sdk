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
  quotedAmount: number,
  totalBaseAmount: number,
  exchangeRate: number,
  tax: number,
}

const outboundIOF = settings.taxes.outbound.IOF.value;
const inboundIOF = settings.taxes.inbound.IOF.value;

export default class QuoteCalculator {

  calculate(quote: Quote, amount: number): LocalQuote {

    const {exchangeRate, direction} = quote

    const IOF = direction === Direction.OUTBOUND ? outboundIOF : inboundIOF

    const totalBaseAmount = direction === Direction.OUTBOUND ?
      amount :
      this.inboundCalculator(amount, exchangeRate)

    const quotedAmount = direction === Direction.OUTBOUND ?
      this.outboundCalculator(amount, exchangeRate) :
      amount

    const localQuote: LocalQuote = {
      ...quote,
      quotedAmount,
      totalBaseAmount,
      tax: IOF
    }

    return localQuote
  }

  private outboundCalculator(baseAmount: number, exchangeRate: number): number  {
    const totalQuotedAmount = (baseAmount * exchangeRate) * (1 + outboundIOF)
    return roundHalfEven(totalQuotedAmount,2)
  }

  private inboundCalculator(quotedAmount: number, exchangeRate: number): number {
    const totalBaseAmount = quotedAmount * exchangeRate * (1 - inboundIOF);
    return roundHalfEven(totalBaseAmount,2)
  }
}

