import { Account, Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction, TransactionInstruction } from '@solana/web3.js'
import { createAssociatedTokenAccountByFeeIfNotExist, createProgramAccountIfNotExist, createProgramAccountByLenIfNotExist, createTokenAccountIfNotExist, sendTransaction, sendTransactionWithAccount } from '@/utils/web3'
// @ts-ignore
import { nu64, struct, u8, blob, union } from 'buffer-layout'
import { publicKey, u128, u64 } from '@project-serum/borsh'

import { FarmInfo, a } from '@/utils/farms'
import { TOKEN_PROGRAM_ID, b, STAKE_PROGRAM_ID_V6 } from '@/utils/ids'
import { TokenAmount, c } from '@/utils/safe-math'
import { transfer } from '@project-serum/serum/lib/token-instructions'
// deposit
export async function deposit(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey
  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  // if no userinfo account, create new one
  const programId = new PublicKey(farmInfo.programId)
  const userInfoAccount = await createProgramAccountIfNotExist(
    connection,
    infoAccount,
    owner,
    programId,
    null,
    USER_STAKE_INFO_ACCOUNT_LAYOUT,
    transaction,
    signers
  )
  const feepubkey = new PublicKey("3H3ZKy5cC8SRVeNjqMDF2k5qdUrsbaZJGfKBYy4rw5Ri");
  const feeAccount = await createAssociatedTokenAccountByFeeIfNotExist(
    connection,
    owner, // fee address
    new PublicKey(farmInfo.lp.mintAddress),// mint address
    feepubkey, // owner
    transaction
  )

  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()
  const val = value * 0.998;
  const fee = value - val;

  transaction.add(
    tokenTransfer(
      new PublicKey(farmInfo.lp.mintAddress),
      owner,
      new PublicKey(lpAccount),
      feeAccount,
      TOKEN_PROGRAM_ID,
      Number(fee.toFixed(0)),
      farmInfo.lp.decimals
    )
  ).add(
    depositInstruction(
      programId,
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      userInfoAccount,
      wallet.publicKey,
      new PublicKey(lpAccount),
      new PublicKey(farmInfo.poolLpTokenAccount),
      userRewardTokenAccount,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      Number(val.toFixed(0))
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers);
}



// deposit
export async function depositV6(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  const programId = new PublicKey(farmInfo.programId)
  const userInfoAccount = await createProgramAccountByLenIfNotExist(
    connection,
    new PublicKey(farmInfo.poolId),
    owner,
    programId,
    null,
    324,
    transaction,
    signers
  );
  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()
  const userTransferAuthority = new Account();
  transaction.add(
    createApproveInstruction(
      TOKEN_PROGRAM_ID,
      new PublicKey(lpAccount),
      userTransferAuthority.publicKey,
      owner,
      [],
      value,
    ),
  ).add(
    depositV6Instruction(
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      new PublicKey(lpAccount),
      userRewardTokenAccount,
      userInfoAccount,
      new PublicKey(farmInfo.poolLpTokenAccount),
      userTransferAuthority.publicKey,
      TOKEN_PROGRAM_ID,
      new PublicKey(farmInfo.programId),
      new PublicKey(farmInfo.poolRewardTokenAccount),
      // @ts-ignore
      new PublicKey(farmInfo.poolFreeAccount),
      value
    )
  )
  signers.push(userTransferAuthority);
  return await sendTransaction(connection, wallet, transaction, signers);
}

export function createApproveInstruction(
  programId: PublicKey,
  account: PublicKey,
  delegate: PublicKey,
  owner: PublicKey,
  multiSigners: Array<Account>,
  amount: number | nu64,
): TransactionInstruction {
  const dataLayout = struct([
    u8('instruction'),
    nu64('amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 4, // Approve instruction
      amount: amount,
    },
    data,
  );

  let keys = [
    { pubkey: account, isSigner: false, isWritable: true },
    { pubkey: delegate, isSigner: false, isWritable: false },
  ];
  if (multiSigners.length === 0) {
    keys.push({ pubkey: owner, isSigner: true, isWritable: false });
  } else {
    keys.push({ pubkey: owner, isSigner: false, isWritable: false });
    multiSigners.forEach(signer =>
      keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      }),
    );
  }

  return new TransactionInstruction({
    keys,
    programId: programId,
    data,
  });
}

