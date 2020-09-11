function PVError(name: string, message: string = '') {
  const error = new Error()
  error.name = name
  error.message = message
  return error
}

const _freeTrialExpiredName = 'freeTrialExpired'
const _loginInvalidName = 'loginInvalid'
const _premiumMembershipExpiredName = 'premiumMembershipExpired'

export const Errors = {
  FREE_TRIAL_EXPIRED: {
    name: _freeTrialExpiredName,
    error: () => PVError(_freeTrialExpiredName, 'Free Trial Expired')
  },
  LOGIN_INVALID: {
    name: _loginInvalidName,
    error: () => PVError(_loginInvalidName, 'Invalid username or password')
  },
  PREMIUM_MEMBERSHIP_EXPIRED: {
    name: _premiumMembershipExpiredName,
    error: () => PVError(_premiumMembershipExpiredName, 'Premium Membership Expired')
  }
}
