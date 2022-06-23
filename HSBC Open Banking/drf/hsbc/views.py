from inspect import Parameter
from os import access
from typing import OrderedDict
import urllib
from django.shortcuts import redirect, render
from knox.models import AuthTokenManager
import requests
from requests.models import Response
from requests import request, session
from django.http import HttpResponse
from Cryptodome.PublicKey import RSA
import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from collections import OrderedDict
from urllib.parse import urlencode
import logging
import json
from django.http import JsonResponse
from django.views import View


class Token:

    def setToken(self, token):
        self.token = token

    def getToken(self):
        return self.token


tokenclass = Token()


class Account:

    def setAccount(self, account):
        self.account = account

    def getAccount(self):
        return self.account


accountclass = Account()


cert_file_path = "hsbc_obp.pem"
key_file_path = "server.key"

key = RSA.generate(2048)
prv_key = key.export_key()
file_out = open("private.pem", "wb")
file_out.write(prv_key)
print(prv_key)


def accesstoken(request):

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "x-fapi-financial-id": "test",
        "Cache-Control": "no-cache",
        "Accept-Encoding": "gzip/deflate/br",
        "Connection": "keep-alive",
    }
    accessTokenData = {
        "grant_type": "client_credentials",
        "scope": "accounts",
        "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "client_assertion": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkZThjYTc3LWQ2ODEtNDc4Mi04MTIyLWUwMzkyNTg5MDIxYiJ9.eyJpc3MiOiIyMTFlMzZkZS02NGIyLTQ3OWUtYWUyOC04YTViNDFhMWE5NDAiLCJhdWQiOiJodHRwczovL3NhbmRib3guaHNiYy5jb20vcHNkMi9vYmllL3YzLjEvYXMvdG9rZW4ub2F1dGgyIiwic3ViIjoiMjExZTM2ZGUtNjRiMi00NzllLWFlMjgtOGE1YjQxYTFhOTQwIiwiaWF0IjoxNDk5MTgzNjAxLCJleHAiOjE3NzkzNDg1MjF9.uu282OmEHUa0t6z6T68MfXzEGGgq8PiWuyJxuNQ1be6iWdD5sVbw3W--_O6TFAH-ae7BYXsE0kncYgA6gF9AmkXuA77w_Wbn2YyjPCB9gDCkrlJUS6rvb3UJYcIBZ7W-WZlRAsRE0l6EV74c5xnyL9c7cpGMfQ-HfPsYOG4JCsrvtpAHdo7jHWTVgKoe67jWGQkNOYt1Ba7rCf4y-fqQ3d6hZoptAAcJd26yigvV4768GHQGrBvgAc7OzutOGzYARAgStpjQMp0kMiOGIzq-TUsDlvtMrx2fH8gfy2uG2HvzsROkbNedL-iO5PmswNrDvCYEWZmVjMcaVg--ZF0sjg",
    }
    cert = (cert_file_path, key_file_path)
    requests.session()
    response = requests.post(
        "https://sandbox.hsbc.com/psd2/obie/v3.1/as/token.oauth2",
        data=accessTokenData,
        headers=headers,
        cert=cert,
    )

    accessTokenResponse = response.json()

    bearerToken = "Bearer " + accessTokenResponse["access_token"]

    consentHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": bearerToken,
        "x-fapi-financial-id": "test",
        "Cache-Control": "no-cache",
    }

    consentData = '{"Data":{"Permissions":["ReadAccountsDetail","ReadBalances","ReadBeneficiariesDetail","ReadDirectDebits","ReadProducts","ReadStandingOrdersDetail","ReadTransactionsCredits","ReadTransactionsDebits","ReadTransactionsDetail","ReadScheduledPaymentsBasic","ReadScheduledPaymentsDetail","ReadParty","ReadStatementsDetail","ReadStatementsBasic"],"ExpirationDateTime":"2025-06-11T00:00:00+00:00","TransactionFromDateTime":"1995-07-15T00:00:00+00:00","TransactionToDateTime":"2037-12-31T23:59:59+00:00"},"Risk":{} }'
    consentResponse = requests.post(
        "https://sandbox.hsbc.com/psd2/obie/v3.1/account-access-consents",
        headers=consentHeaders,
        data=consentData,
        cert=cert,
    )

    consentTokenResponse = consentResponse.json()

    consent_id = consentTokenResponse["Data"]["ConsentId"]
    print("-------------------------------------------------")
    print(consent_id)

    encoded = jwt.encode(
        {
            "iss": "https://sandbox.hsbc.com/psd2/obie/v3.1/as/token.oauth2",
            "aud": "211e36de-64b2-479e-ae28-8a5b41a1a940",
            "response_type": "code id_token",
            "client_id": "211e36de-64b2-479e-ae28-8a5b41a1a940",
            "redirect_uri": "http://localhost:19006/authenticate",
            "scope": "openid accounts",
            "claims": {
                "userinfo": {
                    "openbanking_intent_id": {"value": consent_id, "essential": True}
                }
            },
        },
        prv_key,
        algorithm="PS256",
        headers={"typ": "JWT", "kid": "7fab807d-4988-4012-8f10-a77655787450"},
    )

    jwtid = encoded
    print(encoded)

    authHeaders = {
        "Cache-Control": "no-cache",
        "Content-Type": "*/*",
        "Accept": "*/*",
    }
    payload = {
        "response_type": "code id_token",
        "client_id": "211e36de-64b2-479e-ae28-8a5b41a1a940",
        "redirect_uri": "http://localhost:19006/authenticate",
        "scope": "openid accounts",
        "nonce": "n-0S6_WzA2Mj",
        "sate": "test",
        "request": jwtid,
    }

    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    requests_log = logging.getLogger(
        "**************** REQUEST ***************")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True

    AUTH = requests.get(
        "https://sandbox.hsbc.com/psd2/obie/v3.1/authorize",
        params=payload,
        headers=authHeaders,
    )
    print('***************')
    print(AUTH.url)

    return redirect(AUTH.url)


