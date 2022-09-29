//
// This service provides variables that
// may change dependent on deployment
// environment.
//
const environment = {
  DEFAULT_PROVIDER_URL: process.env.REACT_APP_DEFAULT_PROVIDER_URL,
  DEFAULT_BLOCK_EXPLORER_URL: process.env.REACT_APP_DEFAULT_BLOCK_EXPLORER_URL,
  DEFAULT_CHAIN_ID: process.env.REACT_APP_DEFAULT_CHAIN_ID,
  DEFAULT_CHAIN_NAME: process.env.REACT_APP_DEFAULT_CHAIN_NAME,
  BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL,
  MAX_REGISTRATION_QUANTITY: 5, // years
  MAX_REGISTRATION_NAMES: 8, // number of names per registration chunk
  REGISTRATIONS_ENABLED: true,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  AUCTION_KEY: process.env.REACT_APP_AUCTION_KEY,
  PROOF_KEY: process.env.REACT_APP_PROOF_KEY,
  APOLLO_PROVIDER_TESTNET:
    process.env.REACT_APOLLO_PROVIDER_TESTNET ||
    'http://xapi28.fantom.network:16761/api',
  APOLLO_PROVIDER:
    process.env.REACT_APOLLO_PROVIDER || 'https://xapi.fantom.network/',
  PUMPKIN_ADDRESS_TESTNET:
    process.env.REACT_PUMPKIN_ADDRESS_TESTNET ||
    '0x4637AE3c3c4675f895BC2176Abd3c871dE1ea05d',
  PUMPKIN_ADDRESS:
    process.env.REACT_PUMPKIN_ADDRESS ||
    '0xAD522217E64Ec347601015797Dd39050A2a69694',
}

export default environment
