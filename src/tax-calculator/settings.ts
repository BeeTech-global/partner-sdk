const settings = Object.freeze({
  taxes: {
    CRYPTO: {
      INBOUND: {
        IOF: {
          value: 0.38
        }
      },
      OUTBOUND: {
        IOF: {
          value: 0.38
        }
      }
    },
    PAYMENT_PROCESSING: {
      INBOUND: {
        IOF: {
          value: 0.38
        }
      },
      OUTBOUND: {
        IOF: {
          value: 0.38
        }
      }
    },
    COMEX: {
      INBOUND: {
        IOF: {
          value: 0
        }
      },
      OUTBOUND: {
        IOF: {
          value: 0
        }
      }
    },
    DEFAULT: {
      INBOUND: {
        IOF: {
          value: 0.38
        }
      },
      OUTBOUND: {
        IOF: {
          value: 0.38
        }
      }
    }
  }
})

export default settings
