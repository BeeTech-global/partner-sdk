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

const outboundIOF = settings.taxes.outbound.IOF.value;
const inboundIOF = settings.taxes.inbound.IOF.value;

export default class QuoteCalculator {

  calculate(quote: Quote, amount: number): LocalQuote {

    const {exchangeRate, direction} = quote

    const IOF = direction === Direction.OUTBOUND ? outboundIOF : inboundIOF

    const totalBaseAmount = direction === Direction.OUTBOUND ?
      this.outboundCalculator(amount, exchangeRate) :
      this.inboundCalculator(amount, exchangeRate)

    const localQuote: LocalQuote = {
      ...quote,
      amount: amount,
      totalBaseAmount,
      tax: IOF
    }

    return localQuote
  }

  private outboundCalculator(quotedAmount: number, exchangeRate: number): number  {
    const totalBaseAmount = (quotedAmount * (1 - outboundIOF)) / exchangeRate;
    return roundHalfEven(totalBaseAmount,2)
  }

  private inboundCalculator(quotedAmount: number, exchangeRate: number): number {
    const totalBaseAmount = quotedAmount * exchangeRate * (1 - inboundIOF);
    return roundHalfEven(totalBaseAmount,2)
  }
}

