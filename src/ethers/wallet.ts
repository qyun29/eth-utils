import { ethers } from "ethers";
// import { abi, bytecode } from "../../artifacts/contracts/ERC20.sol/MyToken.json"

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

export function createMnemonic(): { phrase: string, address: string } | void {
   const mnemonic: ethers.Mnemonic | null = ethers.Wallet.createRandom().mnemonic;

   if (!mnemonic) {
        console.error('Failed to create a mnemonic');
        return;
    }

    const eoa = ethers.Wallet.fromPhrase(mnemonic.phrase);

   return {
        phrase: mnemonic.phrase,
        address: eoa.address,
   };
}

// export async function deployERC20(index: number) {
//      const wallet = getWallet(index);
//      const contract = new ethers.ContractFactory(abi, bytecode, wallet);
     
//      const tx = await contract.deploy([wallet.address]);

//      console.log('tx: ', tx);
// }

// export async function transferToken(index: number, to: string, amount: number, denom: string) {
//      const wallet = getWallet(index);
//      let tx: ethers.TransactionResponse;
//      if (denom === ethers.ZeroAddress) {
//           tx = await wallet.sendTransaction({
//                to,
//                value: amount,
//           });
//      } else {
//           const contract = new ethers.Contract(denom, abi, wallet);

//           tx = await contract.transfer(to, amount);
//      }

//      console.log('Tx result:', await tx.wait());
//      return;
// }

export function getWalletList(): string[] {
     let i = 0;
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

     return new ethers.Wallet(key);
}