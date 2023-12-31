
import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { Wallet, ethers } from 'ethers'
import { UserOperation } from "@biconomy/core-types"
import {
    IPaymaster,
    BiconomyPaymaster,
    IHybridPaymaster,
    PaymasterMode,
    SponsorUserOperationDto,
} from '@biconomy/paymaster'

config();

let smartAccount: BiconomySmartAccountV2;

let bundler: IBundler;

let payMaster: IPaymaster;

let address: string

const getPayMaster = (chainId: number) => {
    return payMaster ??= new BiconomyPaymaster({
        paymasterUrl: `${process.env.PAYMASTER_BASE_URL}/${chainId}/${process.env.PAYMASTER_API_KEY}`
    });
}

const getWallet = (rpcUrl: string) => {
    const provider = new ethers.providers.JsonRpcProvider(
        rpcUrl
    );

    return new Wallet(process.env.PRIVATE_KEY || "", provider);
}

const getBundler = (chainId: number) => {
    return bundler ??= new Bundler({
        bundlerUrl:
            `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
        chainId: chainId,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });
}

const getModule = async (rpcUrl: string) => {
    return await ECDSAOwnershipValidationModule.create({
        signer: getWallet(rpcUrl),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    });
}

export async function createAccount(chainId: number, rpcUrl: string) {

    bundler ??= getBundler(chainId);

    smartAccount ??= await BiconomySmartAccountV2.create({
        chainId: chainId,
        bundler: bundler,
        paymaster: getPayMaster(chainId),
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: await getModule(rpcUrl),
        activeValidationModule: await getModule(rpcUrl)
    });

    address ??= await smartAccount.getAccountAddress();

    return smartAccount;
}

export const executeUserOp = async (partialUserOp: Partial<UserOperation>) => {
    try {
        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);

        const transactionDetails = await userOpResponse.wait();

        if (!transactionDetails || !transactionDetails.receipt || !transactionDetails.receipt.transactionHash) {
            throw new Error(!transactionDetails ? "Invalid Transaction Details Returned"
                : !transactionDetails.receipt ? "Invalid Transaction Receipt Returned"
                    : "Invalid Transaction Hash Returned");
        }

        return transactionDetails.receipt.transactionHash
    } catch (error: any) {
        throw new Error("Error Sending User Operation" + `\n${error.message}`)
    }
}

export const getPartialUserOp = async (transaction: { to: string, data: any }, chainId: number, rpcUrl: string) => {

    var smartAccount = await createAccount(chainId, rpcUrl);

    let partialUserOp = await smartAccount.buildUserOp([transaction]);

    const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

    let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
            name: 'BICONOMY',
            version: '2.0.0'
        },
    };

    try {
        const paymasterAndDataResponse =
            await biconomyPaymaster.getPaymasterAndData(
                partialUserOp,
                paymasterServiceData
            );

        partialUserOp.paymasterAndData =
            paymasterAndDataResponse.paymasterAndData;

        return partialUserOp;
    } catch (error: any) {
        throw new Error("Error while fetching paymaster data" + `\n${error.message}`);
    }
}