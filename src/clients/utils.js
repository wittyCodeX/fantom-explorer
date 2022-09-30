import { ethers } from 'ethers'

// circomlib 0.8.0 implementation
// import poseidon  from 'circomlibjs/src/poseidon.js'

// circomlib 0.1.0 implementation
import { buildPoseidon } from 'circomlibjs'
let poseidon
const poseidonInit = buildPoseidon()
poseidonInit.then((_p) => (poseidon = _p))

/*
  converts a number into a bitstring
  algorithm mirrors that of github.com/iden3/circomlib
*/
export const num2Bits = (inputNum, numBits) => {
  var lc1 = 0n
  var e2 = 1n
  var out = []
  for (var i = 0n; i < numBits; i += 1n) {
    out[i] = (BigInt(inputNum) >> i) & 1n
    lc1 += out[i] * e2
    e2 = e2 + e2
  }
  return out
}

/*
  converts a bitstring into a number
  algorithm mirrors that of github.com/iden3/circomlib
*/
export const bits2Num = (inputBits) => {
  var lc1 = BigInt(0)
  var e2 = BigInt(1)
  for (var i = 0; i < inputBits.length; i += 1) {
    lc1 += BigInt(inputBits[i]) * e2
    e2 = e2 + e2
  }
  return lc1
}

/*
  converts a string to an array of numbers (ascii codes)
  zero-pads the string to `len` length
*/
export const string2AsciiArray = (text, len) => {
  if (len === undefined) throw 'string2AsciiArray requires a padding length'
  if (text.length > len) throw 'Out of bounds'
  const signal = text.split('').map((t) => t.charCodeAt(0))
  while (signal.length < len) {
    signal.push(0)
  }
  return signal
}

const characterAllowlist = 'abcdefghijklmnopqrstuvwxyz0123456789-'
  .split('')
  .map((s) => s.charCodeAt(0))

const asciiArray2String = (codes) => {
  let string = ''
  let code
  for (let i = 0; i < codes.length; i += 1) {
    code = parseInt(codes[i])
    if (code === 0) {
      // do nothing, null byte
    } else if (characterAllowlist.indexOf(code) > -1) {
      string += String.fromCharCode(code)
    } else {
      throw 'Unrecognized character found'
    }
  }
  return string
}

/*
  prepares an ascii array for input into 
  the posiedon algorithm
*/
const _singlePreimageSignal = (chars) => {
  const inputBitsArr = chars.map((c) => num2Bits(c, 8))
  const preimageStr = inputBitsArr.reduce((sum, curr) => {
    return sum + curr.join('')
  }, '')
  const preimageNum = bits2Num(preimageStr)
  return preimageNum

  const split = []
  let s
  for (var i = 0; i < signal.length; i += 1) {
    if (i % 31 === 0) {
      s = []
      split.push(s)
    }
    s.push(signal[i])
  }
  return split.map((s) => {
    return BigInt(
      '0x' +
        s.reduce((sum, curr) => {
          return sum + curr.toString(16)
        }, ''),
    )
  })
}

/*
  splits an ascii array into chunks of
  length 31 & prepares each chunk 
  for insertion into the poseidon algorithm
*/
export const asciiArray2PreimageSignal = (_chars) => {
  const chars = []
  let c
  for (var i = 0; i < _chars.length; i += 1) {
    if (i % 31 === 0) {
      c = []
      chars.push(c)
    }
    c.push(_chars[i])
  }
  return chars.map(_singlePreimageSignal)
}

// inverse of asciiArray2PreimageSignal
const preimageSignal2AsciiArray = (arr) => {
  const charArrays = arr.map((aa) => {
    const outputBits = num2Bits(BigInt(aa), 248n)
    return outputBits.join('')
  })
  let bits = charArrays[0] + charArrays[1]
  let pack = []
  let chars = []
  for (let i = 0; i < bits.length; i += 1) {
    pack.push(bits[i])
    if (pack.length === 8) {
      chars.push(bits2Num(pack))
      pack = []
    }
  }
  return chars
}

/* runs a preimageSignal through the poseidon hash */
export const preimageSignal2HashSignal = async (num) => {
  // circomlib 0.1.0 implementation
  await poseidonInit
  const arr = poseidon(num)
  const hashed = poseidon.F.toObject(arr)

  // circomlib 0.0.8 implementation
  //const hashed = poseidon(num)

  return hashed
}

/* computes keccak256 of a string */
export const keccak256 = (str) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str))
}

export const nameHashIteration = async (prevHash, label) => {
  const ascii = string2AsciiArray(label, 62)
  const preimage = asciiArray2PreimageSignal(ascii)
  const hash = await preimageSignal2HashSignal([prevHash].concat(preimage))
  return hash
}

export const nameHash = async (domain) => {
  let labels = domain.split('.')
  labels.reverse()
  let hash = 0
  for (let i = 0; i < labels.length; i += 1) {
    hash = await nameHashIteration(hash, labels[i])
  }
  return hash
}

export const registrationCommitHash = async (
  _nameHashes,
  quantities,
  constraintsProofs,
  pricingProofs,
  salt,
) => {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['int[]', 'int[]', 'bytes[]', 'bytes[]', 'string'],
      [_nameHashes, quantities, constraintsProofs, pricingProofs, salt],
    ),
  )
}

const encodeNameHashInputSignals = async (domain) => {
  let labels = domain.split('.')
  labels.reverse()
  let outputs = labels.map((label) => {
    const ascii = string2AsciiArray(label, 62)
    const preimage = asciiArray2PreimageSignal(ascii)
    return preimage
  })
  let flattened = []
  for (let i = 0; i < outputs.length; i += 1) {
    flattened.push(outputs[i][0])
    flattened.push(outputs[i][1])
  }
  return flattened
}

const decodeNameHashInputSignals = async (inputSignals) => {
  let unflattened = []
  for (let i = 0; i < inputSignals.length; i += 1) {
    if (i % 2 === 0) {
      unflattened.push([inputSignals[i], inputSignals[i + 1]])
    }
  }
  const arr = unflattened.map((pair) => {
    const arr = preimageSignal2AsciiArray(pair)
    return asciiArray2String(arr)
  })
  arr.reverse()
  return arr.join('.')
}

export default {
  num2Bits,
  bits2Num,
  string2AsciiArray,
  asciiArray2PreimageSignal,
  preimageSignal2HashSignal,
  keccak256,
  nameHash,
  nameHashIteration,
  registrationCommitHash,
  encodeNameHashInputSignals,
  decodeNameHashInputSignals,
}
