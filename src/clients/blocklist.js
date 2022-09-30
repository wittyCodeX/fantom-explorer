import hashes from './lib/blocklist.js'

const isBlocked = (hash) => {
  return hashes.indexOf(hash.toString()) > -1
}

export default {
  isBlocked,
}