def userrequest(request):

    usercode = (request.headers.get('X-access-code'))
    print(usercode)
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-fapi-financial-id': 'test',
        'Cache-Control': 'no-cache',
    }
    data = {
        'grant_type': 'authorization_code',
        'code': usercode,
        'client_id': "123",
        'redirect_uri': "http://localhost:19006/authenticate",
        'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        'client_assertion': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkZThjYTc3LWQ2ODEtNDc4Mi04MTIyLWUwMzkyNTg5MDIxYiJ9.eyJpc3MiOiIyMTFlMzZkZS02NGIyLTQ3OWUtYWUyOC04YTViNDFhMWE5NDAiLCJhdWQiOiJodHRwczovL3NhbmRib3guaHNiYy5jb20vcHNkMi9vYmllL3YzLjEvYXMvdG9rZW4ub2F1dGgyIiwic3ViIjoiMjExZTM2ZGUtNjRiMi00NzllLWFlMjgtOGE1YjQxYTFhOTQwIiwiaWF0IjoxNDk5MTgzNjAxLCJleHAiOjE3NzkzNDg1MjF9.uu282OmEHUa0t6z6T68MfXzEGGgq8PiWuyJxuNQ1be6iWdD5sVbw3W--_O6TFAH-ae7BYXsE0kncYgA6gF9AmkXuA77w_Wbn2YyjPCB9gDCkrlJUS6rvb3UJYcIBZ7W-WZlRAsRE0l6EV74c5xnyL9c7cpGMfQ-HfPsYOG4JCsrvtpAHdo7jHWTVgKoe67jWGQkNOYt1Ba7rCf4y-fqQ3d6hZoptAAcJd26yigvV4768GHQGrBvgAc7OzutOGzYARAgStpjQMp0kMiOGIzq-TUsDlvtMrx2fH8gfy2uG2HvzsROkbNedL-iO5PmswNrDvCYEWZmVjMcaVg--ZF0sjg'
    }
    cert = (cert_file_path, key_file_path)
    tokenresponse = requests.post('https://sandbox.hsbc.com/psd2/obie/v3.1/as/token.oauth2', headers=headers, data=data, cert=cert
                                  )
    print(tokenresponse.json())
    ttt = tokenresponse.json()

    useraccesstoken = ttt['access_token']
    tokenclass.setToken(useraccesstoken)
    print('from class', tokenclass.getToken())

    print(useraccesstoken)

    userToken = tokenclass.getToken()
    headers = {
        'x-fapi-financial-id': 'test',
        'Authorization': 'Bearer '+userToken,
        'Cache-Control': 'no-cache',
    }
    cert = (cert_file_path, key_file_path)
    useraccountdetails = requests.get('https://sandbox.hsbc.com/psd2/obie/v3.1/accounts', headers=headers, cert=cert
                                      )
    print(useraccountdetails.json())
    userAccountDetails = useraccountdetails.json()

    userAccountId = userAccountDetails['Data']['Account'][0]['AccountId']
    print(userAccountId)

    accountclass.setAccount(userAccountId)
    print('from class', accountclass.getAccount())

    return HttpResponse(useraccountdetails)


def balance(request):
    userToken = tokenclass.getToken()
    userId = accountclass.getAccount()
    headers = {
        'x-fapi-financial-id': 'test',
        'Authorization': 'Bearer '+userToken,
        'Cache-Control': 'no-cache',
    }
    cert = (cert_file_path, key_file_path)
    balanceresponse = requests.get('https://sandbox.hsbc.com/psd2/obie/v3.1/accounts/'+userId+'/balances', headers=headers, cert=cert
                                   )
    print(balanceresponse.json())

    userToken = tokenclass.getToken()

    headers = {
        'x-fapi-financial-id': 'test',
        'Authorization': 'Bearer '+userToken,
        'Cache-Control': 'no-cache',
    }
    cert = (cert_file_path, key_file_path)
    Transactionresponse = requests.get('https://sandbox.hsbc.com/psd2/obie/v3.1/transactions', headers=headers, cert=cert
                                       )

    print(Transactionresponse.json())

    headers = {
        'x-fapi-financial-id': 'test',
        'Authorization': 'Bearer '+userToken,
        'Cache-Control': 'no-cache',
    }
    cert = (cert_file_path, key_file_path)
    productresponse = requests.get('https://sandbox.hsbc.com/psd2/obie/v3.1/accounts/'+userId+'/product', headers=headers, cert=cert
                                   )
    combinedResponse = {
        'balances': balanceresponse.json(),
        'transactions': Transactionresponse.json(),
        'products': productresponse.json()
    }
    print(combinedResponse)

    return JsonResponse(combinedResponse)