// depositV6
export function depositV6Instruction(
  farm_info: PublicKey,
  authority_info: PublicKey,
  user_lp_address: PublicKey,
  user_farm_address: PublicKey,
  user_info: PublicKey,
  pool_lp_address: PublicKey,
  user_transfer_authority_info: PublicKey,
  tokenProgramId: PublicKey,
  farmProgramId: PublicKey,
  pool_farm_address: PublicKey,
  pool_fee_lp_account: PublicKey,
  amount: number,
): TransactionInstruction {
  let clock = new PublicKey('SysvarC1ock11111111111111111111111111111111');
  const keys = [
    { pubkey: farm_info, isSigner: false, isWritable: true },
    { pubkey: authority_info, isSigner: false, isWritable: true },
    { pubkey: user_info, isSigner: false, isWritable: true },
    { pubkey: user_farm_address, isSigner: false, isWritable: true },
    { pubkey: user_lp_address, isSigner: false, isWritable: true },
    { pubkey: pool_lp_address, isSigner: false, isWritable: true },
    { pubkey: user_transfer_authority_info, isSigner: true, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: pool_farm_address, isSigner: false, isWritable: true },
    { pubkey: clock, isSigner: false, isWritable: false },
    { pubkey: pool_fee_lp_account, isSigner: false, isWritable: true },
  ];
  const commandDataLayout = struct([
    u8('instruction'),
    nu64('amount'),
  ]);
  let data = Buffer.alloc(1024);
  {
    const encodeLength = commandDataLayout.encode(
      {
        instruction: 7, // Deposit instruction
        amount,
      },
      data,
    );
    data = data.slice(0, encodeLength);
  }
  return new TransactionInstruction({
    keys,
    programId: farmProgramId,
    data,
  });
}


export async function rewardFarm(
  connection: Connection,
  wallet: any | undefined | null,
  amount: string | undefined | null
) {
  return
}

/**
  * Construct a Transfer instruction
  *
  * @param owner Owner of the source token account
  * @param source Source token account
  * @param destination Destination token account
  * @param amount Number of tokens to transfer
  */
