import QuoteCalculator, {Direction, Quote} from '../../../src/local-quote/QuoteCalculator'
import settings from '../../../src/local-quote/settings'
import scenario from './scenarios.json'

let quoteCalculator: QuoteCalculator

let quote: Quote

describe('Quote Calculator', () => {
  describe('#calculate', () => {

    beforeEach(()=>{
      quoteCalculator = new QuoteCalculator()
    })

    describe.each(scenario)
      ('$request.quote.direction, $request.quote.baseCurrencyISO: $request.amount, rate: $request.quote.exchangeRate ',
      ({request, expectedResponse})  => {

      it('calculates local quote', () => {

        const quote: Quote = {
          ...request.quote,
          direction: request.quote.direction as Direction
        }

        const localQuote = quoteCalculator.calculate(quote,request.amount)

        expect(localQuote).toEqual({
          ...request.quote,
          ...expectedResponse,
          tax: request.quote.direction === 'OUTBOUND' ?
          settings.taxes.outbound.IOF.value : settings.taxes.inbound.IOF.value,

        })
      })
    })
   })
})
