import { AccessToken } from './googleAuth'
import * as jose from 'jose'

export type genericClass = {
  id: string
  classTemplateInfo: {
    cardTemplateOverride: {
      cardRowTemplateInfos: [
        {
          twoItems: {
            startItem: {
              firstValue: {
                fields: [
                  {
                    fieldPath: string
                  }
                ]
              }
            }
            endItem: {
              firstValue: {
                fields: [
                  {
                    fieldPath: string
                  }
                ]
              }
            }
          }
        }
      ]
    }
    detailsTemplateOverride: {
      detailsItemInfos: [
        {
          item: {
            firstValue: {
              fields: [
                {
                  fieldPath: string
                }
              ]
            }
          }
        }
      ]
    }
  }
  imageModulesData: [
    {
      mainImage: {
        sourceUri: {
          uri: string
        }
        contentDescription: {
          defaultValue: {
            language: string
            value: string
          }
        }
      }
      id: string
    }
  ]
  textModulesData: [
    {
      header: string
      body: string
      id: string
    }
  ]
  linksModuleData: {
    uris: [
      {
        uri: string
        description: string
        id: string
      }
    ]
  }
}

export async function createPassClass(issuerId: string, token: AccessToken) {
  const classId = `${issuerId}.m1_test_class`
  const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1'
  // TODO: Create a Generic pass class
  let genericClass = {
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
      return true
    } else {
      return false
    }
  } catch (e) {
    console.error(e)
    return false
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
  let objectId = `${issuerId}.${objCode}`

  let genericObject = {
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
