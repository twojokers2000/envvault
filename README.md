# 📦 envvault

<p align="center">
  🔐 Type-safe environment variables for Node.js & TypeScript  
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/envvault">
    <img src="https://img.shields.io/npm/v/envvault.svg" />
  </a>
  <a href="https://www.npmjs.com/package/envvault">
    <img src="https://img.shields.io/npm/dw/envvault.svg" />
  </a>
  <a href="https://github.com/twojokers2000/envvault">
    <img src="https://img.shields.io/github/stars/twojokers2000/envvault?style=social" />
  </a>
  <img src="https://img.shields.io/badge/zero-dependency-true-green" />
  <img src="https://img.shields.io/badge/typescript-ready-blue" />
</p>

---

## 🚨 The Problem

Using `process.env` directly is dangerous:

```ts
const port = process.env.PORT; // string | undefined 😬
