import { bool, publicKey, struct, u32, u64, u8 } from '@project-serum/borsh'

// https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js#L210
export const ACCOUNT_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
])

export const MINT_LAYOUT = struct([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('initialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
])

export const STAKE_USER_V6_LAYOUT = struct([
  u8('isInitialized'),
  u64('amount'), 
  u64('reward_debt')
])


/**
 * @private
 */
export const TokenFarmLayout = struct(
  [
    u8('isInitialized'), 
    u8('nonce'),
    publicKey('tokenProgramId'),
    publicKey('farmMint'), 
    publicKey('poolFarmAddress'),
    publicKey('lpMint'),
    publicKey('poolLpAddress'),
    publicKey('poolFeeLpAddress'),
    u64('tradeFeeNumerator'),
    u64('tradeFeeDenominator'),
    u64('ownerTradeFeeNumerator'),
    u64('ownerTradeFeeDenominator'),
    u64('ownerWithdrawFeeNumerator'),
    u64('ownerWithdrawFeeDenominator'),
    u64('hostFeeNumerator'),
    u64('hostFeeDenominator'),
    u64('lastUpdate'),
    u64('rewardPerSecond'),
    u64('rewardPerShare'),
    u64('totalSupply'),
    publicKey('owner'),
  ],
);

/**
 * @private
 */
export const ClockLayout = struct(
  [
    u64('slot'),
    u64('epochStartTimestamp'),
    u64('epoch'),
    u64("leaderScheduleEpoch"),
    u64("unixTimestamp"),
  ],
);