import { Currencies, Direction, ICalculus, Purposes, Quote } from '../../../../src/local-quote/Quote';
import InboundCalculator from '../../../../src/local-quote/adapters/InboundCalculator';
import scenario from '../scenarios-inbound.json';

let quoteCalculator: ICalculus

describe('Quote Calculator Inbound', () => {
  describe('#calculate', () => {

    beforeEach(()=>{
      quoteCalculator = new InboundCalculator()
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
          tax: 0
        })
      })
    })
   })
})