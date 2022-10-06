import { Currencies, Direction, ICalculus, Purposes, Quote } from '../../../../src/local-quote/Quote';
import OutboundCalculator from '../../../../src/local-quote/adapters/OutboundCalculator';
import scenario from './scenarios-outbound.json';

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
          quote,
          amount,
          taxRate
        } = request;


        const localQuote = quoteCalculator.calculate(quote, amount, taxRate)

        expect(localQuote).toEqual({
          ...quote,
          ...expectedResponse,
          tax: taxRate/100
        });
      })
    })
   })
})
