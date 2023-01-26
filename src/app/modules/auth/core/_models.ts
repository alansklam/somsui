export interface AuthModel {
  api_token: string
  refreshToken?: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserModel {
  id: number
  id_number: number
  name: string
  email: string
  contact: string
  wechat: string
  orders: Array<number>
  orderCount: number
  mobile_phone_cn: string
  mobile_phone_hk: string
  email_verified_at: boolean
  address1: string
  address2: string
  student_id: string
  university_id: number
  city_id: string
  created_at: string
  deleted_at: string
  is_reset: boolean
  last_login: string
  private_notes: string
  shipping_address1: string
  shipping_address2: string
  state_id: string
  updated_at: string
}
