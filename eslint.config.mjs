import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const globals = {
  Blob: "readonly",
  File: "readonly",
  FileList: "readonly",
  FormData: "readonly",
  Request: "readonly",
  URL: "readonly",
  console: "readonly",
  crypto: "readonly",
  document: "readonly",
  fetch: "readonly",
  navigator: "readonly",
  process: "readonly",
  window: "readonly"
};

export default [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "tsconfig.tsbuildinfo"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals },
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules
    }
  },
  {
    files: ["*.mjs", "tests/**/*.mjs", "scripts/**/*.mjs"],
    languageOptions: { globals }
  }
];
