import web3utils from "web3-utils";
import services from "services";
import clients from "clients";
const downtimeThreshold = 10;
export const BASE_URL = "https://example.com/api/";

const WEI_IN_FTM = 1000000000000000000;

/**
 * @param {string} _value
 * @return {int}
 */
export function formatHexToInt(_value) {
  if (!_value) {
    return "";
  }

  // return web3utils.toBN(_value);
  return parseInt(_value, 16);
}

export function formatIntToHex(number) {
  if (number < 0) {
    number = 0xffffffff + number + 1;
  }

  return "0x" + Number(number).toString(16).toUpperCase();
}
/**
 * @param {*} _obj
 * @return {boolean}
 */
export function isArray(_obj) {
  return Array.isArray(_obj);
  // return Object.prototype.toString.call(_obj) === '[object Array]';
}
/**
 * Retuns index of the first founded item `_i` in array `_a`,
 * otherwise returns `-1`. No type checking.
 *
 * @param {*} _i
 * @param {array} _a
 * @param {boolean} [_deep]
 * @return {int}
 */
export function inArray(_i, _a, _deep) {
  let i = 0;
  let len = 0;
  let idx = -1;

  if (isArray(_a)) {
    len = _a.length;
    /* if (_a.indexOf) {
            idx = _a.indexOf(_i);
        } else { */
    for (i = 0; i < len; i += 1) {
      if (_deep) {
        // eslint-disable-next-line eqeqeq
        if (_i == _a[i]) {
          idx = i;
          break;
        }
        // eslint-disable-next-line eqeqeq
      } else if (_i == _a[i]) {
        idx = i;
        break;
      }
    }
  }

  return idx;
}

/**
 * Stringify object, skip cyclic objects.
 *
 * @param {object} _obj
 * @param {array|object} [_except] Regular expression or array of attributes names, which shouldn't be serialized.
 * @param {bool} [_encode]
 * @return {string}
 */
export function serializeObject(_obj, _except, _encode) {
  let seen = [];
  let regExpUsed = false;
  let so = "";

  if (_except) {
    regExpUsed = _except instanceof RegExp;
  }

  so = JSON.stringify(_obj, (_key, _val) => {
    if (
      _except &&
      (regExpUsed ? _except.test(_key) : inArray(_key, _except) >= 0)
    ) {
      return;
    }
    if (typeof _val === "object") {
      seen.push(_val);
    } else if (typeof _val === "function") {
      return;
    }

    // eslint-disable-next-line consistent-return
    return _val;
  });

  if (_encode) {
    so = encodeURIComponent(so);
  }

  seen = null;

  // alert(so)

  return so;
}

/**
 * Clone object.
 *
 * @param {object} _obj
 * @param {array|object} [_except] Regular expression or array of attributes names to be skipped, when cloning.
 * @return {object}
 */
export function cloneObject(_obj, _except) {
  return _obj ? JSON.parse(serializeObject(_obj, _except)) : {};
}

/**
 * @param {object} _obj
 * @return {boolean}
 */
export function isObjectEmpty(_obj) {
  return Object.keys(_obj).length === 0;
}
/**
 * @param {number} _number
 * @param {number} [_fractionDigits]
 * @param {string} [_currency]
 * @param {boolean} [_variableFDigits]
 * @return {*}
 */
export function formatNumberByLocale(
  _number,
  _fractionDigits = 2,
  _currency,
  _variableFDigits
) {
  let options = {
    minimumFractionDigits: _variableFDigits ? 0 : _fractionDigits,
    maximumFractionDigits: _fractionDigits,
  };

  if (_currency) {
    options.style = "currency";
    options.currency = _currency;
  }

  return new Intl.NumberFormat("en-US", options).format(_number);
}

/**
 * @param {string|number} _timestamp
 * @return {int}
 */
