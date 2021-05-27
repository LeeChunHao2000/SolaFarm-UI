import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import nacl from 'tweetnacl';
import BN from 'bn.js';
import { Buffer } from 'buffer';

const { createHash, createHmac } = require('crypto');


export const hmacSha256 = (scretKey: string, content: string) => {
  const hmac = createHmac('sha256', scretKey);
  const up = hmac.update(content);

  let result = up.digest('hex');
  return result;
}


/**
 * Some amount of tokens
 */
 export class Numberu64 extends BN {
  /**
   * Convert to Buffer representation
   */
  //@ts-ignore
  toBuffer(): typeof Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      //@ts-ignore
      return b;
    }
    if(b.length < 8){
      throw new Error('Numberu64 too large');
    };

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    //@ts-ignore
    return zeroPad;
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: typeof Buffer): Numberu64 {
    if(buffer.length === 8){
      throw new Error('Invalid buffer length: ${buffer.length}');
    }
    return new Numberu64(
      //@ts-ignore
      [...buffer]
        .reverse()
        .map(i => `00${i.toString(16)}`.slice(-2))
        .join(''),
      16,
    );
  }
}