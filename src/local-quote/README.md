# local-quote
This SDK allows partners to quote for their customers without reaching RemessaOnline SaaS.

---
### Methods
`calculate(quote: Quote, amount:number) :LocalQuote`

### Example
``` typescript
import {quoteCalculator} from '@beetech/partner-sdk'

const quote = {
  id: '123e4567-e89b-12d3-a456-426655440000',
  direction: 'OUTBOUND',
  baseCurrencyISO: 'USD',
  quotedCurrencyISO: 'BRL',
  exchangeRate: 5.4,
}

const amount = 10000;

const localQuote = quoteCalculator.calculate(quote, amount)
```
### Custom Types
``` typescript
Quote = {
  id: string, //uuid
  direction: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  exchangeRate: number,
}

LocalQuote = {
  id: string, //uuid
  direction: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  amount: number,
  totalBaseAmount: number,
  exchangeRate: number,
  tax: number,
}
```

### Currency Pair
```
A currency pair is defined by two ordered ISO-4217 (three letters) currencies: BASE/QUOTED

Examples:
- The outbound case USD / BRL means we want to buy our base (USD) using, quoting by or selling (BRL)
- The inbound case BRL / USD means we want to buy our base (BRL) using, quoting by or selling (USD)
```

### Exchange Math

IOF tax rate is always set at 0.38% of the value in BRL considering the operational purpose of `INVESTMENT_IN_STOCKS_AND_OR_FUNDS`

``` typescript
const IOF = 0.0038;
```

Outbound calculation (USD/BRL)
``` typescript
const totalBaseAmount = (quotedAmount * (1 - IOF)) / exchangeRate;
```

Inbound calculation (BRL/USD)
``` typescript
const totalBaseAmount = quotedAmount * exchangeRate * (1 - IOF);
```

### Precision and Rounding
* Amounts have two decimal places
* Rates have six decimal places
* Rounding rule is ROUND_HALF_EVEN
* Rounding is only done right before attributions