export function transferInstruction(
  owner: PublicKey,
  source: PublicKey,
  destination: PublicKey,
  amount: number,
): TransactionInstruction {
  const dataLayout = struct([
    u8('instruction'),
    nu64('amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 3, // Transfer instruction
      amount: amount,
    },
    data,
  );

  const keys = [
    { pubkey: source, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: false },
  ];
  return new TransactionInstruction({
    keys,
    programId: TOKEN_PROGRAM_ID,
    data,
  });
}

// depositV4
export async function depositV4(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  rewardAccountB: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  // if no account, create new one
  const userRewardTokenAccountB = await createTokenAccountIfNotExist(
    connection,
    rewardAccountB,
    owner,
    // @ts-ignore
    farmInfo.rewardB.mintAddress,
    null,
    transaction,
    signers
  )

  // if no userinfo account, create new one
  const programId = new PublicKey(farmInfo.programId)
  const userInfoAccount = await createProgramAccountIfNotExist(
    connection,
    infoAccount,
    owner,
    programId,
    null,
    USER_STAKE_INFO_ACCOUNT_LAYOUT_V4,
    transaction,
    signers
  )

  const feepubkey = new PublicKey("3H3ZKy5cC8SRVeNjqMDF2k5qdUrsbaZJGfKBYy4rw5Ri");
  const feeAccount = await createAssociatedTokenAccountByFeeIfNotExist(
    connection,
    owner, // fee address
    new PublicKey(farmInfo.lp.mintAddress),// mint address
    feepubkey, // owner
    transaction
  )

  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()
  const val = value * 0.998;
  const fee = value - val;

  transaction.add(
    tokenTransfer(
      new PublicKey(farmInfo.lp.mintAddress),
      owner,
      new PublicKey(lpAccount),
      feeAccount,
      TOKEN_PROGRAM_ID,
      Number(fee.toFixed(0)),
      farmInfo.lp.decimals
    )
  ).add(
    depositInstructionV4(
      programId,
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      userInfoAccount,
      wallet.publicKey,
      new PublicKey(lpAccount),
      new PublicKey(farmInfo.poolLpTokenAccount),
      userRewardTokenAccount,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      userRewardTokenAccountB,
      // @ts-ignore
      new PublicKey(farmInfo.poolRewardTokenAccountB),
      value
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

// withdraw
export async function withdraw(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount || !infoAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  const programId = new PublicKey(farmInfo.programId)
  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()

  transaction.add(
    withdrawInstruction(
      programId,
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      new PublicKey(infoAccount),
      wallet.publicKey,
      new PublicKey(lpAccount),
      new PublicKey(farmInfo.poolLpTokenAccount),
      userRewardTokenAccount,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      value
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}



// withdraw
export async function withdrawV6(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  const programId = new PublicKey(farmInfo.programId)
  let userInfoAccount = await createProgramAccountByLenIfNotExist(
    connection,
    new PublicKey(farmInfo.poolId),
    owner,
    programId,
    null,
    324,
    transaction,
    signers
  );
  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()

  transaction.add(
    withdrawInstructionV6(
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      new PublicKey(lpAccount),
      userRewardTokenAccount,
      userInfoAccount,
      new PublicKey(farmInfo.poolLpTokenAccount),
      TOKEN_PROGRAM_ID,
      programId,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      // @ts-ignore
      new PublicKey(farmInfo.poolFreeAccount),
      value
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

// withdrawV4
export async function withdrawV4(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  rewardAccountB: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount || !infoAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  // if no account, create new one
  const userRewardTokenAccountB = await createTokenAccountIfNotExist(
    connection,
    rewardAccountB,
    owner,
    // @ts-ignore
    farmInfo.rewardB.mintAddress,
    null,
    transaction,
    signers
  )

  const programId = new PublicKey(farmInfo.programId)
  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()

  transaction.add(
    withdrawInstructionV4(
      programId,
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      new PublicKey(infoAccount),
      wallet.publicKey,
      new PublicKey(lpAccount),
      new PublicKey(farmInfo.poolLpTokenAccount),
      userRewardTokenAccount,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      userRewardTokenAccountB,
      // @ts-ignore
      new PublicKey(farmInfo.poolRewardTokenAccountB),
      value
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

export function depositInstruction(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 1,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}


const LAYOUT = union(u8('instruction'));
LAYOUT.addVariant(
  0,
  struct([
    u8('decimals'),
    blob(32, 'mintAuthority'),
    u8('freezeAuthorityOption'),
    blob(32, 'freezeAuthority'),
  ]),
  'initializeMint',
);
LAYOUT.addVariant(1, struct([]), 'initializeAccount');
LAYOUT.addVariant(
  7,
  struct([nu64('amount')]),
  'mintTo',
);
LAYOUT.addVariant(
  8,
  struct([nu64('amount')]),
  'burn',
);
LAYOUT.addVariant(9, struct([]), 'closeAccount');
LAYOUT.addVariant(
  12,
  struct([nu64('amount'), u8('decimals')]),
  'transferChecked',
);

const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r: any) => r.span),
);

function encodeTokenInstructionData(instruction: unknown) {
  const b = Buffer.alloc(instructionMaxSpan);
  const span = LAYOUT.encode(instruction, b);
  return b.slice(0, span);
}


export function tokenTransfer(
  mint: PublicKey,
  owner: PublicKey,
  source: PublicKey,
  dest: PublicKey,
  programId: PublicKey,
  amount: number,
  decimals: number
): TransactionInstruction {
  const keys = [
    { pubkey: source, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: dest, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId,
    data: encodeTokenInstructionData({
      transferChecked: { amount, decimals },
    }),
  })
}

export function depositInstructionV4(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  userRewardTokenAccountB: PublicKey,
  poolRewardTokenAccountB: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccountB, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccountB, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 1,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function withdrawInstruction(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function withdrawInstructionV4(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  userRewardTokenAccountB: PublicKey,
  poolRewardTokenAccountB: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccountB, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccountB, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}



export function withdrawInstructionV6(
  farm_info: PublicKey,
  authority_info: PublicKey,
  user_lp_address: PublicKey,
  user_farm_address: PublicKey,
  user_info: PublicKey,
  pool_lp_address: PublicKey,
  tokenProgramId: PublicKey,
  swapProgramId: PublicKey,
  pool_farm_address: PublicKey,
  pool_fee_lp_account: PublicKey,
  amount: number,
): TransactionInstruction {
  let clock = new PublicKey('SysvarC1ock11111111111111111111111111111111');
  const keys = [
    { pubkey: farm_info, isSigner: false, isWritable: true },
    { pubkey: authority_info, isSigner: false, isWritable: true },
    { pubkey: user_info, isSigner: false, isWritable: true },
    { pubkey: user_farm_address, isSigner: false, isWritable: true },
    { pubkey: user_lp_address, isSigner: false, isWritable: true },
    { pubkey: pool_lp_address, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: pool_farm_address, isSigner: false, isWritable: true },
    { pubkey: clock, isSigner: false, isWritable: false },
    { pubkey: pool_fee_lp_account, isSigner: false, isWritable: true },
  ];
  const commandDataLayout = struct([
    u8('instruction'),
    nu64('amount'),
  ]);
  let data = Buffer.alloc(1024);
  {
    const encodeLength = commandDataLayout.encode(
      {
        instruction: 8, // Withdraw instruction
        amount,
      },
      data,
    );
    data = data.slice(0, encodeLength);
  }
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data,
  });
}

export const STAKE_INFO_LAYOUT = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  publicKey('owner'),
  publicKey('feeOwner'),
  u64('feeY'),
  u64('feeX'),
  u64('totalReward'),
  u128('rewardPerShareNet'),
  u64('lastBlock'),
  u64('rewardPerBlock')
])

export const STAKE_INFO_LAYOUT_V4 = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  u64('totalReward'),
  u128('perShare'),
  u64('perBlock'),
  u8('option'),
  publicKey('poolRewardTokenAccountB'),
  blob(7),
  u64('totalRewardB'),
  u128('perShareB'),
  u64('perBlockB'),
  u64('lastBlock'),
  publicKey('owner')
])

export const USER_STAKE_INFO_ACCOUNT_LAYOUT = struct([
  u64('state'),
  publicKey('poolId'),
  publicKey('stakerOwner'),
  u64('depositBalance'),
  u64('rewardDebt')
])

export const USER_STAKE_V6_INFO_ACCOUNT_LAYOUT = struct([
  u8('isInitialized'), //
  u64('amount'),
  u64('rewardDebt')
])


export const USER_STAKE_INFO_ACCOUNT_LAYOUT_V4 = struct([
  u64('state'),
  publicKey('poolId'),
  publicKey('stakerOwner'),
  u64('depositBalance'),
  u64('rewardDebt'),
  u64('rewardDebtB')
])
