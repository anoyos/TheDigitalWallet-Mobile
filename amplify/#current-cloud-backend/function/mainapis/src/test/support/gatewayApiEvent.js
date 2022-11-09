module.exports = function createGatewayEvent({ method = 'GET', path = '/v1/test', user }) {
  return {
    "event": {
      "resource": "/{proxy+}",
      path,
      "httpMethod": method,
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Authorization": "eyJraWQiOiJsbDVtNUdFXC8yWlVjcFVJMDZhRUVpXC9aUVRFUk53NGpHMjBHZGRDaDZWSFU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxNGQ3N2UxYS02ODA3LTQ0MmMtOGYzYS1kMTU2OTg1YTM5MjQiLCJhdWQiOiIxcjNjMjA1OTE0M2hwYmhob3BvZGFoNmsyNCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjZiY2Y1NTBjLTc3NWMtNGFhZS1hYjJjLTVhOTM5NjE4ZTQ0MyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTYxMTE3MDE1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Yb1ZjMXhjbzAiLCJuYW1lIjoiT25kxZllaiBTdm9ib2RhIiwiY29nbml0bzp1c2VybmFtZSI6IjE0ZDc3ZTFhLTY4MDctNDQyYy04ZjNhLWQxNTY5ODVhMzkyNCIsImV4cCI6MTU2MTEyMDYxNywiaWF0IjoxNTYxMTE3MDE3LCJlbWFpbCI6Im9uZHJlai5zdm9ib2RhK2JhbGVodXRlc3RAdG9wbW9ua3MuY29tIn0.glTfr468kX2oR3oOD3IBR9PyOZyWn05vnhJwKjJCN7e39NZwc1AjMcyRiylnzakUVphXtEgHnoBmzTaPr0aRw3t5mWTfqdME1p2r_vKyyQ4GbYxdY41WqQ-s09oRywHetMEPCBkdX1C_wek6UL9n-RquhTrfTabE9Su5XYacRErdKXh9FvBgDQW-tIOSDDj-aalxDwjIHN5_7z83oQsaniZjqVhjQ5NPaLM6tSd_Kxqg94UfY8GRE9Mcj2cx5rL--fmQClvS-fijY9vX4iYRTwmQSbLGu68kdTubBhEoMZ1GbNTmrDDLHPSiYo4zOzzq_gWJkzqJaV1nCQIcdJbqNg",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "CZ",
        "Host": "kf04l29n57.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "axios/0.17.1",
        "Via": "1.1 c6702f5f3b6e77da6f394e67ef1a6aab.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "Dc-S6SDDr_ViZqtWyJKAaB6xDgdZ4MKTy77qEnaq-fpj2mXMXFLP6g==",
        "X-Amzn-Trace-Id": "Root=1-5d0cc15a-555337404e98d9c0b3f71500",
        "X-Forwarded-For": "82.100.8.121, 70.132.1.133",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      "multiValueHeaders": {
        "Accept": [
          "application/json, text/plain, */*"
        ],
        "Authorization": [
          "eyJraWQiOiJsbDVtNUdFXC8yWlVjcFVJMDZhRUVpXC9aUVRFUk53NGpHMjBHZGRDaDZWSFU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxNGQ3N2UxYS02ODA3LTQ0MmMtOGYzYS1kMTU2OTg1YTM5MjQiLCJhdWQiOiIxcjNjMjA1OTE0M2hwYmhob3BvZGFoNmsyNCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjZiY2Y1NTBjLTc3NWMtNGFhZS1hYjJjLTVhOTM5NjE4ZTQ0MyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTYxMTE3MDE1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Yb1ZjMXhjbzAiLCJuYW1lIjoiT25kxZllaiBTdm9ib2RhIiwiY29nbml0bzp1c2VybmFtZSI6IjE0ZDc3ZTFhLTY4MDctNDQyYy04ZjNhLWQxNTY5ODVhMzkyNCIsImV4cCI6MTU2MTEyMDYxNywiaWF0IjoxNTYxMTE3MDE3LCJlbWFpbCI6Im9uZHJlai5zdm9ib2RhK2JhbGVodXRlc3RAdG9wbW9ua3MuY29tIn0.glTfr468kX2oR3oOD3IBR9PyOZyWn05vnhJwKjJCN7e39NZwc1AjMcyRiylnzakUVphXtEgHnoBmzTaPr0aRw3t5mWTfqdME1p2r_vKyyQ4GbYxdY41WqQ-s09oRywHetMEPCBkdX1C_wek6UL9n-RquhTrfTabE9Su5XYacRErdKXh9FvBgDQW-tIOSDDj-aalxDwjIHN5_7z83oQsaniZjqVhjQ5NPaLM6tSd_Kxqg94UfY8GRE9Mcj2cx5rL--fmQClvS-fijY9vX4iYRTwmQSbLGu68kdTubBhEoMZ1GbNTmrDDLHPSiYo4zOzzq_gWJkzqJaV1nCQIcdJbqNg"
        ],
        "CloudFront-Forwarded-Proto": [
          "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
          "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
          "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
          "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
          "false"
        ],
        "CloudFront-Viewer-Country": [
          "CZ"
        ],
        "Host": [
          "kf04l29n57.execute-api.us-east-1.amazonaws.com"
        ],
        "User-Agent": [
          "axios/0.17.1"
        ],
        "Via": [
          "1.1 c6702f5f3b6e77da6f394e67ef1a6aab.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
          "Dc-S6SDDr_ViZqtWyJKAaB6xDgdZ4MKTy77qEnaq-fpj2mXMXFLP6g=="
        ],
        "X-Amzn-Trace-Id": [
          "Root=1-5d0cc15a-555337404e98d9c0b3f71500"
        ],
        "X-Forwarded-For": [
          "82.100.8.121, 70.132.1.133"
        ],
        "X-Forwarded-Port": [
          "443"
        ],
        "X-Forwarded-Proto": [
          "https"
        ]
      },
      "queryStringParameters": null,
      "multiValueQueryStringParameters": null,
      "pathParameters": {
        "proxy": "test"
      },
      "stageVariables": null,
      "requestContext": {
        "resourceId": "qq0v19",
        "authorizer": {
          "claims": {
            "sub": user.aws_user_id,
            "aud": "1r3c2059143hpbhhopodah6k24",
            "email_verified": "true",
            "event_id": "6bcf550c-775c-4aae-ab2c-5a939618e443",
            "token_use": "id",
            "auth_time": "1561117015",
            "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XoVc1xco0",
            "name": user.name,
            "cognito:username": user.aws_user_id,
            "exp": "Fri Jun 21 12:36:57 UTC 2019",
            "iat": "Fri Jun 21 11:36:57 UTC 2019",
            "email": user.email,
          }
        },
        "resourcePath": "/{proxy+}",
        "httpMethod": "GET",
        "extendedRequestId": "boMmEFK2oAMFYsA=",
        "requestTime": "21/Jun/2019:11:36:58 +0000",
        "path": "/api/test",
        "accountId": "097580375387",
        "protocol": "HTTP/1.1",
        "stage": "api",
        "domainPrefix": "kf04l29n57",
        "requestTimeEpoch": 1561117018026,
        "requestId": "e0a0a17e-9418-11e9-a2c1-b5b16935f286",
        "identity": {
          "cognitoIdentityPoolId": null,
          "accountId": null,
          "cognitoIdentityId": null,
          "caller": null,
          "sourceIp": "82.100.8.121",
          "principalOrgId": null,
          "accessKey": null,
          "cognitoAuthenticationType": null,
          "cognitoAuthenticationProvider": null,
          "userArn": null,
          "userAgent": "axios/0.17.1",
          "user": null
        },
        "domainName": "kf04l29n57.execute-api.us-east-1.amazonaws.com",
        "apiId": "kf04l29n57"
      },
      "body": null,
      "isBase64Encoded": false
    },
    "context": {
      "callbackWaitsForEmptyEventLoop": true,
      "logGroupName": "/aws/lambda/balehuApiV1-dev",
      "logStreamName": "2019/04/12/[$LATEST]a5a2d364eef146ed92e0f516b1e29a9e",
      "functionName": "balehuApiV1-dev",
      "memoryLimitInMB": "128",
      "functionVersion": "$LATEST",
      "invokeid": "ce8914c1-565a-4921-856d-e3d5f7fa21fe",
      "awsRequestId": "ce8914c1-565a-4921-856d-e3d5f7fa21fe",
      "invokedFunctionArn": "arn:aws:lambda:us-east-1:097580375387:function:balehuApiV1-dev"
    }
  }
}
