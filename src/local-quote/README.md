
# local-quote

This SDK allows partners to quote for their customers without reaching RemessaOnline SaaS.

</br>

---

</br>

## Custom Types

</br>

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

</br>

---

</br>

## **Methods**

</br>

`calculate(quote: Quote, amount:number) :LocalQuote`

Example:

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

</br>

---

</br>

## **Currency Pair**

</br>

A currency pair is defined by two ordered ISO-4217 (three letters) currencies: BASE/QUOTED.

Examples:

- The outbound case USD / BRL means we want to buy our base (USD) using, quoting by or selling (BRL).
- The inbound case BRL / USD means we want to buy our base (BRL) using, quoting by or selling (USD).

</br>

---

</br>

## **Exchange math for outbound**

</br>

### **IOF**

IOF tax rate is set at 0.38% of the value in BRL.

``` typescript
const IOF = 0.0038;
```

</br>

### **Outbound - direct flow**

In the direct flow, the value of USD is known and the BRL value needs to be found.

``` typescript
const totalAmount = (amount * exchangeRate) * (1 + tax);
return totalAmount;
```

</br>

### **Outbound - inverse flow**

In the inverse flow, the value of BRL is known and the value in USD needs to be found.

``` typescript
const totalAmount = (amount / (1 + tax)) / exchangeRate;
return totalAmount;
```

After calculating the USD value it is necessary to find the new exchange-rate

---

</br>

How to calculate the exchange-rate

``` typescript
const spread = 0.005;
const bankFee = 0;
const fixedTaxAmount = 0;
const totalPercentualTax = 0.0038;
const totalReadjustedTax = 0;
const spreadPrecision = spread + 1;
const marketRate = (totalQuotedAmount - bankFee - fixedTaxAmount) /
(amount * spreadPrecision * (1 + totalPercentualTax + totalReadjustedTax));

const exchangeRate = marketRate * spreadPrecision;

return exchangeRate;
```

</br>

---

</br>

## **Exchange math for inbound**

</br>

### **IOF**

IOF tax rate is set at 0% of the value.

``` typescript
const IOF = 0;
```

</br>

### **Inbound - direct flow**

In the direct flow, the value of BRL is known and the value in USD must be found.

``` typescript
const totalAmount = (amount / exchangeRate) * (1 - tax);
return totalAmount;
```

</br>

### **Inbound - inverse flow**

In the inverse flow, the value of USD is known and the value in BRL needs to be found.

``` typescript
const totalAmount = (amount * (1 + tax)) * exchangeRate;
return totalAmount;

```

After calculating the USD value it is necessary to find the new exchange-rate

---

</br>

How to calculate the exchange-rate

``` typescript
const spread = 0.005;
const bankFee = 0;
const fixedTaxAmount = 0;
const totalPercentualTax = 0.0038;
const totalReadjustedTax = 0;
const spreadPrecision = 1 - spread;
const marketRate = (amount + bankFee + fixedTaxAmount) /
(totalQuotedAmount * spreadPrecision * (1 - totalPercentualTax - totalReadjustedTax));

const exchangeRate = marketRate * spreadPrecision;

return exchangeRate;
```

</br>

---

</br>

### **Precision and Rounding**

- Amounts have two decimal places.
- Rates have six decimal places.
- Rounding rule is ROUND_HALF_EVEN.
- Rounding is only done right before attributions.
