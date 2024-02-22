import { AccessToken, getAuthToken } from './googleAuth.lib'
import * as jose from 'jose'
import { GenericClass, GenericObject } from './types/pass'

export async function createPassClass(classSlug: string, issuerId: string, token: AccessToken) {
  const classId = `${issuerId}.${classSlug}`
  const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1'
  // TODO: Create a Generic pass class
  const genericClass: GenericClass = {
    id: `${classId}`,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'object.textModulesData["points"]',
                    },
                  ],
                },
              },
              endItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'object.textModulesData["contacts"]',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
      detailsTemplateOverride: {
        detailsItemInfos: [
          {
            item: {
              firstValue: {
                fields: [
                  {
                    fieldPath: 'class.imageModulesData["event_banner"]',
                  },
                ],
              },
            },
          },
          {
            item: {
              firstValue: {
                fields: [
                  {
                    fieldPath: 'class.textModulesData["game_overview"]',
                  },
                ],
              },
            },
          },
          {
            item: {
              firstValue: {
                fields: [
                  {
                    fieldPath: 'class.linksModuleData.uris["official_site"]',
                  },
                ],
              },
            },
          },
        ],
      },
    },
    imageModulesData: [
      {
        mainImage: {
          sourceUri: {
            uri: 'https://imgur.com/Zwiaac7.png',
          },
          contentDescription: {
            defaultValue: {
              language: 'ja-JP',
              value: 'イオカードパス（GoogleIoに因んで）',
            },
          },
        },
        id: 'event_banner',
      },
    ],
    textModulesData: [
      {
        header: 'いい感じのヘッダテキスト',
        body: '本文だぜ〜',
        id: 'game_overview',
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: 'https://io.google/2022/',
          description: "Official I/O '22 Site",
          id: 'official_site',
        },
      ],
    },
  }

  let response
  try {
    // Check if the class exists already
    response = await fetch(`${baseUrl}/genericClass/${classId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    })
    if (response.status === 200) {
      console.log('Class already exists')
      console.log(response)
    }
    if (response.status === 404) {
      // Class does not exist
      // Create it now
      // response = await httpClient.request({
      //   url: `${baseUrl}/genericClass`,
      //   method: 'POST',
      //   data: genericClass,
      // })

      response = await fetch(`${baseUrl}/genericClass`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify(genericClass),
      })
      console.log('Class insert response')
      console.log(response)
      return { result: true, classJson: genericClass }
    } else {
      return {
        result: false,
        classJson: null,
      }
    }
  } catch (e) {
    console.error(e)
    return {
      result: false,
      classJson: null,
    }
  }
}

export async function createPassObject(
  issuerId: string,
  classId: string,
  objCode: string,
  content: string,
  sa_privkey: string,
  sa_email: string
) {
  const objectId = `${issuerId}.${objCode}`

  const genericObject: GenericObject = {
    id: `${objectId}`,
    classId: classId,
    genericType: 'GENERIC_TYPE_UNSPECIFIED',
    hexBackgroundColor: '#4285f4',
    logo: {
      sourceUri: {
        uri: 'https://pbs.twimg.com/media/GGrNEz_a0AAN067?format=png&name=240x240',
      },
    },
    cardTitle: {
      defaultValue: {
        language: 'ja',
        value: 'AIペーパー',
      },
    },
    subheader: {
      defaultValue: {
        language: 'ja',
        value: '参加者',
      },
    },
    header: {
      defaultValue: {
        language: 'ja',
        value: '尾川史典',
      },
    },
    barcode: {
      type: 'QR_CODE',
      value: `${content}`,
      alternateText: `${content} QR code`,
    },
    heroImage: {
      sourceUri: {
        uri: 'https://imgur.com/Zwiaac7.png',
      },
    },
    textModulesData: [
      {
        header: 'POINTS',
        body: '1234',
        id: 'points',
      },
      {
        header: 'CONTACTS',
        body: '20',
        id: 'contacts',
      },
    ],
  }

  // TODO: Create the signed JWT and link
  const claims = {
    iss: sa_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject],
    },
  }
  const privateKey = await jose.importPKCS8(sa_privkey, 'RS256')

  const token = await new jose.SignJWT(claims).setProtectedHeader({ alg: 'RS256' }).sign(privateKey)
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`
  return saveUrl
}

export const getToken = async (c: {
  env: {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string
  }
}) => {
  const scope = ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/wallet_object.issuer']

  const authInfo = {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: c.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
  }
  return await getAuthToken(authInfo, scope)
}
