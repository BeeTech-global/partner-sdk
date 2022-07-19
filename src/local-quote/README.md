# local-quote
This SDK allows partners to quote for their customers without reaching RemessaOnline SaaS.

---


### Custom Types


``` typescript
Direction = 'INBOUND' | 'OUTBOUND'

Purpose = 'CRYPTO' | 'PAYMENT_PROCESSING'

CurrencyISO = 'USD' | 'BRL' | 'EUR'

Quote = {
  id: string, //uuid
  direction: string, // Direction
  purpose: string, // Purpose
  baseCurrencyISO: string, // CurrencyISO
  quotedCurrencyISO: string, // CurrencyISO
  exchangeRate: number,
}

LocalQuote = {
  id: string, //uuid
  direction: string,
  purpose: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  amount: number,
  totalBaseAmount: number,
  exchangeRate: number,
  tax: number,
}
```
### Methods
`calculate(quote: Quote, amount:number) :LocalQuote`
### Example
``` typescript
import {quoteCalculator} from '@beetech/partner-sdk'

const quote = {
  id: '123e4567-e89b-12d3-a456-426655440000',
  direction: 'OUTBOUND',
  purpose: 'CRYPTO',
  baseCurrencyISO: 'USD',
  quotedCurrencyISO: 'BRL',
  exchangeRate: 5.4,
}

const amount = 10000;

const localQuote = quoteCalculator.calculate(quote, amount)
```



### Currency Pair
```
A currency pair is defined by two ordered ISO-4217 (three letters) currencies: BASE/QUOTED

Examples:
- The outbound case USD / BRL means we want to buy our base (USD) using, quoting by or selling (BRL)
- The inbound case BRL / USD means we want to buy our base (BRL) using, quoting by or selling (USD)
```

### Exchange Math

IOF tax rate is always set at 0.38% of the value in BRL considering the operational purpose of `CRYPTO` and `PAYMENT_PROCESSING`



Outbound calculation direct flow (sell BRL to buy USD)
``` typescript
const IOF = 0.0038;
```

``` typescript
const totalAmount = (amount * exchangeRate) * (1 + IOF)
```

Outbound calculation indirect flow (sell USD to buy BRL)
``` typescript
const IOF = 0.0038;
```

``` typescript
const totalAmount = (amount / exchangeRate) * (1 - IOF)
```

Inbound calculation direct flow (sell BRL to buy USD)
``` typescript
const IOF = 0;
```

``` typescript
const totalAmount = amount * exchangeRate * (1 - IOF);
```

Inbound calculation indirect flow (sell USD to buy BRL)
``` typescript
const IOF = 0;
```

``` typescript
const totalAmount = (amount / exchangeRate) * (1 - IOF);
```

### Precision and Rounding
* Amounts have two decimal places
* Rates have six decimal places
* Rounding rule is ROUND_HALF_EVEN
* Rounding is only done right before attributions
