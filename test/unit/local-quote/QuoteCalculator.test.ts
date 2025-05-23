import QuoteCalculator from '../../../src/local-quote/QuoteCalculator';
import TaxCalculator from '../../../src/tax-calculator/TaxCalculator';
import { Direction, Purposes } from '../../../src/local-quote/Quote';

let quoteCalculator: QuoteCalculator

describe('Local Quote Calculator', () => {

  jest.spyOn(TaxCalculator,'getTaxRate')

  const validationSpy = {
    validate: jest.fn().mockReturnValue(null)
  };

  beforeEach(() => {
    quoteCalculator = new QuoteCalculator(validationSpy);
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates the received params', () => {
    const amount = 300;
    const quote = {
      id: 'quote_id',
      direction: 'INVALID',
      purpose: 'INVALID',
      baseCurrencyISO: 'INVALID',
      quotedCurrencyISO: 'INVALID',
      exchangeRate: 0,
      spread: 0,
    }

    expect(() => quoteCalculator.calculate(quote, amount)).toThrowError()
  });

  it('calls validation function to check params', () => {
    const amount = 300;
    const quote = {
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'CRYPTO',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 5.3606666667,
      spread: 0.5,
    }

    quoteCalculator.calculate(quote,amount)

    expect(validationSpy.validate).toBeCalledWith(quote)
  })

  it('calls taxCalculator to get the taxRate', () => {
    const amount = 300;
    const quote = {
      id: 'quote_id',
      direction: 'OUTBOUND',
      purpose: 'CRYPTO',
      baseCurrencyISO: 'BRL',
      quotedCurrencyISO: 'USD',
      exchangeRate: 5.3606666667,
      spread: 0.5,
    }

    quoteCalculator.calculate(quote,amount)

    expect(TaxCalculator.getTaxRate).toBeCalledWith(
      quote.purpose as Purposes,
      quote.direction as Direction,
    )
  })

  describe('OUTBOUND', () => {

    it.each([
      [
        37115782.22,
        'PAYMENT_PROCESSING',
        5.128314,
        5.128314,
        197003334.08,
        0.035,
        6661948.5
      ],
      [
        92455.98,
        'PAYMENT_PROCESSING',
        5.136354,
        5.136354,
        491507.67,
        0.035,
        16621.03
      ],
      [
        3681.20,
        'PAYMENT_PROCESSING',
        5.1354495,
        5.1354495,
        19566.28,
        0.035,
        661.66
      ],
      [
        500,
        'PAYMENT_PROCESSING',
        5.134344,
        5.134344,
        2657.02,
        0.035,
        89.85
      ],
      [
        200,
        'PAYMENT_PROCESSING',
        5.134344,
        5.134344,
        1062.81,
        0.035,
        35.94
      ],
      [
        10000,
        'CRYPTO',
        5.184594,
        5.184594,
        53660.55,
        0.035,
        1814.61
      ],
      [
        0.01,
        'CRYPTO',
        5.184594,
        5.184594,
        0.05,
        0.035,
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
        6987750.25,
        0.035,
        1255123.07
      ],
      [
        92455.98,
        'PAYMENT_PROCESSING',
        5.132936506,
        5.132936506,
        17403.19,
        0.035,
        3126.53
      ],
      [
        3681.20,
        'PAYMENT_PROCESSING',
        5.1329177215,
        5.1329177215,
        692.92,
        0.035,
        124.48
      ],
      [
        500,
        'PAYMENT_PROCESSING',
        5.1330089929,
        5.1330089929,
        94.11,
        0.035,
        16.91
      ],
      [
        200,
        'PAYMENT_PROCESSING',
        5.1311583072,
        5.1311583072,
        37.66,
        0.035,
        6.76
      ],
      [
        100000,
        'CRYPTO',
        5.2116073791,
        5.2116073791,
        18539.07,
        0.035,
        3381.64
      ],
      [
        10000,
        'CRYPTO',
        5.2116073791,
        5.2116073791,
        1853.91,
        0.035,
        338.16
      ],
      [
        150,
        'CRYPTO',
        5.237,
        5.237,
        27.67,
        0.035,
        5.07
      ],
      [
        1,
        'CRYPTO',
        5.2338,
        5.2338,
        0.19,
        0.035,
        0.03
      ],
      [
        10000,
        'CRYPTO',
        5.2333,
        5.2333,
        1846.22,
        0.035,
        338.16
      ],
      [
        0.01,
        'CRYPTO',
        5.1851058416,
        5.1851058416,
        0,
        0.035,
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
  });

  describe('INBOUND', () => {

    it.each([
      [
        92455.98,
        'CRYPTO',
        4.9957629246,
        18577.21,
        0.0038,
        352.67
      ],
      [
        3681.20,
        'CRYPTO',
        4.9912545936,
        740.33,
        0.0038,
        14.04
      ],
      [
        500,
        'CRYPTO',
        4.9860395464,
        100.66,
        0.0038,
        1.91
      ],
      [
        200,
        'CRYPTO',
        4.9850451268,
        40.27,
        0.0038,
        0.76
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
  });
});
