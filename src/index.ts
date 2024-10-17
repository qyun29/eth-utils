#!/usr/bin/env node

import { Command } from 'commander';
import { displayWalletInfo } from './lib/chalk.js';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { getWalletList, createWallet, deployERC20, transferToken, getTransactionByHash, createKeyStore } from './ethers/wallet.js';
import { ethers } from 'ethers';

// .env 파일을 로드합니다.
dotenv.config();

// Commander를 사용해 CLI 명령어를 구성합니다.
const program = new Command();

// 패키지 정보 (version 및 description) 설정
program
  .name('cli')
  .description('A simple CLI tool example')
  .version('1.0.0');

// 랜덤 니모닉 생성 명령어
const mnemonicCommand = {
  name: 'Create a random wallet',
  action: () => {
    const mnemonic = createWallet();
    if (!mnemonic) {
      return;
    }
    displayWalletInfo(mnemonic);
  },
};

// walletlist 명령어
const walletListCommand = {
  name: 'Get a list of wallet addresses from environment variables',
  action: () => {
    const addresses: string[] = getWalletList();
    
    console.log('Wallets :');
    addresses.forEach((address, index) => {
      console.log(`${index + 1}: ${address}`);
    });
  },
};

const deployContractCommand = {
  name: 'Deploy an OpenZeppelin test contract',
  action: async() => {
    const { choice: walletIndex } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Select a wallet to deploy the contract',
        choices: getWalletList().map((address, index) => ({
          name: `${index + 1}: ${address}`,
          value: index,
        })),
      }
    ])

    const tokens = [
      deployERC20,
    ]

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Select a wallet to transfer tokens',
        choices: tokens.map((f, index) => (
            {
              name: `${index + 1}: ${f.name}`,
              value: index,
            }
          )),
        }
    ])

    console.log('Deploying contract...');
    await tokens[choice](walletIndex + 1);
  }
}

const transferTokenCommand = {
  name: 'Transfer tokens',
  action: async() => {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Select a wallet to transfer tokens',
        choices: getWalletList().map((address, index) => ({
          name: `${index + 1}: ${address}`,
          value: index,
        })),
      }
    ])

    const { to, amount, denom } = await inquirer.prompt([
      {
        type: 'input',
        name: 'to',
        message: 'Enter the recipient address',
      },
      {
        type: 'input',
        name: 'amount',
        message: 'Enter the amount of tokens to transfer',
      },
      {
        type: 'input',
        name: 'denom',
        message: 'Enter the token address (default for ETH)',
        default: ethers.ZeroAddress
      },
    ]);

    console.log('Transfering tokens...');

    await transferToken(choice + 1, to, amount, denom);
  }
}

const getTransactionCommand = {
  name: 'Get a transaction by hash',
  action: async() => {
    const { hash } = await inquirer.prompt([
      {
        type: 'input',
        name: 'hash',
        message: 'Enter the transaction hash',
      },
    ]);

    await getTransactionByHash(hash);
  }
}

const createKeyStoreCommand = {
  name: 'Create a keystore json',
  action: async() => {
    const { password, pvKey } = await inquirer.prompt([
      {
        type: 'input',
        name: 'password',
        message: 'Enter the password for the keystore',
      },
      {
        type: 'input',
        name: 'pvKey',
        message: 'Enter the private key. If blank, a random key will be generated',
      },
    ]);

    await createKeyStore(password, pvKey);
  }
}



// 명령어 목록 배열
const commands = [
  mnemonicCommand,
  walletListCommand,
  deployContractCommand,
  transferTokenCommand,
  getTransactionCommand,
  createKeyStoreCommand
];

// 명령어 파싱 및 실행
// 대화형 메뉴 함수
async function interactiveMenu() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Select a command to execute:',
      choices: commands.map((cmd, index) => ({
        name: `${index + 1}. ${cmd.name}`,
        value: index,
      })),
    },
  ]);

  const selectedCommand = commands[answer.command];
  selectedCommand.action();
}
const addresses: string[] = getWalletList();
console.log('addresses:', addresses);

// 프로그램 시작
interactiveMenu();