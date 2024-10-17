import { Chalk } from "chalk";

export function displayWalletInfo(mnemonic: {phrase: string, privateKey: string, address: string}): void {
    const chalk = new Chalk();

    console.log(chalk.blue.bold('Wallet Information'));
    console.log(chalk.greenBright('Mnemonic: '), mnemonic.phrase);
    console.log(chalk.greenBright('Private Key: '), mnemonic.privateKey);
    console.log(chalk.greenBright('Address: '), mnemonic.address);
}