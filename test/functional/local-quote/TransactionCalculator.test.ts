import QuoteCalculator from '../../../src/local-quote/QuoteCalculator';
import TaxCalculator from '../../../src/tax-calculator/TaxCalculator';
import { acceptedQuotesMocks } from './scenarios'

let quoteCalculator: QuoteCalculator

type AcceptedQuote = {
  exchangeRate: number,
  amount: number
}

describe('Transaction Calculator', () => {
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

  describe('Verify transaction exchange rate', () => {
    it('OUTBOUND Inverse', async () => {
      const acceptedQuotes = acceptedQuotesMocks.OUTBOUND_INVERSE as AcceptedQuote[]

      const result = acceptedQuotes.map(acceptedQuote => {
        const quote = {
          id: 'quote_id',
          direction: 'OUTBOUND',
          purpose: 'CRYPTO',
          baseCurrencyISO: 'USD',
          quotedCurrencyISO: 'BRL',
          exchangeRate: acceptedQuote.exchangeRate,
          spread: 0.5,
        }

        return quoteCalculator.calculate(quote, acceptedQuote.amount)
      })

      const quotedAmountSum = result
        .map((acceptedQuote) => acceptedQuote.quotedAmount)
        .reduce((current, next) => current + next, 0);

      const totalBaseAmountSum = result
        .map((acceptedQuote) => acceptedQuote.totalBaseAmount)
        .reduce((current, next) => current + next, 0);

      const tax = 0.0038
      const totalAmountWithoutTax = Number((quotedAmountSum / (1 + tax)).toFixed(2))
      const exchangeRate = Number((totalAmountWithoutTax / totalBaseAmountSum).toFixed(10))

      const expectedExchangeRate = 5.241608978200

      expect(exchangeRate).toEqual(expectedExchangeRate);
    });
  });
});
