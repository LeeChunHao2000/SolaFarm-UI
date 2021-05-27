import {
  LIQUIDITY_POOL_PROGRAM_ID_V2,
  LIQUIDITY_POOL_PROGRAM_ID_V3,
  LIQUIDITY_POOL_PROGRAM_ID_V4,
  LIQUIDITY_POOL_PROGRAM_ID_V5,
  SERUM_PROGRAM_ID_V2,
  SERUM_PROGRAM_ID_V3
} from './ids'
import { LP_TOKENS, NATIVE_SOL, TOKENS, TokenInfo } from './tokens'

import { cloneDeep } from 'lodash-es'

export interface LiquidityPoolInfo {
  name: string
  coin: TokenInfo
  pc: TokenInfo
  lp: TokenInfo

  version: number
  programId: string

  ammId: string
  ammAuthority: string
  ammOpenOrders: string
  ammTargetOrders: string
  ammQuantities: string

  poolCoinTokenAccount: string
  poolPcTokenAccount: string
  poolWithdrawQueue: string
  poolTempLpTokenAccount: string

  serumProgramId: string
  serumMarket: string
  serumBids?: string
  serumAsks?: string
  serumEventQueue?: string
  serumCoinVaultAccount: string
  serumPcVaultAccount: string
  serumVaultSigner: string
}

/**
 * Get pool use two mint addresses

 * @param {string} coinMintAddress
 * @param {string} pcMintAddress

 * @returns {LiquidityPoolInfo | undefined} poolInfo
 */
