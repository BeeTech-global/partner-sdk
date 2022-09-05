import QuoteCalculator from '../../../src/local-quote/QuoteCalculator';
import {
  InvalidDirectionException,
  InvalidParamException,
  UnsupportedPurposeException,
} from '../../../src/local-quote/errors';


describe('Local Quote Calculator', () => {

  const validationSpy = {
    validate: jest.fn().mockReturnValue(null)
  };

  const validationSpyInvalidParamException = {
    validate: jest.fn().mockReturnValue(new InvalidParamException('error'))
  };

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
      exchangeRate: 5.3606666667,
      spread: 0.5,
    }

    const quoteCalculator = new QuoteCalculator(validationSpy);
    expect(
      () => quoteCalculator.calculate(quote, amount)
    ).toThrow(InvalidDirectionException)

  });

  describe('OUTBOUND', () => {

    it.each([
      [
        37115782.22,
        'PAYMENT_PROCESSING',
        5.128314,
        5.128314,
        191064682.85,
        0.0038,
        723297.27
      ],
      [
        92455.98,
        'PAYMENT_PROCESSING',
        5.136354,
        5.136354,
        476691.21,
        0.0038,
        1804.57
      ],
      [
        3681.20,
        'PAYMENT_PROCESSING',
        5.1354495,
        5.1354495,
        18976.46,
        0.0038,
        71.84
      ],
      [
        500,
        'PAYMENT_PROCESSING',
        5.134344,
        5.134344,
        2576.93,
        0.0038,
        9.76
      ],
      [
        200,
        'PAYMENT_PROCESSING',
        5.134344,
        5.134344,
        1030.77,
        0.0038,
        3.9
      ],
      [
        10000,
        'CRYPTO',
        5.184594,
        5.184594,
        52042.95,
        0.0038,
        197.01
      ],
      [
        0.01,
        'CRYPTO',
        5.184594,
        5.184594,
        0.05,
        0.0038,
        0
      ]
    ])('USD/BRL Direct', async (
      amount: number,
      purpose: string,
      exchangeRate: number,
      expectedExchangeRate: number,
      expectedTotalBaseAmount: number,
      expectedTax: number,
      expectedTaxAmount: number,
    ) => {
      const quote = {
        id: 'quote_id',
        direction: 'OUTBOUND',
        purpose: purpose,
        baseCurrencyISO: 'BRL',
        quotedCurrencyISO: 'USD',
        exchangeRate: exchangeRate,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpy);
      expect(quoteCalculator.calculate(quote, amount)).toEqual({
        id: quote.id,
        direction: quote.direction,
        purpose: quote.purpose,
        baseCurrencyISO: quote.baseCurrencyISO,
        quotedCurrencyISO: quote.quotedCurrencyISO,
        exchangeRate: expectedExchangeRate,
        quotedAmount: amount,
        totalBaseAmount: expectedTotalBaseAmount,
        tax: expectedTax,
        taxBaseAmount: expectedTaxAmount,
        spread: quote.spread
      });

    });

    it.each([
      [
        37115782.22,
        'PAYMENT_PROCESSING',
        5.1319320023,
        5.1319320023,
        7204942.73,
        0.0038,
        140506.05
      ],
      [
        92455.98,
        'PAYMENT_PROCESSING',
        5.132936506,
        5.132936506,
        17944.11,
        0.0038,
        350
      ],
      [
        3681.20,
        'PAYMENT_PROCESSING',
        5.1329177215,
        5.1329177215,
        714.46,
        0.0038,
        13.94
      ],
      [
        500,
        'PAYMENT_PROCESSING',
        5.1330089929,
        5.1330089929,
        97.04,
        0.0038,
        1.89
      ],
      [
        200,
        'PAYMENT_PROCESSING',
        5.1311583072,
        5.1311583072,
        38.83,
        0.0038,
        0.76
      ],
      [
        100000,
        'CRYPTO',
        5.2116073791,
        5.2116073791,
        19115.3,
        0.0038,
        378.56
      ],
      [
        10000,
        'CRYPTO',
        5.2116073791,
        5.2116073791,
        1911.53,
        0.0038,
        37.86
      ],
      [
        150,
        'CRYPTO',
        5.2116073791,
        5.2121436275,
        28.67,
        0.0038,
        0.57
      ],
      [
        1,
        'CRYPTO',
        5.2116073791,
        5.243233607,
        0.19,
        0.0038,
        0
      ],
      [
        10000,
        'CRYPTO',
        5.1851058416,
        5.1851058415,
        1921.3,
        0.0038,
        37.86
      ],
      [
        0.01,
        'CRYPTO',
        5.1851058416,
        5.1851058416,
        0,
        0.0038,
        0
      ],
    ])('USD/BRL Inverse', async (
      amount: number,
      purpose: string,
      exchangeRate: number,
      expectedExchangeRate: number,
      expectedTotalBaseAmount: number,
      expectedTax: number,
      expectedTaxAmount: number,
    ) => {
      const quote = {
        id: 'quote_id',
        direction: 'OUTBOUND',
        purpose: purpose,
        baseCurrencyISO: 'USD',
        quotedCurrencyISO: 'BRL',
        exchangeRate: exchangeRate,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpy);
      expect(quoteCalculator.calculate(quote, amount)).toEqual({
        id: quote.id,
        direction: quote.direction,
        purpose: quote.purpose,
        baseCurrencyISO: quote.baseCurrencyISO,
        quotedCurrencyISO: quote.quotedCurrencyISO,
        exchangeRate: expectedExchangeRate,
        quotedAmount: amount,
        totalBaseAmount: expectedTotalBaseAmount,
        tax: expectedTax,
        taxBaseAmount: expectedTaxAmount,
        spread: quote.spread
      });

    });

    it('throw an exception when the purpose is invalid', () => {
      const amount = 300;
      const quote = {
        id: 'quote_id',
        direction: 'OUTBOUND',
        purpose: 'WHATEVER',
        baseCurrencyISO: 'BRL',
        quotedCurrencyISO: 'USD',
        exchangeRate: 5.3606666667,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpy);
      expect(
        () => quoteCalculator.calculate(quote, amount)
      ).toThrow(UnsupportedPurposeException)

    });

    it('throw an exception when quotedCurrencyISO is invalid', () => {
      const amount = 300;
      const quote = {
        id: 'quote_id',
        direction: 'OUTBOUND',
        purpose: 'PAYMENT_PROCESSING',
        baseCurrencyISO: 'BRL',
        quotedCurrencyISO: 'XXX',
        exchangeRate: 5.3606666667,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpyInvalidParamException);
      expect(
       () => quoteCalculator.calculate(quote, amount)
      ).toThrow(new InvalidParamException('error'))

    });

  });

  describe('INBOUND', () => {

    it.each([
      [
        92455.98,
        'CRYPTO',
        4.9957629246,
        18577.21,
        0.0038,
        70.33
      ],
      [
        3681.20,
        'CRYPTO',
        4.9912545936,
        740.33,
        0.0038,
        2.8
      ],
      [
        500,
        'CRYPTO',
        4.9860395464,
        100.66,
        0.0038,
        0.38
      ],
      [
        200,
        'CRYPTO',
        4.9850451268,
        40.27,
        0.0038,
        0.15
      ],
      [
        0.01,
        'CRYPTO',
        4.9850451268,
        0,
        0.0038,
        0
      ],
    ])('USD/BRL Direct', async (
      amount: number,
      purpose: string,
      exchangeRate: number,
      expectedTotalBaseAmount: number,
      expectedTax: number,
      expectedTaxAmount: number,
    ) => {
      const quote = {
        id: 'quote_id',
        direction: 'INBOUND',
        purpose: purpose,
        baseCurrencyISO: 'USD',
        quotedCurrencyISO: 'BRL',
        exchangeRate: exchangeRate,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpy);
      expect(quoteCalculator.calculate(quote, amount)).toEqual({
        id: quote.id,
        direction: quote.direction,
        purpose: quote.purpose,
        baseCurrencyISO: quote.baseCurrencyISO,
        quotedCurrencyISO: quote.quotedCurrencyISO,
        exchangeRate: quote.exchangeRate,
        quotedAmount: amount,
        totalBaseAmount: expectedTotalBaseAmount,
        tax: expectedTax,
        taxBaseAmount: expectedTaxAmount,
        spread: quote.spread
      });
    });

    it.each([
      [
        100000,
        'CRYPTO',
        5.13231675,
        5.1323168039,
        511281.4,
        0.0038,
        1950.28
      ],
      [
        10000,
        'CRYPTO',
        5.13231675,
        5.1323168039,
        51128.14,
        0.0038,
        195.03
      ],
      [
        150,
        'CRYPTO',
        5.13231675,
        5.1323027505,
        766.92,
        0.0038,
        2.93
      ],
      [
        1,
        'CRYPTO',
        5.13231675,
        5.1294920699,
        5.11,
        0.0038,
        0.02
      ],
      [
        0.01,
        'CRYPTO',
        5.13231675,
        5.0190724754,
        0.05,
        0.0038,
        0
      ],
    ])('USD/BRL Inverse', async (
      amount: number,
      purpose: string,
      exchangeRate: number,
      expectedExchangeRate: number,
      expectedTotalBaseAmount: number,
      expectedTax: number,
      expectedTaxAmount: number,
    ) => {
      const quote = {
        id: 'quote_id',
        direction: 'INBOUND',
        purpose: purpose,
        baseCurrencyISO: 'BRL',
        quotedCurrencyISO: 'USD',
        exchangeRate: exchangeRate,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpy);
      expect(quoteCalculator.calculate(quote, amount)).toEqual({
        id: quote.id,
        direction: quote.direction,
        purpose: quote.purpose,
        baseCurrencyISO: quote.baseCurrencyISO,
        quotedCurrencyISO: quote.quotedCurrencyISO,
        exchangeRate: expectedExchangeRate,
        quotedAmount: amount,
        totalBaseAmount: expectedTotalBaseAmount,
        tax: expectedTax,
        taxBaseAmount: expectedTaxAmount,
        spread: quote.spread
      });

    });

    it('throw an exception when the purpose is invalid', () => {
      const amount = 300;
      const quote = {
        id: 'quote_id',
        direction: 'INBOUND',
        purpose: 'WHATEVER',
        baseCurrencyISO: 'BRL',
        quotedCurrencyISO: 'USD',
        exchangeRate: 5.3606666667,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpy);
      expect(
        () => quoteCalculator.calculate(quote, amount)
      ).toThrow(UnsupportedPurposeException)

    });

    it('throw an exception when quotedCurrencyISO is invalid', () => {
      const amount = 300;
      const quote = {
        id: 'quote_id',
        direction: 'INBOUND',
        purpose: 'PAYMENT_PROCESSING',
        baseCurrencyISO: 'BRL',
        quotedCurrencyISO: 'XXX',
        exchangeRate: 5.3606666667,
        spread: 0.5,
      }

      const quoteCalculator = new QuoteCalculator(validationSpyInvalidParamException);
      expect(
       () => quoteCalculator.calculate(quote, amount)
      ).toThrow(new InvalidParamException('error'))
    });

  });
});
