type AppLinkData = {
  androidAppLinkInfo?: AppLinkInfo

  iosAppLinkInfo?: AppLinkInfo

  webAppLinkInfo?: AppLinkInfo
}

type AppLinkInfo = {
  appLogoImage: ImageObject

  title: LocalizedString

  description: LocalizedString

  appTarget: AppTarget
}

type AppTarget = {
  targetUri: UriObject
}

type Barcode =
  | 'BARCODE_TYPE_UNSPECIFIED'
  | 'AZTEC'
  | 'CODE_39'
  | 'CODE_128'
  | 'CODABAR'
  | 'DATA_MATRIX'
  | 'EAN_8'
  | 'EAN_13'
  | 'ITF_14'
  | 'PDF_417'
  | 'QR_CODE'
  | 'UPC_A'
  | 'TEXT_ONLY'

type BarcodeObject = {
  kind?: string // deprecated

  type?: Barcode

  renderEncoding?: 'RENDER_ENCODING_UNSPECIFIED' | 'UTF_8'

  value?: string

  alternateText: string

  showCodeText?: LocalizedString
}

type BarcodeSectionDetails = {
  fieldSelector: FieldSelector
}

type CallbackOptions = {
  url: string

  updateRequestUrl?: string // deprecated
}

type CardBarcodeSectionDetails = {
  firstTopDetail?: BarcodeSectionDetails

  firstBottomDetail?: BarcodeSectionDetails

  secondTopDetail?: BarcodeSectionDetails
}

type CardRowItem =
  | {
      oneItem: {
        item: TemplateItem
      }
    }
  | {
      twoItems: {
        startItem: TemplateItem

        endItem: TemplateItem
      }
    }
  | {
      threeItems: {
        startItem: TemplateItem

        middleItem: TemplateItem

        endItem: TemplateItem
      }
    }

type ClassTemplateInfo = {
  cardBarcodeSectionDetails?: CardBarcodeSectionDetails
  cardTemplateOverride?: {
    cardRowTemplateInfos: CardRowItem[]
  }
  detailsTemplateOverride?: {
    detailsItemInfos: DetailsItemInfos[]
  }
  listTemplateOverride?: {
    firstRowOption: FirstRowOption
    secondRowOption?: FieldSelector
    thirdRowOption?: FieldSelector
  }
}

type DetailsItemInfos = {
  item: TemplateItem
}

/* https://developers.google.com/wallet/reference/rest/v1/ClassTemplateInfo?hl=ja#dateformat */

type FieldSelector = {
  fields: {
    fieldPath: string

    dateFormat?: 'DATE_FORMAT_UNSPECIFIED' | 'DATE_TIME' | 'DATE_ONLY' | 'TIME_ONLY' | 'DATE_TIME_YEAR' | 'YEAR_MONTH' | 'YEAR_MONTH_DAY'
  }[]
}

type FirstRowOption = {
  transitOption: 'TRANSIT_OPTION_UNSPECIFIED' | 'ORIGIN_AND_DESTINATION_NAMES' | 'ORIGIN_AND_DESTINATION_CODES' | 'ORIGIN_NAME'

  fieldOption: FieldSelector
}

type GroupingInfo = {
  sortIndex: number

  groupingId: string
}

type ImageModuleData = {
  mainImage: ImageObject

  id: string
}

type ImageObject = {
  kind?: string // deprecated

  sourceUri: ImageUri

  contentDescription?: LocalizedString
}

type ImageUri = {
  uri: string

  description?: string

  localizedDescription?: LocalizedString
}

type LocalizedString = {
  kind?: string // deprecated

  translatedValues?: TranslatedString[]

  defaultValue: TranslatedString
}

type Notifications = {
  expiryNotification: {
    enableNotification: boolean
  }

  upcomingNotification: {
    enableNotification: boolean
  }
}
type RotatingBarcode = {
  type: Barcode

  renderEncoding: 'RENDER_ENCODING_UNSPECIFIED' | 'UTF_8'

  valuePattern: string

  totpDetails: {
    periodMillis: string

    algorithm: string

    parameters: {
      key: string

      valueLength: number
    }[]
  }

  alternateText: string

  showCodeText: LocalizedString

  initialRotatingBarcodeValues: {
    startDateTime: string

    values: [string]

    periodMillis: string
  }
}

type TemplateItem = {
  firstValue: FieldSelector

  secondValue?: FieldSelector

  predefinedItem?: 'PREDEFINED_ITEM_UNSPECIFIED' | 'FREQUENT_FLYER_PROGRAM_NAME_AND_NUMBER' | 'FLIGHT_NUMBER_AND_OPERATING_FLIGHT_NUMBER'
}

type TextModuleData = {
  header: string

  body: string

  localizedHeader?: LocalizedString

  localizedBody?: LocalizedString

  id: string
}

type TimeInterval = {
  kind: string // deprecated

  start: {
    date: string
  }

  end: {
    date: string
  }
}

type TranslatedString = {
  kind?: string // deprecated

  language: string // should be BCP 47

  value: string // should be utf-8
}

type UriObject = {
  uri: string

  description: string

  id: string
}

