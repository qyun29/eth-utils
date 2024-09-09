import { ESLint } from "eslint";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,js,mjs,cjs}"],
    languageOptions: {
      parser: tsparser,
      globals: globals.node, // Node.js 환경 설정
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin, // Prettier 플러그인 추가
    },
    rules: {
      // TypeScript 규칙
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      // 자바스크립트 규칙
      "no-console": "off", // CLI에서 콘솔 사용을 허용
      "prefer-const": "error",
      "prettier/prettier": "error", // Prettier 오류를 ESLint에서 처리
    },
    // ESLint 기본 설정 가져오기
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...prettier,
  }
];