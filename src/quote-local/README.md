# quote-local

## Objective
Use quote features through a component to facilitate the abstraction of standard features.

## API

Method of calculate local quote

`calculate(quote: Quote, amount:number) :QuoteLocal`

``` typescript
Quote = {
  quote_id: number,
  direction: string,
  base_iso: string,
  quoted_iso: string,
  exchange_rate: number,
}

QuoteLocal = {
  quote_id: number,
  direction: string,
  base_iso: string,
  quoted_iso: string,
  amount: number,
  total_quoted_amount: number,
  exchange_rate: number,
  tax: number,
}
```

### how this calculation done?

IOF 0,38 is a default value for purpose = `INVESTMENT_IN_STOCKS_AND_OR_FUNDS`
``` typescript
const IOF = 0,38%;
```

to calculate tax
``` typescript
const tax = amount + IOF;
```

to calculate BRL to USD
``` typescript
const total_quoted_amount = (amount - tax ) / exchangeRate;
```

to calculate USD to BRL
``` typescript
const total_quoted_amount = (amount - tax ) * exchangeRate;
```