export function getPoolByTokenMintAddresses(
  coinMintAddress: string,
  pcMintAddress: string
): LiquidityPoolInfo | undefined {
  const pool = LIQUIDITY_POOLS.find(
    (pool) =>
      (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
      (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
  )

  if (pool) {
    return cloneDeep(pool)
  }

  return pool
}

export function getLpMintByTokenMintAddresses(
  coinMintAddress: string,
  pcMintAddress: string,
  version = [3, 4, 5]
): string | null {
  // console.log(coinMintAddress, pcMintAddress)
  const pool = LIQUIDITY_POOLS.find(
    (pool) =>
      ((pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
        (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)) &&
      version.includes(pool.version)
  )

  if (pool) {
    return pool.lp.mintAddress
  }

  return null
}

export function canWrap(fromMintAddress: string, toMintAddress: string): boolean {
  return fromMintAddress === TOKENS.WUSDT.mintAddress && toMintAddress === TOKENS.USDT.mintAddress
}

export function getPoolByLpMintAddress(lpMintAddress: string): LiquidityPoolInfo | undefined {
  const pool = LIQUIDITY_POOLS.find((pool) => pool.lp.mintAddress === lpMintAddress)

  if (pool) {
    return cloneDeep(pool)
  }

  return pool
}

export function getAddressForWhat(address: string) {
  for (const pool of LIQUIDITY_POOLS) {
    for (const [key, value] of Object.entries(pool)) {
      if (key === 'lp') {
        if (value.mintAddress === address) {
          return { key: 'lpMintAddress', lpMintAddress: pool.lp.mintAddress, version: pool.version }
        }
      } else if (value === address) {
        return { key, lpMintAddress: pool.lp.mintAddress, version: pool.version }
      }
    }
  }

  return {}
}

export const LIQUIDITY_POOLS: LiquidityPoolInfo[] = [
  {
    name: 'FARMv1-USDT',
    coin: { ...TOKENS.FARMv1 },
    pc: { ...TOKENS.USDT },
    lp: { ...LP_TOKENS['FARMv1-USDT'] },

    version: 5,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V5,

    ammId: '7PGNXqdhrpQoVS5uQs9gjT1zfY6MUzEeYHopRnryj7rm',
    ammAuthority: 'BFCEvcoD1xY1HK4psbC5wYXVXEvmgwg4wKggk89u1NWw',
    ammOpenOrders: '3QaSNxMuA9zEXazLdD2oJq7jUCfShgtvdaepuq1uJFnS',
    ammTargetOrders: '2exvd2T7yFYhBpi67XSrCVChVwMu23g653ELEnjvv8uu',
    ammQuantities: 'BtwQvRXNudUrazbJNhazajSZXEXbrf51ddBrmnje27Li',
    poolCoinTokenAccount: '7ruSLu3QHNqviyN6tCPReCrDy6XTeZzR8chNRZShM7Zr',
    poolPcTokenAccount: 'Hnct2T3JmcNKNpBwRQcjBW298PqXFqhuBVbyey8fqy5m',
    poolWithdrawQueue: '4q3qXQsQSvzNE1fSyEh249vHGttKfQPJWM7A3AtffEX5',
    poolTempLpTokenAccount: '8i2cZ1UCAjVac6Z76GvQeRqZMKgMyuoZQeNSsjdtEgHG',
    serumProgramId: SERUM_PROGRAM_ID_V2,
    serumMarket: '5abZGhrELnUnfM9ZUnvK6XJPoBU5eShZwfFPkdhAC7o',
    serumCoinVaultAccount: 'Gwna45N1JGLmUMGhFVP1ELz8szVSajp12RgPqCbk46n7',
    serumPcVaultAccount: '8uqjWjNQiZvoieaGSoCRkGZExrqMpaYJL5huknCEHBcP',
    serumVaultSigner: '4fgnxw343cfYgcNgWvan8H6j6pNBskBmGX4XMbhxtFbi'
  },
  {
    name: 'FARMv1-USDC',
    coin: { ...TOKENS.FARMv1 },
    pc: { ...TOKENS.USDC },
    lp: { ...LP_TOKENS['FARMv1-USDC'] },

    version: 5,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V5,

    ammId: '7PGNXqdhrpQoVS5uQs9gjT1zfY6MUzEeYHopRnryj7rm',
    ammAuthority: 'BFCEvcoD1xY1HK4psbC5wYXVXEvmgwg4wKggk89u1NWw',
    ammOpenOrders: '3QaSNxMuA9zEXazLdD2oJq7jUCfShgtvdaepuq1uJFnS',
    ammTargetOrders: '2exvd2T7yFYhBpi67XSrCVChVwMu23g653ELEnjvv8uu',
    ammQuantities: 'BtwQvRXNudUrazbJNhazajSZXEXbrf51ddBrmnje27Li',
    poolCoinTokenAccount: '9B7Xr28yKY4JNdGbRGkTuKi1nov8p5z9BthQg2933cnC',
    poolPcTokenAccount: '3WYmCJ6bxnvEagwr1tuNbpEMEbgQjB8jMe5b3QQbDWBe',
    poolWithdrawQueue: '4q3qXQsQSvzNE1fSyEh249vHGttKfQPJWM7A3AtffEX5',
    poolTempLpTokenAccount: '8i2cZ1UCAjVac6Z76GvQeRqZMKgMyuoZQeNSsjdtEgHG',
    serumProgramId: SERUM_PROGRAM_ID_V2,
    serumMarket: '5abZGhrELnUnfM9ZUnvK6XJPoBU5eShZwfFPkdhAC7o',
    serumCoinVaultAccount: 'Gwna45N1JGLmUMGhFVP1ELz8szVSajp12RgPqCbk46n7',
    serumPcVaultAccount: '8uqjWjNQiZvoieaGSoCRkGZExrqMpaYJL5huknCEHBcP',
    serumVaultSigner: '4fgnxw343cfYgcNgWvan8H6j6pNBskBmGX4XMbhxtFbi'
  },
  {
    name: 'RAY-USDC',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.USDC },
    lp: { ...LP_TOKENS['RAY-USDC-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: '5NMFfbccSpLdre6anA8P8vVy35n2a52AJiNPpQn8tJnE',
    ammAuthority: 'Bjhs6Mrvxr34WAKLog2tiU77VMvwNZcrJ1g8UyGoic3e',
    ammOpenOrders: '3Xq4vBd5EWs45v9YwG1Mpfr8Xjng23pDovVUbnAaPce9',
    ammTargetOrders: '7ccgnj4dTuVTaQCwbECDc3GrKrQpuGNA4cETiSNo2cCN',
    ammQuantities: '6ifgXdNx8zKd4bseuya6FEKb49VWx1dDvVTC8f7kc361',
    poolCoinTokenAccount: 'DujWhSxnwqFd3TrLfScyUhJ3FdoaHrmoiVE6kU4ETQyL',
    poolPcTokenAccount: 'D6F5CDaLDCHHWfE8kMLbMNAFULXLfM572AGDx2a6KeXc',
    poolWithdrawQueue: '76QQPxNT422AL8w5RhssRFQ3gUGy7Y23YxV9BRWqs44Q',
    poolTempLpTokenAccount: '2Q9PevhtVioNFyFFrbkzcGxn1QmzFph5Cpdy1FKe3nYJ',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: '2xiv8A5xrJ7RnGdxXB42uFEkYHJjszEhaJyKKt4WaLep',
    serumCoinVaultAccount: 'GGcdamvNDYFhAXr93DWyJ8QmwawUHLCyRqWL3KngtLRa',
    serumPcVaultAccount: '22jHt5WmosAykp3LPGSAKgY45p7VGh4DFWSwp21SWBVe',
    serumVaultSigner: 'FmhXe9uG6zun49p222xt3nG1rBAkWvzVz7dxERQ6ouGw'
  },
  {
    name: 'RAY-SRM',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.SRM },
    lp: { ...LP_TOKENS['RAY-SRM-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'EGhB6FdyHtJPbPMRoBC8eeUVnVh2iRgnQ9HZBKAw46Uy',
    ammAuthority: '3gSVizZA2BFsWAfW4j1wBSQiQE9Xn3Ds518jPGve31se',
    ammOpenOrders: '6CVRtzecMaPZ1pdfT2ZzJ1qf89yuFsD7MKYGwvjYsy6w',
    ammTargetOrders: 'CZYbET8zweaWtWLnFJnt5nouCE9snQxFi7zrTCGYycL1',
    ammQuantities: '3NGwJe5bueAgLp6fMrY5HV2rpHF9xh3HhH97S6LrMLPo',
    poolCoinTokenAccount: 'Eg6sR9H28cFaek5DVdgxxDcRKKbS85XvCFEzzkdmYNhq',
    poolPcTokenAccount: '8g2nHtayS2JnRxaAY5ugsYC8CwiZutQrNWA9j2oH8UVM',
    poolWithdrawQueue: '7Yc1P9nyev1uoLtLJu15o5vQugvfXoHcde6x2mm1HeED',
    poolTempLpTokenAccount: '5WHmdyH7CgiezSGcD9PVMYth9hMEWETV1M64zmZ9UT5o',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'Cm4MmknScg7qbKqytb1mM92xgDxv3TNXos4tKbBqTDy7',
    serumCoinVaultAccount: '5QDTh4Bpz4wruWMfayMSjUxRgDvMzvS2ifkarhYtjS1B',
    serumPcVaultAccount: '76CofnHCvo5wEKtxNWfLa2jLDz4quwwSHFMne6BWWqx',
    serumVaultSigner: 'AorjCaSV1L6NGcaFZXEyUrmbSqY3GdB3YXbQnrh85v6F'
  },
  {
    name: 'RAY-SOL',
    coin: { ...TOKENS.RAY },
    pc: { ...NATIVE_SOL },
    lp: { ...LP_TOKENS['RAY-SOL-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: 'Fy6SnHwAkxoGMhUH2cLu2biqAnHmaAwFDDww9k6gq5ws',
    poolPcTokenAccount: 'GoRindEPofTJ3axsonTnbyf7cFwdFdG1A3MG9ENyBZsn',
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'RAY-ETH',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.ETH },
    lp: { ...LP_TOKENS['RAY-ETH-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'FrDSSYXGcrJc7ZwY5KMfTmzDfrzjvqdxmSinJFwxLr14',
    ammAuthority: '5Wbe7MYpw8y9iroZKVN8b3fLZNeBUbRKetQwULicDpw2',
    ammOpenOrders: 'ugyjEMZLumc1M5c7MNXayMYmxpnuMRYiT4aPwfNb6bq',
    ammTargetOrders: '2M6cT1GvGTiovTj7bRsZBeLMeJzjYoDTHNiTRVJqRFeM',
    ammQuantities: '5YcH7AwHNLdDJd2K6YmZAxqqvGYjgE59NaYAh3pkgVd7',
    poolCoinTokenAccount: 'ENjXaFNDiLTh44Gs89ZtfUH2i5MGLLkfYbSY7TmP4Du3',
    poolPcTokenAccount: '9uzWJD2WqJYSmB6UHSyPMskFGoP5L6hB7FxqUdYP4Esm',
    poolWithdrawQueue: 'BkrxkmYs1JViXbiBJfnwgns75CJd9yHcqUkFXB8Bz7oB',
    poolTempLpTokenAccount: 'CKZ7NMunTef18yKHuizRoNZedzTdDEFwYRUgB3dFDcrd',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: '6jx6aoNFbmorwyncVP5V5ESKfuFc9oUYebob1iF6tgN4',
    serumCoinVaultAccount: 'EVVtYo4AeCbmn2dYS1UnhtfjpzCXCcN26G1HmuHwMo7w',
    serumPcVaultAccount: '6ZT6KwvjLnJLpFdVfiRD9ifVUo4gv4MUie7VvPTuk69v',
    serumVaultSigner: 'HXbRDLcX2FyqWJY95apnsTgBoRHyp7SWYXcMYod6EBrQ'
  },
  {
    name: 'FIDA-RAY',
    coin: { ...TOKENS.FIDA },
    pc: { ...TOKENS.RAY },
    lp: { ...LP_TOKENS['FIDA-RAY-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'FrDSSYXGcrJc7ZwY5KMfTmzDfrzjvqdxmSinJFwxLr14',
    ammAuthority: '5Wbe7MYpw8y9iroZKVN8b3fLZNeBUbRKetQwULicDpw2',
    ammOpenOrders: 'ugyjEMZLumc1M5c7MNXayMYmxpnuMRYiT4aPwfNb6bq',
    ammTargetOrders: '2M6cT1GvGTiovTj7bRsZBeLMeJzjYoDTHNiTRVJqRFeM',
    ammQuantities: '5YcH7AwHNLdDJd2K6YmZAxqqvGYjgE59NaYAh3pkgVd7',
    poolCoinTokenAccount: '6YeEo7ZTRHotXd89JTBJKRXERBjv3N3ofgsgJ4FoAa39',//1
    poolPcTokenAccount: 'DDNURcWy3CU3CpkCnDoGXwQAeCg1mp2CC8WqvwHp5Fdt',//1
    poolWithdrawQueue: 'BkrxkmYs1JViXbiBJfnwgns75CJd9yHcqUkFXB8Bz7oB',
    poolTempLpTokenAccount: 'CKZ7NMunTef18yKHuizRoNZedzTdDEFwYRUgB3dFDcrd',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: '6jx6aoNFbmorwyncVP5V5ESKfuFc9oUYebob1iF6tgN4',
    serumCoinVaultAccount: 'EVVtYo4AeCbmn2dYS1UnhtfjpzCXCcN26G1HmuHwMo7w',
    serumPcVaultAccount: '6ZT6KwvjLnJLpFdVfiRD9ifVUo4gv4MUie7VvPTuk69v',
    serumVaultSigner: 'HXbRDLcX2FyqWJY95apnsTgBoRHyp7SWYXcMYod6EBrQ'
  },
  {
    name: 'OXY-RAY',
    coin: { ...TOKENS.OXY },
    pc: { ...TOKENS.RAY },
    lp: { ...LP_TOKENS['OXY-RAY-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'FrDSSYXGcrJc7ZwY5KMfTmzDfrzjvqdxmSinJFwxLr14',
    ammAuthority: '5Wbe7MYpw8y9iroZKVN8b3fLZNeBUbRKetQwULicDpw2',
    ammOpenOrders: 'ugyjEMZLumc1M5c7MNXayMYmxpnuMRYiT4aPwfNb6bq',
    ammTargetOrders: '2M6cT1GvGTiovTj7bRsZBeLMeJzjYoDTHNiTRVJqRFeM',
    ammQuantities: '5YcH7AwHNLdDJd2K6YmZAxqqvGYjgE59NaYAh3pkgVd7',
    poolCoinTokenAccount: '6ttf7G7FR9GWqxiyCLFNaBTvwYzTLPdbbrNcRvShaqtS',//1
    poolPcTokenAccount: '8orrvb6rHB776KbQmszcxPH44cZHdCTYC1fr2a3oHufC',//1
    poolWithdrawQueue: 'BkrxkmYs1JViXbiBJfnwgns75CJd9yHcqUkFXB8Bz7oB',
    poolTempLpTokenAccount: 'CKZ7NMunTef18yKHuizRoNZedzTdDEFwYRUgB3dFDcrd',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: '6jx6aoNFbmorwyncVP5V5ESKfuFc9oUYebob1iF6tgN4',
    serumCoinVaultAccount: 'EVVtYo4AeCbmn2dYS1UnhtfjpzCXCcN26G1HmuHwMo7w',
    serumPcVaultAccount: '6ZT6KwvjLnJLpFdVfiRD9ifVUo4gv4MUie7VvPTuk69v',
    serumVaultSigner: 'HXbRDLcX2FyqWJY95apnsTgBoRHyp7SWYXcMYod6EBrQ'
  },  
  {
    name: 'USDT',
    coin: { ...TOKENS.USDT },
    pc: { ...TOKENS.USDT },
    lp: { ...LP_TOKENS['USDT-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '7yaKM46EPRJd2WDTL3nrL6Am5mtpeDLTfW11hh3LVKgs', //1
    poolPcTokenAccount: '7yaKM46EPRJd2WDTL3nrL6Am5mtpeDLTfW11hh3LVKgs',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'FARMv1',
    coin: { ...TOKENS.FARMv1 },
    pc: { ...TOKENS.FARMv1 },
    lp: { ...LP_TOKENS['FARMv1-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: 'GyZgNmM7NJkGrLW1Y1n1RS5ortMvovN2UZV6omfDeTYv', //1
    poolPcTokenAccount: 'GyZgNmM7NJkGrLW1Y1n1RS5ortMvovN2UZV6omfDeTYv',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'SRM',
    coin: { ...TOKENS.SRM },
    pc: { ...TOKENS.SRM },
    lp: { ...LP_TOKENS['SRM-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: 'Bjd9djUUpxfGK51ucCCbTRNe447aDu4qV7HEDugWme5', //1
    poolPcTokenAccount: 'Bjd9djUUpxfGK51ucCCbTRNe447aDu4qV7HEDugWme5',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'RAY',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.RAY },
    lp: { ...LP_TOKENS['RAY-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '2VswcP8SYvbvtLDkV4s9Yk6z7rGBcmnnPvsAJpgiLZru', //1
    poolPcTokenAccount: '2VswcP8SYvbvtLDkV4s9Yk6z7rGBcmnnPvsAJpgiLZru',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'MEDIA',
    coin: { ...TOKENS.MEDIA },
    pc: { ...TOKENS.MEDIA },
    lp: { ...LP_TOKENS['MEDIA-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '3qsKpLyyy3n9wqTUe1qkpMzSB3cMQ6smxfL3jBmapDYv', //1
    poolPcTokenAccount: '3qsKpLyyy3n9wqTUe1qkpMzSB3cMQ6smxfL3jBmapDYv',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'STEP',
    coin: { ...TOKENS.STEP },
    pc: { ...TOKENS.STEP },
    lp: { ...LP_TOKENS['STEP-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '3VoHGvZEr23nkdEiiWETgAh27GGxLvoDv5mJYeH6ZGWa', //1
    poolPcTokenAccount: '3VoHGvZEr23nkdEiiWETgAh27GGxLvoDv5mJYeH6ZGWa',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'ETH',
    coin: { ...TOKENS.ETH },
    pc: { ...TOKENS.ETH },
    lp: { ...LP_TOKENS['ETH-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: 'Fe76TrRS8qcJhVH3RkT99v9MqngehFFSMP9Xf9ZBaxwx', //1
    poolPcTokenAccount: 'Fe76TrRS8qcJhVH3RkT99v9MqngehFFSMP9Xf9ZBaxwx',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'BTC',
    coin: { ...TOKENS.BTC },
    pc: { ...TOKENS.BTC },
    lp: { ...LP_TOKENS['BTC-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '2bjwTReuxWejrBcJf83fTPdCAdHBgesm1vbLbzqVbZNC', //1
    poolPcTokenAccount: '2bjwTReuxWejrBcJf83fTPdCAdHBgesm1vbLbzqVbZNC',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'UNI',
    coin: { ...TOKENS.UNI },
    pc: { ...TOKENS.UNI },
    lp: { ...LP_TOKENS['UNI-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '2PynqbTjSok5Y1xVyoUaYGnKppxCdMZHa9Wy2jzf5RcQ', //1
    poolPcTokenAccount: '2PynqbTjSok5Y1xVyoUaYGnKppxCdMZHa9Wy2jzf5RcQ',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
  {
    name: 'SUSHI',
    coin: { ...TOKENS.SUSHI },
    pc: { ...TOKENS.SUSHI },
    lp: { ...LP_TOKENS['SUSHI-V3'] },

    version: 3,
    programId: LIQUIDITY_POOL_PROGRAM_ID_V3,

    ammId: 'HeRUVkQyPuJAPFXUkTaJaWzimBopWbJ54q5DCMuPpBY4',
    ammAuthority: '63Cw8omVwSQGDPP5nff3a9DakvL8ruaqqEpbQ4uDwPYf',
    ammOpenOrders: 'JQEY8R9frhxuvcsewGfgkCVdGWztpHLx4P9zmTAsZFM',
    ammTargetOrders: '7mdd7oqHqULV1Yxaaf5GW52FKFbJz78sZj9ePcfmL5Fi',
    ammQuantities: 'HHU2THd3tocaYagZh826KCvLDv7QNWLGKjaJKmtdtTQM',
    poolCoinTokenAccount: '4B13ChfNDQAErsXcVhNwwdMx5KSztUcsMXJvWmvdwAZz', //1
    poolPcTokenAccount: '4B13ChfNDQAErsXcVhNwwdMx5KSztUcsMXJvWmvdwAZz',//1
    poolWithdrawQueue: '3bUwc23vXP9L6XBjVCvG9Mruuu7GRkcfmyXuaH6HdmW2',
    poolTempLpTokenAccount: '9dALTRnKoLmfMn3hPyQoizmSJ5CZSLMLdJy1XMocwXMU',
    serumProgramId: SERUM_PROGRAM_ID_V3,
    serumMarket: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    serumCoinVaultAccount: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    serumPcVaultAccount: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    serumVaultSigner: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd'
  },
]
