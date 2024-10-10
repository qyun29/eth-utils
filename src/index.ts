#!/usr/bin/env node

import { Command } from 'commander';
import { displayWalletInfo } from './lib/chalk.js';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { getWalletList, createMnemonic } from './ethers/wallet.js';

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
  name: 'Create a random mnemonic',
  action: () => {
    const mnemonic = createMnemonic();
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
    const { choice } = await inquirer.prompt([
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

    console.log('choice:', choice);
  }
}



// 명령어 목록 배열
const commands = [
  mnemonicCommand,
  walletListCommand,
  deployContractCommand
];

// 명령어 파싱 및 실행
// 대화형 메뉴 함수
async function interactiveMenu() {
  console.log('command: ', commands)
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
  console.log('command: ', commands)
  selectedCommand.action();
}
console.log('command: ', commands)
// 프로그램 시작
interactiveMenu();