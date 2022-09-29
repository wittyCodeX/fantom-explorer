//
// This file is responsible for generating links throughout the
// application, so that if a path needs to be changed it's not
// a difficult task.
//

import environmentService from 'services/environment'
import linkingService from 'services/linking'

const paths = {
  Domain: '/domains/:domain',
  Landing: '/',
  MyDomains: '/user/domains',
  SunriseAuctionMyBids: '/sunrise/bids',
  SunriseAuction: '/sunrise',
  Register: '/register',
  Renew: '/renew',
  SetPassword: '/set-password/:token',
  Settings: '/settings',
}

const backendPaths = {
  Login: '/account/api/auth/',
  ResetPassword: '/account/api/reset-password/',
  SetPassword: '/account/api/set-password/',
  GetChallenge: '/account/api/get-challenge/',
  CreateAccount: '/account/api/create-account/',
  VerifyWallet: '/account/api/verify-wallet/',
  GetSignature: '/account/api/get-signature/',
}

const linkingEvents = new EventTarget()

const linking = {
  EVENTS: {
    ROUTE_CHANGED: 1,
  },

  // generates the path, to be used in links
  path: (pathName, params) => {
    let path = paths[pathName]
    if (!path)
      throw new Error(`Missing path "${pathName}". Check services/linking.js.`)
    if (params) {
      for (let key in params) {
        path = path.replace(`:${key}`, params[key])
      }
    }
    return path
  },

  // extracts url params from the current url
  getParams: (pathName) => {
    const tpl = paths[pathName].split('/')
    const path = window.location.pathname.split('/')
    const params = {}
    for (let i = 0; i < tpl.length; i += 1) {
      if (tpl[i][0] === ':') {
        params[tpl[i].substr(1)] = path[i]
      }
    }
    return params
  },

  // listen for param changes
  addEventListener: (pathName, callback) => {
    linkingEvents.addEventListener(pathName, callback)
  },

  // stop listening for param changes
  removeEventListener: (pathName, callback) => {
    linkingEvents.removeEventListener(pathName, callback)
  },

  // performs a navigation
  // we need to make sure to update any
  // existing components
  navigate: (navigator, pathName, params) => {
    navigator(linkingService.path(pathName, params))
    linkingEvents.dispatchEvent(new Event(pathName))
  },

  routeChanged: () => {
    linkingEvents.dispatchEvent(new Event(linking.EVENTS.ROUTE_CHANGED))
  },

  // returns the url for a static file
  static: (path) => {
    return `/${path}`
  },

  // returns the URL for a route on the backend server
  backend: (routeName) => {
    return environmentService.BACKEND_BASE_URL + backendPaths[routeName]
  },
}

export default linking
