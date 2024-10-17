import { ethers } from "ethers";
import { ERC20Abi, ERC20Bytecode } from "../abi/ERC20.js";

// import { abi, bytecode } from "../../artifacts/contracts/ERC20.sol/MyToken.json"

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

export function createWallet(): { phrase: string, privateKey: string, address: string } | void {
     const wallet = ethers.Wallet.createRandom();
     const { mnemonic, privateKey } = wallet;

   if (!mnemonic) {
        console.error('Failed to create a wallet');
        return;
    }

    const eoa = ethers.Wallet.fromPhrase(mnemonic.phrase);

   return {
        phrase: mnemonic.phrase,
        privateKey: privateKey,
        address: eoa.address,
   };
}

export async function deployERC20(index: number) {
     const wallet = getWallet(index);
     const contract = new ethers.ContractFactory(ERC20Abi, ERC20Bytecode, wallet);
     
     const tx = await contract.deploy(wallet.address);

     const receipt = await tx.waitForDeployment();
     console.log('Contract address:', receipt.target);
}

export async function transferToken(index: number, to: string, amount: number, denom: string) {
     const wallet = getWallet(index);
     let tx: ethers.TransactionResponse;
     const amountBN = ethers.parseEther(amount.toString());
     if (denom === ethers.ZeroAddress) {
          tx = await wallet.sendTransaction({
               to,
               value: amountBN,
          });
     } else {
          const contract = new ethers.Contract(denom, ERC20Abi, wallet);

          tx = await contract.transfer(to, amountBN);
     }

     const receipt = await tx.wait();
     console.log('Transaction result: ', receipt);
     return;
}

export async function getTransactionByHash(hash: string) {
     const tx = await provider.getTransaction(hash);
     console.log('Transaction: ', tx);
}


export function getWalletList(): string[] {
     let i = 1;
     const addresses = [];
     while(true) {
          const key = process.env[`PVKEY_TEST_${i}`];
          if (!key) {
               break;
          }
          
          const wallet = new ethers.Wallet(key);
          addresses.push(wallet.address);
          i++;
     }

     return addresses;
}

function getWallet(index: number): ethers.Wallet {
     const key = process.env[`PVKEY_TEST_${index}`];
     if (!key) {
          throw new Error(`Failed to get a private key of index :  ${index}`);
     }

     const p = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

     return new ethers.Wallet(key, p);
}

export async function createKeyStore(
     password: string,
     privateKey?: string,
) {
     const wallet = privateKey ? new ethers.Wallet(privateKey) : ethers.Wallet.createRandom();

     const { privateKey: pvKey } = wallet;

     const keyStoreJson = await wallet.encrypt(password);

     if ( !privateKey ) { console.log('Create a new wallet with a random private key'); }
     console.log('KeyStore: ', keyStoreJson);
     console.log('Private Key: ', pvKey);

     return;
}