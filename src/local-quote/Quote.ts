export enum Direction{
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export enum Purposes {
  CRYPTO = 'CRYPTO',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING'
}

export enum Currencies {
  USD = 'USD',
  BRL = 'BRL',
  EUR = 'EUR'
}

export type Quote = {
  id: string,
  direction: string,
  purpose: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  exchangeRate: number,
}

export type LocalQuote = {
  id: string,
  direction: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  quotedAmount: number,
  totalBaseAmount: number,
  exchangeRate: number,
  tax: number,
}

export interface IQuoteCalculus {
  buildAdapter(direction: string): void,
  calculate(quote: Quote, amount: number): LocalQuote
}

export interface ICalculus {
  calculate(quote: Quote, amount: number, tax: number): LocalQuote
  quotedToBaseCurrency(amount: number, exchangeRate: number, tax: number): number
  baseToQuotedCurrency(amount: number, exchangeRate: number, tax: number): number
}
