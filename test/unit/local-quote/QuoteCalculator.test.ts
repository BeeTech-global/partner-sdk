import QuoteCalculator from '../../../src/local-quote/QuoteCalculator';
import { InvalidDirectionExpection, InvalidParamExpection, UnsupportedPurposeExpection } from '../../../src/local-quote/errors';


describe('Quote Calculator', () => {

  const validationSpy = {
    validate: jest.fn().mockReturnValue(null)
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('return an exception if the direction is not correct', () => {
    const amount = 300;
    const quote = {
      id: 'quote_id',
      direction: 'WHATEVER',
      purpose: 'CRYPTO',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 5.360662
    }

    const quoteCalculator = new QuoteCalculator(validationSpy);
    expect(
      () => quoteCalculator.calculate(quote, amount)
    ).toThrow(InvalidDirectionExpection)

  });

  it('return an exception if the purpose is not correct', () => {
    const amount = 300;
    const quote = {
      id: 'quote_id',
      direction: 'INBOUND',
      purpose: 'WHATEVER',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 5.360662
    }

    const quoteCalculator = new QuoteCalculator(validationSpy);
    expect(
      () => quoteCalculator.calculate(quote, amount)
    ).toThrow(UnsupportedPurposeExpection)

  });

  it('successfully return a quote with quoted currency BRL', () => {
    const amount = 200;
    const quote = {
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'USD',
      quotedCurrencyISO: 'BRL',
      exchangeRate: 4.8782054211
    }

    const quoteCalculator = new QuoteCalculator(validationSpy);
    expect(quoteCalculator.calculate(quote, amount)).toEqual({
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'USD',
      quotedCurrencyISO: 'BRL',
      exchangeRate: 4.8782054211,
      quotedAmount: 200,
      totalBaseAmount: 40.84,
      tax: 0.0038
    });
  });

  it('successfully return a quote with quoted currency USD', () => {
    const amount = 200;
    const quote = {
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 4.8782054211
    }

    const quoteCalculator = new QuoteCalculator(validationSpy);
    expect(quoteCalculator.calculate(quote, amount)).toEqual({
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 4.8782054211,
      quotedAmount: 200,
      totalBaseAmount: 979.35,
      tax: 0.0038
    });
  });

  it('return an exception if validation is not correct', () => {
    const amount = 300;
    const quote = {
      id: 'quote_id',
      direction: 'INBOUND',
      purpose: 'PAYMENT_PROCESSING',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'AUD',
      exchangeRate: 5.360662
    }

    jest.spyOn(validationSpy, 'validate').mockReturnValue(new InvalidParamExpection('error'));

    const quoteCalculator = new QuoteCalculator(validationSpy);
    expect(
     () => quoteCalculator.calculate(quote, amount)
    ).toThrow(new InvalidParamExpection('error'))

  });

});
