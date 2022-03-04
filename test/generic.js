import tap from 'tap'
import { Webcryptobox } from '../index.js'

tap.test('cipher agnostic', async g => {
  const wcb = new Webcryptobox()

  g.test('encoding & decoding', async t => {
    const testData = new Uint8Array([97, 98, 99])
    const testPublicKeyPem = `-----BEGIN PUBLIC KEY-----
YWJj
-----END PUBLIC KEY-----
`
    const testPrivateKeyPem = `-----BEGIN PRIVATE KEY-----
YWJj
-----END PRIVATE KEY-----
`

    t.test('decodePublicKeyPem', async t => {
      const decoded = wcb.decodePublicKeyPem(testPublicKeyPem)
      t.type(decoded, 'Uint8Array')
      t.same(decoded, testData)
    })

    t.test('encodePublicKeyPem', async t => {
      const encoded = wcb.encodePublicKeyPem(testData)
      t.type(encoded, 'string')
      t.same(encoded, testPublicKeyPem)
    })

    t.test('decodePrivateKeyPem', async t => {
      const decoded = wcb.decodePrivateKeyPem(testPrivateKeyPem)
      t.type(decoded, 'Uint8Array')
      t.same(decoded, testData)
    })

    t.test('encodePrivateKeyPem', async t => {
      const encoded = wcb.encodePrivateKeyPem(testData)
      t.type(encoded, 'string')
      t.same(encoded, testPrivateKeyPem)
    })
  })

  g.test('key generation', async t => {
    t.test('generateKeyPair', async t => {
      const { publicKey, privateKey } = await wcb.generateKeyPair()
      t.type(publicKey, 'CryptoKey')
      t.type(privateKey, 'CryptoKey')
    })

    t.test('generateKey', async t => {
      const key = await wcb.generateKey()
      t.type(key, 'CryptoKey')
    })

    t.test('generateIv', async t => {
      const iv = await wcb.generateIv()
      t.type(iv, 'object')
    })
  })

  g.test('key export & import', async t => {
    const key = await wcb.generateKey()
    const { publicKey, privateKey } = await wcb.generateKeyPair()

    t.test('exportKey', async t => {
      const exportedKey = await wcb.exportKey(key)
      t.type(exportedKey, 'ArrayBuffer')
    })

    t.test('importKey', async t => {
      const data = await wcb.exportKey(key)
      const importedKey = await wcb.importKey(data)
      t.type(importedKey, 'CryptoKey')
      t.same(importedKey, key)
    })

    t.test('exportPublicKey', async t => {
      const exportedKey = await wcb.exportPublicKey(publicKey)
      t.type(exportedKey, 'ArrayBuffer')
    })

    t.test('exportPublicKey as pem', async t => {
      const pem = await wcb.exportPublicKeyPem(publicKey)
      t.type(pem, 'string')
      t.match(pem, /^-----BEGIN PUBLIC KEY-----\n/g)
    })

    t.test('importPublicKey', async t => {
      const data = await wcb.exportPublicKey(publicKey)
      const importedKey = await wcb.importPublicKey(data)
      t.type(importedKey, 'CryptoKey')
      t.same(importedKey, publicKey)
    })

    t.test('exportPrivateKey', async t => {
      const exportedKey = await wcb.exportPrivateKey(privateKey)
      t.type(exportedKey, 'ArrayBuffer')
    })

    t.test('importPrivateKey', async t => {
      const data = await wcb.exportPrivateKey(privateKey)
      const importedKey = await wcb.importPrivateKey(data)
      t.type(importedKey, 'CryptoKey')
      t.same(importedKey, privateKey)
    })

    t.test('importPrivateKeyPem', async t => {
      const pem = await wcb.exportPrivateKeyPem(privateKey)
      const importedKey = await wcb.importPrivateKeyPem(pem)
      t.type(importedKey, 'CryptoKey')
      t.same(importedKey, privateKey)
    })
  })
})