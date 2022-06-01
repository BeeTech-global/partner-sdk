# local-quote
This SDK allows partners to quote for their customers without reaching RemessaOnline SaaS.

---
### Methods
`calculate(quote: Quote, amount:number) :LocalQuote`

### Custom Types
``` typescript
Quote = {
  id: number,
  direction: string,
  baseCurrencyISO: string,
  quotedCurrencyISO: string,
  exchangeRate: number,
}

LocalQuote = {
  id: number,
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
- The outbound case USD / BRL means we want to buy our base (USD) using, quoting by or selling BRL
- The inbound case BRL / USD means we want to buy our base (BRL) using, quoting by or selling USD
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
