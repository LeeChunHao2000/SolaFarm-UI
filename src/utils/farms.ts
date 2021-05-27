import { LP_TOKENS, TOKENS, TokenInfo } from '@/utils/tokens'

import { STAKE_PROGRAM_ID, STAKE_PROGRAM_ID_V4, STAKE_PROGRAM_ID_V5, STAKE_PROGRAM_ID_V6 } from '@/utils/ids'
import { cloneDeep } from 'lodash-es'

export interface FarmInfo {
  name: string
  lp: TokenInfo
  reward: TokenInfo
  rewardB?: TokenInfo
  isStake: boolean

  fusion: boolean
  legacy: boolean
  dual: boolean
  version: number
  poolType: string
  programId: string

  poolId: string
  poolAuthority: string

  poolLpTokenAccount: string
  poolRewardTokenAccount: string
  poolRewardTokenAccountB?: string
  poolFreeAccount?: string

  user?: object
}

export const a = "";

export function getFarmByLpMintAddress(lpMintAddress: string): FarmInfo | undefined {
  const farm = FARMS.find((farm) => farm.lp.mintAddress === lpMintAddress)

  if (farm) {
    return cloneDeep(farm)
  }

  return farm
}

export function getFarmByRewardMintAddress(lpMintAddress: string): FarmInfo | undefined {
  const farm = FARMS.find((farm) => farm.reward.mintAddress === lpMintAddress)

  if (farm) {
    return cloneDeep(farm)
  }

  return farm
}

export function getFarmByPoolId(poolId: string): FarmInfo | undefined {
  const farm = FARMS.find((farm) => farm.poolId === poolId)

  if (farm) {
    return cloneDeep(farm)
  }

  return farm
}

export function getAddressForWhat(address: string) {
  if (address == "3H3ZKy5cC8SRVeNjqMDF2k5qdUrsbaZJGfKBYy4rw5Ri") {
    return { key: "poolLpTokenAccount", poolId: "" }
  }
  // dont use forEach
  for (const farm of FARMS) {
    for (const [key, value] of Object.entries(farm)) {
      if (value === address) {
        return { key, poolId: farm.poolId }
      }
    }
  }

  return {}
}

