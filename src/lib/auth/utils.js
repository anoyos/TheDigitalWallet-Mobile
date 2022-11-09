import { create, encrypt, createHashKey } from 'app/lib/pkey'
import { createWallet } from 'app/lib/eth'
import * as api from 'app/lib/api'
import { getCurrencies, getLocales } from 'react-native-localize'
import getSymbolFromCurrency from 'currency-symbol-map'

export const getCurrency = async () => {
  const symbol = getCurrencies()[0]
  const character = getSymbolFromCurrency(symbol)
  const locales = getLocales()[0]

  return { currency: { symbol, character }, locales }
}

export const checkBuffer = (_, value) => (((value instanceof Object) && (value.type === 'Buffer'))
  ? Buffer.from(value.data)
  : value)

export const generateEthUserData = async (password) => {
  const hashKey = await createHashKey(password)
  const randomKey = await create()
  const [privateKey, address] = await createWallet(randomKey)
  const encryptedKey = await encrypt(privateKey.slice(2), hashKey)

  return { address, encryptedKey, hashKey }
}

export const generateReferralCode = () => Math.random().toString(36)
  .slice(-6)
  .toUpperCase()

export const navigateToScreen = (screen, kyc, navigate, params) => {
  if (kyc.status === 'verified') return navigate(screen, params)
  if (kyc.status === 'pending') return navigate('KYCPending')

  return navigate('KYC')
}

export const createBusiness = async (business, { encryptedKey, walletAddress: address, hashKey }) => {
  const { lat: latitude, lng: longitude } = (business.formattedAddress.geometry || {}).location || {}
  const { id, imageUrl } = await api.createBusiness({
    ...business,
    latitude,
    longitude,
    formattedAddress: JSON.stringify(business.formattedAddress),
    encryptedKey,
    address,
  })

  return {
    id: parseInt(id, 10),
    ...business,
    imageUrl: { uri: imageUrl },
    encryptedKey,
    hashKey,
    address,
  }
}
