module.exports = {
  charge({ aws_user_id, wallet_address }, { code = "YHGDEFVE" } = {}) {
    return {
      "data": {
        "addresses": {
          "ethereum": "0x3242ed06df500a2395ec8c5a877e91dd94daab2f",
          "bitcoin": "167Kxdh6e6cWHipLh3jo9UG9Y4ATSHUF1V",
          "litecoin": "LQEnrfYR5B8UjPgS695cbbapdv1FpeoqGp",
          "bitcoincash": "qpvk7la4mzkqrcwcvj9jcxvpef53qrw9t50uc839n2",
          "usdc": "0x4a8d4437912a444bf424968380fc9735863a8a24"
        },
        code,
        "created_at": "2019-08-27T18:57:37Z",
        "description": "Test",
        "expires_at": "2019-08-27T19:57:37Z",
        "hosted_url": "https://commerce.coinbase.com/charges/YHGDEFVE",
        "id": "e1b65b76-5419-478f-93cc-024b1ed1477a",
        "metadata": {
          aws_user_id,
          wallet_address
        },
        "name": "Test Charge",
        "payments": [],
        "pricing": {
          "local": {
            "amount": "1.00",
            "currency": "USD"
          },
          "bitcoincash": {
            "amount": "0.00321048",
            "currency": "BCH"
          },
          "litecoin": {
            "amount": "0.01372966",
            "currency": "LTC"
          },
          "bitcoin": {
            "amount": "0.00009822",
            "currency": "BTC"
          },
          "ethereum": {
            "amount": "0.005341000",
            "currency": "ETH"
          },
          "usdc": {
            "amount": "1.000000",
            "currency": "USDC"
          }
        },
        "pricing_type": "fixed_price",
        "pwcb_enabled": false,
        "resource": "charge",
        "timeline": [
          {
            "status": "NEW",
            "time": "2019-08-27T18:57:37Z"
          }
        ]
      }
    };
  },

  created({ aws_user_id, wallet_address }) {
    return {
      "attempt_number": 1,
      "event": {
        "api_version": "2018-03-22",
        "created_at": "2019-08-27T18:37:44Z",
        "data": {
          "id": "ceffa61e-75ef-4d7b-87b6-0af3e5d868ea",
          "code": "YK7PWYN4",
          "name": "Test Charge",
          "pricing": {
            "usdc": {
              "amount": "1.000000",
              "currency": "USDC"
            },
            "local": {
              "amount": "1.00",
              "currency": "USD"
            },
            "bitcoin": {
              "amount": "0.00009808",
              "currency": "BTC"
            },
            "ethereum": {
              "amount": "0.005337000",
              "currency": "ETH"
              ,
              "litecoin": {
                "amount": "0.01372024",
                "currency": "LTC"
              },
              "bitcoincash": {
                "amount": "0.00321228",
                "currency": "BCH"
              }
            },
            "metadata": {
              "aws_user_id": aws_user_id,
              "wallet_address": wallet_address,
            },
            "payments": [],
            "resource": "charge",
            "timeline": [
              {
                "time": "2019-08-27T18:37:44Z",
                "status": "NEW"
              }
            ],
            "addresses": {
              "usdc": "0xb271ac55f0c6a49749d1313f85631bccc75b1e91",
              "bitcoin": "1DED5skbhdBSqfYnTnHeFVT1qb4njGyzEJ",
              "ethereum": "0x08194045f941f521a9d8084fdb414fcc0a8a8daf",
              "litecoin": "LXPHbYAkBWjvMAqu8wa5YDe6vSWvWuMk24",
              "bitcoincash": "qq7axtssrwwgyjq7j5zdkenkj8xam4p4mve29y2smg"
            },
            "created_at": "2019-08-27T18:37:44Z",
            "expires_at": "2019-08-27T19:37:44Z",
            "hosted_url": "https://commerce.coinbase.com/charges/YK7PWYN4",
            "description": "Test",
            "pricing_type": "fixed_price",
            "pwcb_enabled": false
          },
          "id": "ccc3b1fc-1052-4002-b492-f04e5022fcba", // eslint-disable-line no-dupe-keys
          "resource": "event",
          "type": "charge:created"
        },
        "id": "4ff31dbe-f52e-46e1-ba3a-e2298bf7a61e",
        "scheduled_for": "2019-08-27T18:37:44Z"
      }
    };
  },

  confirmed({ aws_user_id, wallet_address }) {
    return {
      "attempt_number": 1,
      "event": {
        "api_version": "2018-03-22",
        "created_at": "2019-08-27T18:41:00Z",
        "data": {
          "id": "ceffa61e-75ef-4d7b-87b6-0af3e5d868ea",
          "code": "YK7PWYN4",
          "name": "Test Charge",
          "pricing": {
            "usdc": {
              "amount": "1.000000",
              "currency": "USDC"
            },
            "local": {
              "amount": "1.00",
              "currency": "USD"
            },
            "bitcoin": {
              "amount": "0.00009808",
              "currency": "BTC"
            },
            "ethereum": {
              "amount": "0.005337000",
              "currency": "ETH"
            },
            "litecoin": {
              "amount": "0.01372024",
              "currency": "LTC"
            },
            "bitcoincash": {
              "amount": "0.00321228",
              "currency": "BCH"
            }
          },
          "metadata": {
            "aws_user_id": aws_user_id,
            wallet_address
          },
          "payments": [
            {
              "block": {
                "hash": "0xbded077d5336aa98fa314d7780d3a051a843aa70eccc991620a78b89ab1022e6",
                "height": 8433823,
                "confirmations": 7,
                "confirmations_required": 8
              },
              "value": {
                "local": {
                  "amount": "1.00",
                  "currency": "USD"
                },
                "crypto": {
                  "amount": "0.005337000",
                  "currency": "ETH"
                }
              },
              "status": "CONFIRMED",
              "network": "ethereum",
              "detected_at": "2019-08-27T18:39:00Z",
              "transaction_id": "0xffdd115212de94ad88fdf396ccc92cc861e246f23f8ab307723a14055d868361"
            }
          ],
          "resource": "charge",
          "timeline": [
            {
              "time": "2019-08-27T18:37:44Z",
              "status": "NEW"
            },
            {
              "time": "2019-08-27T18:39:00Z",
              "status": "PENDING",
              "payment": {
                "network": "ethereum",
                "transaction_id": "0xffdd115212de94ad88fdf396ccc92cc861e246f23f8ab307723a14055d868361"
              }
            },
            {
              "time": "2019-08-27T18:41:00Z",
              "status": "COMPLETED",
              "payment": {
                "network": "ethereum",
                "transaction_id": "0xffdd115212de94ad88fdf396ccc92cc861e246f23f8ab307723a14055d868361"
              }
            }
          ],
          "addresses": {
            "usdc": "0xb271ac55f0c6a49749d1313f85631bccc75b1e91",
            "bitcoin": "1DED5skbhdBSqfYnTnHeFVT1qb4njGyzEJ",
            "ethereum": "0x08194045f941f521a9d8084fdb414fcc0a8a8daf",
            "litecoin": "LXPHbYAkBWjvMAqu8wa5YDe6vSWvWuMk24",
            "bitcoincash": "qq7axtssrwwgyjq7j5zdkenkj8xam4p4mve29y2smg"
          },
          "created_at": "2019-08-27T18:37:44Z",
          "expires_at": "2019-08-27T19:37:44Z",
          "hosted_url": "https://commerce.coinbase.com/charges/YK7PWYN4",
          "description": "Test",
          "confirmed_at": "2019-08-27T18:41:00Z",
          "pricing_type": "fixed_price",
          "pwcb_enabled": false
        },
        "id": "ce6c6423-c252-4914-910c-6234a6168862",
        "resource": "event",
        "type": "charge:confirmed"
      },
      "id": "26ff61e9-5e51-4ce7-ac6a-c5fc0227e0ac",
      "scheduled_for": "2019-08-27T18:41:00Z"
    };
  }
};