export const FARMS: FarmInfo[] = [
  {
    name: 'FARMv1',
    lp: { ...LP_TOKENS['FARMv1-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'DeUof4egyMKFTuY6c8wGxuBAXyWE7m5F2mA6Hn8Z6C8k',
    poolAuthority: '8U8UjmtSqqfwRJpdaskuVw2x31BqDU2YxJbSQ4pKaUa7',
    poolLpTokenAccount: 'GyZgNmM7NJkGrLW1Y1n1RS5ortMvovN2UZV6omfDeTYv', // lp vault
    poolRewardTokenAccount: 'Fc4REzJLBZhXb8WvbXsYi1R3EdpQMDL1JhAgr26f4too', // reward vault
    poolFreeAccount: 'GwYpmpd75WGjD2BFWbUWd9sxH35YYpdmw5kcdZviX6mc'
  },
  {
    name: 'FARMv1-USDC',
    lp: { ...LP_TOKENS['FARMv1-USDC-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: '2d9SYw9ierzrB97tWT82tY8vSwowf7J6dtpuQLus4TUv',
    poolAuthority: 'EW2Q48UbDP8nGF8Kdy1YhhV8PhWqfa7Ph5JhFkBPWwj4',
    poolLpTokenAccount: 'i6AWc6a2m444ztreYxc9uBY5egszbnmeG2hWjAQQshV', // lp vault
    poolRewardTokenAccount: '4LW1j8RE3Vw5sLAKW4DHspucGuguz8iwWSdvg6UktF3W', // reward vault
    poolFreeAccount: '58pdNxaVUfRnmrqai65kqy6U8pSBhDFxfF3SQBtAg1m1'
  },
  {
    name: 'BTC',
    lp: { ...LP_TOKENS['BTC-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'DkverXzcfDe6wA4Paei2vWvipNcSY6LHegNDmhgt9Uib',
    poolAuthority: '9y9FBo8CwcLZGFduUmGUAW8TFE8sLor54kDeXCyWKmsq',
    poolLpTokenAccount: '2bjwTReuxWejrBcJf83fTPdCAdHBgesm1vbLbzqVbZNC', // lp vault
    poolRewardTokenAccount: 'AVApP92cgtgwUuESeyUCTq6vUKq32298tD6sTePw61rr', // reward vault
    poolFreeAccount: 'AT6iapDHeMEiPsnyNV8V9AoTwDZkYvxut4hwoPAaEGaf'
  },
  {
    name: 'ETH',
    lp: { ...LP_TOKENS['ETH-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'BLsYwQhsFj6ZsimACFL1qNbBskhKdxZp8cLQ7BDLUUrP',
    poolAuthority: 'AbyvPnTrW7nNCLgABifshcU1DnUrVCQP2bgqBCFxfW4U',
    poolLpTokenAccount: 'Fe76TrRS8qcJhVH3RkT99v9MqngehFFSMP9Xf9ZBaxwx', // lp vault
    poolRewardTokenAccount: 'E6PJasN54spYsdXLEvbQc8W1yyQtjos1jM1KXqrgEjdA', // reward vault
    poolFreeAccount: '5EGfsUQZGrWkRLJhwVUEZRvwkDzBeY36tB9nZu3xXAcL'
  },
  {
    name: 'USDT',
    lp: { ...LP_TOKENS['USDT-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: '4YAUE4x6L2aPeX4HZNZ5oD12nBqUekjba28pkaVMCvZr',
    poolAuthority: '7bXy9pN58nj7wxp6pobi1VhtVaGQ5p3PHb3w5XCCu9Y2',
    poolLpTokenAccount: '7yaKM46EPRJd2WDTL3nrL6Am5mtpeDLTfW11hh3LVKgs', // lp vault
    poolRewardTokenAccount: '35WdLkn7wCwoAT72Aa29QAqMEeLQRyAzfzcivrJqUuLW', // reward vault
    poolFreeAccount: 'E1Ugkcs89J6WiiTFHdh72wvgJSuzPwbLPkiQTMXK8BUP'
  },
  {
    name: 'UNI',
    lp: { ...LP_TOKENS['UNI-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'GrQuBqLRjjGpSHWWZX8vuG1PjNMLGVBDjjire3CQs59k',
    poolAuthority: 'CKPxRVw1Cgt6X1C72XqeQL2d75eAmJ1xP4GfkvHDpDYs',
    poolLpTokenAccount: '2PynqbTjSok5Y1xVyoUaYGnKppxCdMZHa9Wy2jzf5RcQ', // lp vault
    poolRewardTokenAccount: 'zmHakeK5yGzuWjRxUwfUcqBvy5r8N7JZ59cteerJEvW', // reward vault
    poolFreeAccount: 'FdpMXxdg6Uf4Ded6mLs99Hgt9xnGRob4kgEiACnh2hPb'
  },
  {
    name: 'SUSHI',
    lp: { ...LP_TOKENS['SUSHI-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'FikZeo3LeRZRprKz6rZihC2b4rLrUR3krvXAGqd76vUW',
    poolAuthority: '9FaBoP6nh1S9KtAoBWnZmGGBTp83jEosfFGbdRi2VLjH',
    poolLpTokenAccount: '4B13ChfNDQAErsXcVhNwwdMx5KSztUcsMXJvWmvdwAZz', // lp vault
    poolRewardTokenAccount: 'SGd5FTxrw6P72dEA7vEJMD5ACK5hz8TxEfZYedjKbHC', // reward vault
    poolFreeAccount: '8i4UsSZBr46YGRxREkFbEWvxemcxgTLWnD3y3uERWCp3'
  },
  {
    name: 'RAY',
    lp: { ...LP_TOKENS['RAY-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'YBvNzM7Z7Htq7kzi7hd4pa8qFTNqcB41y7BYg4xC3Kc',
    poolAuthority: 'FB5zu8vFPVMZZXRMHMvh1WerkZXT7kp6zLigvb4rvnNG',
    poolLpTokenAccount: '2VswcP8SYvbvtLDkV4s9Yk6z7rGBcmnnPvsAJpgiLZru', // lp vault
    poolRewardTokenAccount: 'EDFtiWzoD7FXqQn4w4wceMp2SV9qdXEBZkSJ2cQTXpoP', // reward vault
    poolFreeAccount: '5gzzCuVYRQhkFZfCzCXU94bqwJGktYCmRvuXZUydBoWy'
  },
  {
    name: 'MEDIA',
    lp: { ...LP_TOKENS['MEDIA-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'sp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'DGjp52Jy5XqNWR1e98sJ6Fe8wsvNPX2P6MaasMWovZ2h',
    poolAuthority: '6znT2bHcqKPBjRSK5Zc31D2HKrJnadXqoP5o5WxjzUZy',
    poolLpTokenAccount: '3qsKpLyyy3n9wqTUe1qkpMzSB3cMQ6smxfL3jBmapDYv', // lp vault
    poolRewardTokenAccount: '12wZPDyemYWxA3EZvsioSEvdF6ShRW24JrsUNq7SVgd5', // reward vault
    poolFreeAccount: 'Af3qh2NjprnsKU6Xm5BXFu4nH4MWjTc2qw5a4UrjhFCB'
  },
  {
    name: 'RAY-USDC',
    lp: { ...LP_TOKENS['RAY-USDC-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'pXfsy11ytwULC2dQ2Xgi8Xtegoo35Le9wg6U8fjzBxw',
    poolAuthority: 'EnWAcueZBPhZDNtXMZtrdgmnPgYs4bD3sWKx2LS3aEGD',
    poolLpTokenAccount: 'FhKtNKvCaqcDQ2kXagSZmeehjjKVupckbxu1uxsenhtP', // lp vault
    poolRewardTokenAccount: '4xvNuubchY9PSjfS6ffd74NtTgcjfJdo7ATqzzhin5WE', // reward vault
    poolFreeAccount: '33Q9CxjM5uuAbu4iVt3XNr532TizZjpih3wNepPKWTwd'
  },
  {
    name: 'RAY-SRM',
    lp: { ...LP_TOKENS['RAY-SRM-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: '5qU2fCEnA3Dga9Tgpev8LX5BF2Y6KXW8yJ7pK7qfPoXn',
    poolAuthority: 'D3iy2g3qbz6agwXcwzwpnoowwWURP2uncyuweGQXTCA1',
    poolLpTokenAccount: 'EbwXC9WuAY6LHxpEsiTdGJdRKNFZtdcGad9TRFeTP36m', // lp vault
    poolRewardTokenAccount: 'HNSDkADezSGXbnWE6Hom32pgkKyoQrsajvKSsXTugiVc', // reward vault
    poolFreeAccount: 'D3wbJxRq5TLTe8iwpavUatqxjdeWcXiJNeHaSoqsXfbq'
  },
  {
    name: 'RAY-SOL',
    lp: { ...LP_TOKENS['RAY-SOL-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: '72DQyCA3njaUk9khjNtch1LaECeJSHMfXWDmNvxCkHc4',
    poolAuthority: 'B2M6CihH7X5G72ghkAQhnHxsnuneB51VFyH2cbGv61Sb',
    poolLpTokenAccount: 'AiwMPBSDwtX97jQE5TQfXMJUpE4jwEW44xoi1G9ETwmy', // lp vault
    poolRewardTokenAccount: 'FU6Jy7dDiYterexYJwsRBCyKnagwqfBE75jivScfTeAX', // reward vault
    poolFreeAccount: '7gmXivaQGm7cSQ5sjcFze2MKMHVyscgij5xQ1YpRqNS9'
  },
  {
    name: 'RAY-ETH',
    lp: { ...LP_TOKENS['RAY-ETH-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'E5fEVTHbYdPA3ybHWpK4VcJuBkRosbUnqXkp9Qco8fid',
    poolAuthority: '9wzpshRjJ4afzZq3En2pPQubhjG9eYBueTMRVgk3t3hP',
    poolLpTokenAccount: '2JWEXfTGcyqa8NcKTkGKaEL6XV5vobLCba8RTn7nCvm6', // lp vault
    poolRewardTokenAccount: '6t2tNMG8TgTDFtyta2PpqF7FsHrgSM4Ls592C5RsMnnu', // reward vault
    poolFreeAccount: 'BMUVxwbPvCWdNYyTcPD2hRbCMoQY34QZtv18QX66m3Rv'
  },
  {
    name: 'FIDA-RAY',
    lp: { ...LP_TOKENS['FIDA-RAY-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'Cobif15fe9Z7QvgvDxg64MXMLEaKj5estnxqpXk5daZY',
    poolAuthority: 'AnQa5Bqut47rzsmBQaXWF29irzURZBCkmTQcKtc6LtAS',
    poolLpTokenAccount: 'DUr2v8J49BX1gdW73tUqcJ73XUgrjt2fhwabSGhwksL6', // lp vault
    poolRewardTokenAccount: '66Mvi9vV4YWqRfo39MeiGAwsc5JRAcazuDHhrBL1xQXC', // reward vault
    poolFreeAccount: 'J5kjbdzBpAmseNHirskBw1Fg9Uj4eyVK8PLzVH4ZENLB'
  },
  {
    name: 'OXY-RAY',
    lp: { ...LP_TOKENS['OXY-RAY-V3'] },
    reward: { ...TOKENS.FARMv1 },
    isStake: false,

    fusion: false,
    legacy: false,
    dual: false,
    version: 3,
    poolType: 'lp',
    programId: STAKE_PROGRAM_ID_V6,

    poolId: 'CukVxMyWWqktrm5m48x9CswVDzKrpbB7azJaKEnjMjMk',
    poolAuthority: '2pz2sx6bTkR4q3iG13cBH2f4BM91rbscSJwJLxTUPwT4',
    poolLpTokenAccount: '85P9P8rScMVnk1JZd6erXgv2LPgWvYNMoURLnpXLaehn', // lp vault
    poolRewardTokenAccount: '9zeVmWWXM2g87c4w4Gzn81zzeeAhbRawSwfFN2FR1bZ2', // reward vault
    poolFreeAccount: 'Fkq5HTJWkY8tRTiEmF5pveffotdATV1gYxLBu6hoasUg'
  },
]