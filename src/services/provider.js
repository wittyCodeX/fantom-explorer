//
// This service handles the connection
// with the web3 provider
//
import API from 'services/api'
import { ethers } from 'ethers'

import services from 'services'

let _isConnected = false
let _chainId
let _account
let _provider
let _providerType // METAMASK or WALLETCONNECT

const PROVIDER_TYPES = {
  METAMASK: 1,
  WALLETCONNECT: 2,
}

const events = new EventTarget()

const EVENTS = {
  CONNECTED: 1,
}

const provider = {
  // whether we have a web3 connection or not
  isConnected: () => _isConnected,

  EVENTS,
  PROVIDER_TYPES,

  providerType: () => {
    return _providerType
  },

  // get api client
  buildAPI: () => {
    // _chainId set when we connect
    // _account set when we connect
    // _signer set when we connect

    _chainId = parseInt(services.environment.DEFAULT_CHAIN_ID)
    _provider = new ethers.providers.JsonRpcProvider(
      services.environment.DEFAULT_PROVIDER_URL,
    )
    //_signer = _provider.getSigner(ethers.Wallet.createRandom().address)
    return new API(_chainId, _account, _provider)
  },

  // listen for changes
  addEventListener: (eventName, callback) => {
    events.addEventListener(eventName, callback)
  },

  // stop listening for changes
  removeEventListener: (eventName, callback) => {
    events.removeEventListener(eventName, callback)
  },
}

export default provider
