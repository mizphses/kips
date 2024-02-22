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

type BarcodeObject = {
  kind?: string // deprecated

  type?: string

  renderEncoding?: string

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
  kind?: string

  sourceUri: ImageUri

  contentDescription?: LocalizedString
}

type ImageUri = {
  uri: string

  description?: string

  localizedDescription?: LocalizedString
}

type LocalizedString = {
  kind?: string

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
  type: string

  renderEncoding: string

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
  kind: string

  start: {
    date: string
  }

  end: {
    date: string
  }
}

type TranslatedString = {
  kind?: string

  language: string

  value: string
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
  genericType: string

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

  state?: string

  hasUsers?: boolean

  passConstraints?: {
    screenshotEligibility: string

    nfcConstraint: string[]
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
    animationType: string
  }

  multipleDevicesAndHoldersAllowedStatus?: string

  callbackOptions?: CallbackOptions

  viewUnlockRequirement?: string
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

  state?: string

  hasUsers?: boolean

  passConstraints?: {
    screenshotEligibility: string

    nfcConstraint: string[]
  }

  wideLogo?: ImageObject
}
