/**
 * Create, encrypt and decrypt private key
 *
 * Key is encrypted with aes-256-gcm with pbkdf2 made secret
 */
import {randomBytes, pbkdf2, createCipheriv, createDecipheriv} from 'crypto';

// random salt - 128 bit
const SALT_SIZE = 16;
// initial vector size - 128 bit
const IV_SIZE = 16;
// derive encryption key: 32 byte key length
const KEY_SIZE = 32;
// number of pbkdf2 iterations
// the value of 13215 is randomly chosen!
const HASH_ITER = 13215;

const CIPHER = 'aes-256-gcm';
// default auth tag size
const TAG_SIZE = 16;

function promisify(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, value) => {
      if (err) return reject(err);
      return resolve(value);
    });
  });
}

function parseEncryptedKey(enc) {
  let pos = 0;
  const salt = enc.slice(pos, SALT_SIZE);
  pos += SALT_SIZE;
  const iv = enc.slice(pos, pos + IV_SIZE);
  pos += IV_SIZE;
  const tag = enc.slice(pos, pos + TAG_SIZE);
  pos += TAG_SIZE;
  const data = enc.slice(pos);

  return {salt, iv, tag, data};
}

/**
 * create random key
 *
 * @async
 * @param {number} len Length of generated key in bytes, default 32 bytes
 * @returns {Promise<string>} Random 32 byte key encoded as hex
 */
export async function create(len = 32) {
  const buff = await promisify(randomBytes, len);
  return buff.toString('hex');
}

export async function createHashKey(password) {
  const passwordBuf = Buffer.from(password, 'utf8');

  const salt = await promisify(randomBytes, SALT_SIZE);
  const hash = await promisify(
    pbkdf2,
    passwordBuf,
    salt,
    HASH_ITER,
    KEY_SIZE,
    'sha512',
  );

  return {
    hash,
    salt,
  };
}

export async function createHashKeyFromEncKey(encHex, password) {
  const enc = Buffer.from(encHex, 'hex');
  const passwordBuf = Buffer.from(password, 'utf8');

  const {salt} = parseEncryptedKey(enc);
  const hash = await promisify(
    pbkdf2,
    passwordBuf,
    salt,
    HASH_ITER,
    KEY_SIZE,
    'sha512',
  );

  return {salt, hash};
}

/**
 * encrypts private key
 *
 * @async
 * @param {string} pkeyHex private key (hex encoded)
 * @param {Object} hashKey
 * @return {Promise<string>} hex encoded encrypted data
 */
export async function encrypt(pkeyHex, hashKey) {
  const pkey = Buffer.from(pkeyHex, 'hex');

  const {salt, hash} = hashKey;
  const iv = await promisify(randomBytes, IV_SIZE);

  const cipher = createCipheriv(CIPHER, hash, iv);
  const data = Buffer.concat([cipher.update(pkey), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, data]).toString('hex');
}

/**
 * decrypts private key
 *
 * @async
 * @param {string} encHex encrypted private key (hex encoded)
 * @param {Object} hashKey
 * @return {Promise<string>} private key
 */
export async function decrypt(encHex, hashKey) {
  try {
    const enc = Buffer.from(encHex, 'hex');

    const {hash} = hashKey;
    const {iv, tag, data} = parseEncryptedKey(enc);
    const decipher = createDecipheriv(CIPHER, hash, iv);
    decipher.setAuthTag(tag);

    const key = Buffer.concat([decipher.update(data), decipher.final()]);
    return key.toString('hex');
  } catch (error) {
    return new Error('Unable to decrypt.');
  }
}
