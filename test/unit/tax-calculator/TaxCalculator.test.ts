import { Direction } from "../../../src/local-quote/Quote"
import settings from "../../../src/tax-calculator/settings"
import TaxCalculator from "../../../src/tax-calculator/TaxCalculator"

describe('TaxCalculator', () => {

  describe('#getTaxAmount', () => {

    it('returns the tax amount when direction is INBOUND', () => {
      const currencyAmount = 1000
      const direction = Direction.INBOUND;

      const expectedAmount = currencyAmount * (settings.taxes.IOF.INBOUND.rate / 100)

      const taxAmount = TaxCalculator.getTaxAmount({currencyAmount, direction})

      expect(taxAmount).toEqual(expectedAmount)
    })

    it('returns the tax amount when direction is OUTBOUND', () => {
      const currencyAmount = 1000
      const direction = Direction.OUTBOUND;

      const expectedAmount = currencyAmount * (settings.taxes.IOF.OUTBOUND.rate / 100)

      const taxAmount = TaxCalculator.getTaxAmount({currencyAmount, direction})

      expect(taxAmount).toEqual(expectedAmount)
    })
  })

  describe('#getTaxRate', () => {

    it('returns the taxRate when direction is OUTBOUND', () => {
      const taxRate = TaxCalculator.getTaxRate(Direction.OUTBOUND)
      expect(taxRate).toEqual(settings.taxes.IOF.OUTBOUND.rate)
    })

    it('returns the taxRate when direction is INBOUND', () => {
      const taxRate = TaxCalculator.getTaxRate(Direction.INBOUND)
      expect(taxRate).toEqual(settings.taxes.IOF.INBOUND.rate)
    })
  })
})
