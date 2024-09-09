import { ethers } from 'ethers';

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