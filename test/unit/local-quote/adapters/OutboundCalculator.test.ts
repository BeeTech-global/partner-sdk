import { Currencies, Direction, ICalculus, Purposes, Quote } from '../../../../src/local-quote/Quote';
import OutboundCalculator from '../../../../src/local-quote/adapters/OutboundCalculator';
import scenario from '../scenarios-outbound.json';

let quoteCalculator: ICalculus

describe('Quote Calculator Outbound', () => {
  describe('#calculate', () => {

    beforeEach(()=>{
      quoteCalculator = new OutboundCalculator()
    })

    describe.each(scenario)
      ('$request.quote.direction, $request.quote.baseCurrencyISO: $request.amount, rate: $request.quote.exchangeRate ',
      ({request, expectedResponse})  => {

      it('calculates local quote', () => {

        const {
          quote: {
            baseCurrencyISO,
            quotedCurrencyISO,
            direction,
            purpose
          },
          amount,
          tax
        } = request;

        const quote: Quote = {
          ...request.quote,
          direction: direction as Direction,
          purpose: purpose as Purposes,
          baseCurrencyISO: baseCurrencyISO as Currencies,
          quotedCurrencyISO: quotedCurrencyISO as Currencies
        }

        const localQuote = quoteCalculator.calculate(quote, amount, tax)

        expect(localQuote).toEqual({
          ...request.quote,
          ...expectedResponse,
          tax: 0.0038
        })
      })
    })
   })
})
