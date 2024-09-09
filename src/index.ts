#!/usr/bin/env node

import { Command } from 'commander';
import { createMnemonic } from './ethers/wallet.js';
import { displayWalletInfo } from './lib/chalk.js';

// Commander를 사용해 CLI 명령어를 구성합니다.
const program = new Command();

// 패키지 정보 (version 및 description) 설정
program
  .name('cli')
  .description('A simple CLI tool example')
  .version('1.0.0');

// 랜덤 니모닉 생성 명령어
program
  .command('mnemonic')
  .description('Create a random mnemonic')
  .alias('m')
  .action(() => {
    const mnemonic = createMnemonic();
    if (!mnemonic) {
      return;
    }
    displayWalletInfo(mnemonic);
  });

// sum 명령어 추가
program
  .command('sum <numbers...>')
  .description('Sum the provided numbers')
  .action((numbers: string[]) => {
    const result = numbers.map(Number).reduce((a, b) => a + b, 0);
    console.log(`The sum is: ${result}`);
  });

// 명령어 파싱 및 실행
program.parse(process.argv);