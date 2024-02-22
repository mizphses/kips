type BarcodeSectionDetails = {
  fieldSelector: FieldSelector
}

type CardBarcodeSectionDetails = {
  firstTopDetail?: BarcodeSectionDetails
  firstBottomDetail?: BarcodeSectionDetails
  secondTopDetail?: BarcodeSectionDetails
}

type FieldSelector = {
  fields: {
    fieldPath: string
    dateFormat?: string
  }[]
}

type TranslatedString = {
  kind?: string
  language: string
  value: string
}

type LocalizedString = {
  kind?: string
  translatedValues?: TranslatedString[]
  defaultValue: TranslatedString
}

type TemplateItem = {
  firstValue: FieldSelector
  secondValue?: FieldSelector
  predefinedItem?: string
}
type DetailsItemInfos = {
  item: TemplateItem
}

type FirstRowOption = {
  transitOption: string
  fieldOption: FieldSelector
}

type ImageUri = {
  uri: string
  description?: string
  localizedDescription?: LocalizedString
}
type ImageObject = {
  kind?: string
  sourceUri: ImageUri
  contentDescription?: LocalizedString
}

type TextModulesData = {
  header: string
  body: string
  localizedHeader?: LocalizedString
  localizedBody?: LocalizedString
  id: string
}

type UriObject = {
  uri: string
  description: string
  id: string
}
type CallbackOptions = {
  url: string
  updateRequestUrl?: string // deprecated
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

type BarcodeObject = {
  kind?: string // deprecated
  type?: string
  renderEncoding?: string
  value?: string
  alternateText: string
  showCodeText?: LocalizedString
}

type Notifications = {
  expiryNotification: {
    enableNotification: boolean
  }

  upcomingNotification: {
    enableNotification: boolean
  }
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

type ImageModuleData = {
  mainImage: ImageObject
  id: string
}

type TextModuleData = {
  header: string
  body: string
  localizedHeader?: LocalizedString
  localizedBody?: LocalizedString
  id: string
}
type AppTarget = {
  targetUri: UriObject
}

type AppLinkInfo = {
  appLogoImage: ImageObject
  title: LocalizedString
  description: LocalizedString
  appTarget: AppTarget
}
type AppLinkData = {
  androidAppLinkInfo?: AppLinkInfo
  iosAppLinkInfo?: AppLinkInfo
  webAppLinkInfo?: AppLinkInfo
}

type GroupingInfo = {
  sortIndex: number
  groupingId: string
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

export type GenericClass = {
  id: string
  classTemplateInfo?: ClassTemplateInfo
  imageModulesData?: {
    mainImage: ImageObject
    id: string
  }[]
  textModulesData?: TextModulesData[]
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
  textModulesData?: TextModulesData[]
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
