import { Currencies, Direction, Purposes, Quote } from '../../../src/local-quote/Quote';
import QuoteCalculator from '../../../src/local-quote/QuoteCalculator';
import { InvalidDirectionExpection, UnsupportedPurposeExpection } from '../../../src/local-quote/errors';


describe('Quote Calculator', () => {

  it('return an exception if the direction is not correct', () => {
    const amount = 300;
    const quote: Quote = {
      id: 'quote_id',
      direction: 'WHATEVER' as Direction,
      purpose: 'CRYPTO' as Purposes,
      baseCurrencyISO: 'BRL' as Currencies,
      quotedCurrencyISO: 'USD' as Currencies,
      exchangeRate: 5.360662
    }

    const quoteCalculator = new QuoteCalculator();
    expect(
      () => quoteCalculator.calculate(quote, amount)
    ).toThrow(InvalidDirectionExpection)

  });

  it('return an exception if the purpose is not correct', () => {
    const amount = 300;
    const quote: Quote = {
      id: 'quote_id',
      direction: 'INBOUND' as Direction,
      purpose: 'WHATEVER' as Purposes,
      baseCurrencyISO: 'BRL' as Currencies,
      quotedCurrencyISO: 'USD' as Currencies,
      exchangeRate: 5.360662
    }

    const quoteCalculator = new QuoteCalculator();
    expect(
      () => quoteCalculator.calculate(quote, amount)
    ).toThrow(UnsupportedPurposeExpection)

  });

  it('successfully return a quote', () => {
    const amount = 200;
    const quote: Quote = {
      id: 'quote_id',
      direction: 'OUTBOUND' as Direction,
      purpose: 'PAYMENT_PROCESSING' as Purposes,
      baseCurrencyISO: 'BRL' as Currencies,
      quotedCurrencyISO: 'USD' as Currencies,
      exchangeRate: 4.8782054211
    }

    const quoteCalculator = new QuoteCalculator();
    expect(quoteCalculator.calculate(quote, amount)).toEqual({
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 4.8782054211,
      quotedAmount: 979.35,
      totalBaseAmount: 200,
      tax: 0.0038
    });
  });

});
