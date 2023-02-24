export enum Direction{
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export enum Purposes {
  CRYPTO = 'CRYPTO',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  COMEX = 'COMEX',
  EFX_OWN_ACCOUNT_ABROAD = 'EFX_OWN_ACCOUNT_ABROAD',
  EFX_UNILATERAL_TRANSFERS = 'EFX_UNILATERAL_TRANSFERS',
  OTHER_TECHNICAL_SERVICES = 'OTHER_TECHNICAL_SERVICES',
  CAPITAL_INCREASE = 'CAPITAL_INCREASE'
}

export enum Currencies {
  USD = 'USD',
  BRL = 'BRL',
  EUR = 'EUR',
  AUD = 'AUD',
  CHF = 'CHF'
}

export type Quote = {
  id: string,
  direction: string,
  purpose: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  exchangeRate: number,
  spread: number,
}

export type LocalQuote = {
  id: string,
  direction: string,
  purpose: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  quotedAmount: number,
  totalBaseAmount: number,
  exchangeRate: number,
  tax: number,
  taxBaseAmount: number,
}

export interface IQuoteCalculus {
  buildAdapter(direction: string): void,
  calculate(quote: Quote, amount: number): LocalQuote
}

export type AmountCalculator = {
  totalBaseAmount: number,
  taxBaseAmount: number,
  exchangeRate: number
}

export type BaseAmountCalculator = {
  totalBaseAmount: number,
  taxBaseAmount: number,
}

export interface ICalculus {
  calculate(quote: Quote, amount: number, tax: number): LocalQuote
  baseAmountCalculator(quote: Quote, amount: number, tax: number): AmountCalculator
  directFlow(amount: number, exchangeRate: number, tax: number): BaseAmountCalculator
  inverseFlow(amount: number, exchangeRate: number, tax: number): BaseAmountCalculator
}
