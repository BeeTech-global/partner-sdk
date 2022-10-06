import { Currencies, Direction, ICalculus, Purposes, Quote } from '../../../../src/local-quote/Quote';
import InboundCalculator from '../../../../src/local-quote/adapters/InboundCalculator';
import scenario from './scenarios-inbound.json';

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
          quote,
          amount,
          taxRate
        } = request;

        const localQuote = quoteCalculator.calculate(quote, amount, taxRate)

        expect(localQuote).toEqual({
          ...quote,
          ...expectedResponse,
          tax: taxRate/100
        })
      })
    })
   })
})