export type GenericClass = {
  id: string

  classTemplateInfo?: ClassTemplateInfo

  imageModulesData?: {
    mainImage: ImageObject

    id: string
  }[]

  textModulesData?: TextModuleData[]

  linksModuleData?: {
    uris: UriObject[]
  }

  // enableSmartTap?: boolean

  // redemptionIssuers?: [string]

  securityAnimation?: {
    animationType: 'ANIMATION_UNSPECIFIED' | 'FOIL_SHIMMER'
  }

  multipleDevicesAndHoldersAllowedStatus?: 'STATUS_UNSPECIFIED' | 'MULTIPLE_HOLDERS' | 'ONE_USER_ALL_DEVICES	' | 'ONE_USER_ONE_DEVICE'

  callbackOptions?: CallbackOptions

  viewUnlockRequirement?: 'VIEW_UNLOCK_REQUIREMENT_UNSPECIFIED' | 'UNLOCK_NOT_REQUIRED' | 'UNLOCK_REQUIRED_TO_VIEW'
}

export type GenericObject = {
  genericType:
    | 'GENERIC_TYPE_UNSPECIFIED'
    | 'GENERIC_SEASON_PASS'
    | 'GENERIC_UTILITY_BILLS'
    | 'GENERIC_PARKING_PASS'
    | 'GENERIC_VOUCHER'
    | 'GENERIC_GYM_MEMBERSHIP'
    | 'GENERIC_LIBRARY_MEMBERSHIP'
    | 'GENERIC_RESERVATIONS'
    | 'GENERIC_AUTO_INSURANCE'
    | 'GENERIC_HOME_INSURANCE'
    | 'GENERIC_ENTRY_TICKET'
    | 'GENERIC_RECEIPT'
    | 'GENERIC_OTHER'

  cardTitle: LocalizedString

  subheader?: LocalizedString

  header: LocalizedString

  logo?: ImageObject

  hexBackgroundColor?: string

  notifications?: Notifications

  id: string

  classId: string

  barcode: BarcodeObject

  heroImage?: ImageObject

  validTimeInterval?: TimeInterval

  imageModulesData?: ImageModuleData[]

  textModulesData?: TextModuleData[]

  linksModuleData?: {
    uris: UriObject[]
  }

  appLinkData?: AppLinkData

  groupingInfo?: GroupingInfo

  // smartTapRedemptionValue: string

  rotatingBarcode?: RotatingBarcode

  state?: 'STATE_UNSPECIFIED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'INACTIVE'

  hasUsers?: boolean

  passConstraints?: {
    screenshotEligibility: 'SCREENSHOT_ELIGIBILITY_UNSPECIFIED' | 'ELIGIBLE' | 'INELIGIBLE'

    nfcConstraint: Array<'NFC_CONSTRAINT_UNSPECIFIED' | 'BLOCK_PAYMENT' | 'BLOCK_CLOSED_LOOP_TRANSIT'>
  }

  wideLogo?: ImageObject
}

export type GenericClassRequest = {
  classTemplateInfo?: ClassTemplateInfo

  imageModulesData?: {
    mainImage: ImageObject

    id: string
  }[]

  textModulesData?: TextModuleData[]

  linksModuleData?: {
    uris: UriObject[]
  }

  // enableSmartTap?: boolean

  // redemptionIssuers?: [string]

  securityAnimation?: {
    animationType: 'ANIMATION_UNSPECIFIED' | 'FOIL_SHIMMER'
  }

  multipleDevicesAndHoldersAllowedStatus?: 'STATUS_UNSPECIFIED' | 'MULTIPLE_HOLDERS' | 'ONE_USER_ALL_DEVICES	' | 'ONE_USER_ONE_DEVICE'

  callbackOptions?: CallbackOptions

  viewUnlockRequirement?: 'VIEW_UNLOCK_REQUIREMENT_UNSPECIFIED' | 'UNLOCK_NOT_REQUIRED' | 'UNLOCK_REQUIRED_TO_VIEW'
}

export type GenericObjectRequest = {
  genericType: string

  cardTitle: LocalizedString

  subheader?: LocalizedString

  header: LocalizedString

  logo?: ImageObject

  hexBackgroundColor?: string

  notifications?: Notifications

  classId: string

  barcode: BarcodeObject

  heroImage?: ImageObject

  validTimeInterval?: TimeInterval

  imageModulesData?: ImageModuleData[]

  textModulesData?: TextModuleData[]

  linksModuleData?: {
    uris: UriObject[]
  }

  appLinkData?: AppLinkData

  groupingInfo?: GroupingInfo

  // smartTapRedemptionValue: string

  rotatingBarcode?: RotatingBarcode

  state?: 'STATE_UNSPECIFIED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'INACTIVE'

  hasUsers?: boolean

  passConstraints?: {
    screenshotEligibility: 'SCREENSHOT_ELIGIBILITY_UNSPECIFIED' | 'ELIGIBLE' | 'INELIGIBLE'

    nfcConstraint: Array<'NFC_CONSTRAINT_UNSPECIFIED' | 'BLOCK_PAYMENT' | 'BLOCK_CLOSED_LOOP_TRANSIT'>
  }

  wideLogo?: ImageObject
}
