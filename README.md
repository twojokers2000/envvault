# 📦 envvault

<p align="center">
  🔐 Type-safe environment variable validation for Node.js & TypeScript  
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/envvault.svg" />
  <img src="https://img.shields.io/npm/dw/envvault.svg" />
  <img src="https://img.shields.io/github/stars/twojokers2000/envvault?style=social" />
  <img src="https://img.shields.io/badge/zero-dependency-true-green" />
  <img src="https://img.shields.io/badge/typescript-ready-blue" />
</p>

---

## 🚨 The Problem

Using `process.env` directly is unsafe:

```ts
const port = process.env.PORT; // string | undefined 😬
```

* ❌ No type safety
* ❌ No validation
* ❌ Runtime crashes
* ❌ Silent bugs

---

## ✅ The Solution

```ts
import { env, number } from "envvault";

const config = env({
  PORT: number(),
});

config.PORT; // number ✅
```

👉 Fail fast. Stay safe. Ship confidently.

---

## ✨ Features

* 🔒 Type-safe environment variables
* ⚡ Runtime validation
* 🧠 Default values support
* 🧩 Optional variables support
* 💥 Clear error messages
* 📦 Zero dependencies
* 🚀 Framework agnostic

---

## 📦 Installation

```bash
npm install envvault
```

---

## ⚡ Quick Start

```ts
import { env, string, number, boolean } from "envvault";

const config = env({
  DATABASE_URL: string(),
  PORT: number().default(3000),
  DEBUG: boolean().optional(),
});
```

---

## 🧠 Example

```ts
const config = env({
  API_KEY: string(),
  PORT: number().default(3000),
  NODE_ENV: string(),
  DEBUG: boolean().optional(),
});

console.log(config.PORT); // number
```

---

## 💥 Error Example

```bash
❌ Invalid environment variable: PORT must be a number
```

👉 Your app crashes early instead of failing in production.

---

## 🆚 Comparison

| Feature     | envvault  | manual |
| ----------- | --------  | ------ |
| Type safety | ✅        | ❌      |
| Validation  | ✅        | ❌      |
| Defaults    | ✅        | ⚠️     |
| DX          | 🔥        | ❌      |

---

## 📁 Example `.env`

```env
PORT=3000
DATABASE_URL=postgres://localhost:5432/db
DEBUG=true
```

---

## 🧩 API

### Validators

```ts
string()
number()
boolean()
```

### Modifiers

```ts
.optional()
.default(value)
```

---

## 🛠 Development

```bash
npm install
npm run build
npm test
```

---

## 🚀 Roadmap

* [ ] URL / enum validators
* [ ] CLI support
* [ ] Better error formatting
* [ ] Browser support

---

## 🤝 Contributing

PRs are welcome! Feel free to open issues or suggest improvements.

---

## 📄 License

MIT © Vivek Kumar

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🐛 Report issues
* 💡 Suggest features

---

## 🔥 One-line Pitch

> envvault = Zod for environment variables (zero dependency)

