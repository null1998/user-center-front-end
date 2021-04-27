
const TokenKey = 'financial_bill_management_token'

export function getToken() {
  return localStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
  // return Cookies.remove(TokenKey)
}