export function prepareTimestamp(_timestamp) {
  if (!_timestamp) {
    return 0;
  }

  let timestamp = _timestamp;

  if (web3utils.isHexStrict(_timestamp)) {
    timestamp = formatHexToInt(_timestamp);
  }

  if (timestamp >= 1e16 || timestamp <= -1e16) {
    timestamp = Math.floor(timestamp / 1000000);
  } else if (timestamp >= 1e14 || timestamp <= -1e14) {
    timestamp /= 1000;
  } else {
    timestamp *= 1000;
  }

  return timestamp;
}
/**
 * @param {string|number} _timestamp
 * @return {Date|''}
 */
export function timestampToDate(_timestamp) {
  const timestamp = prepareTimestamp(_timestamp);

  if (!timestamp) {
    return "";
  }

  return new Date(timestamp);
}
/**
 * @param {Date} _date
 * @returns {null|Date}
 */
function dateToUTCDate(_date) {
  if (_date instanceof Date) {
    return new Date(_date.getTime() - _date.getTimezoneOffset() * 60000);
  }

  return null;
}
/**
 * @param {string|Date} _value
 * @param {boolean} [_notWeekday]
 * @param {boolean} [_notTime]
 * @return {string}
 */
export function formatDate(_value, _notWeekday, _notTime) {
  if (!_value) {
    return "";
  }

  const date = _value instanceof Date ? _value : new Date(_value);
  const utcDate = dateToUTCDate(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (!_notTime) {
    options.timeZoneName = "short";
  }

  if (!_notWeekday) {
    // options.weekday = 'short';
  }

  if (!_notTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  // TODO: use i18n current locale
  return utcDate !== null && utcDate.getTime() === 0
    ? "-"
    : date.toLocaleDateString("en-US", options);
}
/**
 * @param {string|number} _value
 * @return {string}
 */
export function formatDuration(_value) {
  if (!_value) {
    return "";
  }

  let timestamp = _value;

  if (web3utils.isHexStrict(_value)) {
    timestamp = formatHexToInt(_value);
  }

  if (timestamp) {
    return `${parseInt(timestamp / 3600) % 60}h ${
      parseInt(timestamp / 60) % 60
    }m ${timestamp % 60}s`;
  }

  return "";
}
/**
 * @param {string} _value
 * @return {string}
 */
export function formatHash(_value) {
  if (!_value) {
    return "";
  }

  const leftChars = 8;
  const rightChars = 6;

  if (_value.length > leftChars + rightChars + 3) {
    return `${_value.slice(0, leftChars)} ... ${_value.slice(-rightChars)}`;
  }

  return _value;
}

/**
 * @param {string|number} _value*
 * @param {int} _digits
 * @return {string}
 */
export function numToFixed(_value, _digits) {
  let value = _value;

  if (web3utils.isHexStrict(_value)) {
    value = formatHexToInt(_value);
  }

  return Number.parseFloat(value).toFixed(_digits);
}
/**
 * @param {number} _downtime
 * @return {number}
 */
export function clampDowntime(_downtime) {
  return _downtime < downtimeThreshold ? 0 : _downtime;
}

/**
 * Check if given string is transaction hash, address or block number.
 *
 * @return {'transaction_hash' | 'address' | 'block' | ''}
 */
export function getTypeByStr(_str) {
  let type = "";
  let num = 0;

  if (_str) {
    if (web3utils.isHexStrict(_str)) {
      if (_str.length === 66) {
        type = "transaction_hash";
        // } else if (web3utils.toChecksumAddress(_str)) {
      } else if (web3utils.isAddress(_str)) {
        type = "address";
      }
    } else {
      num = parseInt(_str);
      if (!isNaN(num)) {
        type = "block";
      } else {
        type = "domain";
      }
    }
  }

  return type;
}

/**
 * @return {number}
 */
export function WEIToFTM(_value) {
  return _value / WEI_IN_FTM;
}

/**
 * @return {number}
 */
export function FTMToWEI(_value) {
  return _value * WEI_IN_FTM;
}

/**
 * @return {string}
 */
export async function addressToDomain(address) {
  const api = services.provider.buildAPI();
  try {
    const nameHash = await api.contracts.EVMReverseResolverV1.get(address);
    const nameSignal = await api.contracts.RainbowTableV1.lookup(nameHash.name);
    return await clients.utils.decodeNameHashInputSignals(nameSignal);
  } catch {
    return address;
  }
}
/**
 * @return {string}
 */
export async function domainToAddress(domain) {
  try {
    const api = services.provider.buildAPI();
    const address = await api.getReverseRecords(domain);
    return address;
  } catch {
    return null;
  }
}

/**
 * Convert given value from token decimals space.
 *
 * @param {string} _value Hex value.
 * @param {DefiToken} _token
 * @param {boolean} [_isPrice]
 */
export function fromTokenValue(_value, _token, _isPrice = false) {
  let value = 0;

  if (_value !== undefined && !isNaN(_value)) {
    value = parseFloat(
      shiftDecPointLeft(
        _value,
        _isPrice ? _token.priceDecimals : _token.decimals
      )
    );
  }

  return value;
}

/**
 * Convert given value to token decimals space.
 *
 * @param {string} _value
 * @param {DefiToken} _token
 * @param {boolean} [_isPrice]
 * @return {string}
 */
export function toTokenValue(_value, _token, _isPrice = false) {
  let value = 0;

  if (_value !== undefined && !isNaN(_value)) {
    value = shiftDecPointLeft(
      _value.toString(),
      _isPrice ? _token.priceDecimals : _token.decimals
    );
  }

  return value;
}

/**
 * @param {DefiToken} _token
 * @param {number} _default
 * @return {number}
 */
export function getTokenDecimals(_token, _default = 6) {
  const tokenPrice = getTokenPrice(_token);
  let decimals = _default;

  if (tokenPrice < 0.5 && tokenPrice > 0) {
    decimals = 1;
  } else if (tokenPrice < 100) {
    decimals = 2;
  } else if (tokenPrice < 1000) {
    decimals = 5;
  }

  return decimals;
  // return this.tokenDecimals[_token.symbol] || 2;
}
/**
 * @param {string} _value
 * @param {number} _dec Number of decimals.
 * @return {string}
 */
function shiftDecPointLeft(_value, _dec = 0) {
  // const value = web3utils.toBN(_value).toString(10);
  const value = web3utils.toBN(removeSN(_value, _dec)).toString(10);
  const idx = value.length - _dec;

  if (idx < 0) {
    return `0.${web3utils.padLeft(value, _dec, "0")}`;
  } else {
    return value.slice(0, idx) + "." + value.slice(idx);
  }
}
/**
 * Remove scientific notation.
 *
 * @param {string|number} _value
 * @param {number} _dec
 * @return {string|*}
 */
function removeSN(_value, _dec) {
  const value = typeof _value !== "string" ? _value.toString() : _value;

  if (
    value.indexOf("0x") === -1 &&
    (value.indexOf("e") > -1 || value.indexOf("E") > -1)
  ) {
    return parseFloat(value).toFixed(_dec);
  }

  return _value;
}

/**
 * @param {DefiToken} _token
 * @return {string}
 */
function getTokenSymbol(_token) {
  return _token && _token.symbol
    ? _token.symbol !== "FTM"
      ? lowercaseFirstChar(_token.symbol)
      : _token.symbol
    : "";
}

/**
 * @param {DefiToken} _token
 * @return {number}
 */
function getTokenPrice(_token) {
  return _token && "price" in _token
    ? fromTokenValue(_token.price, _token, true)
    : 0;
}

export const setDOMDarkmode = (value) => {
  const rootElem = document.documentElement;
  if (value) {
    rootElem.classList.add("dark");
  } else {
    rootElem.classList.remove("dark");
  }
};
