# FiveM Framework Library (server-side)
This library allows you to easily interact with the servers framework, without writing the same code over and over again for each framework.

[![YouTube Video](https://img.youtube.com/vi/jGhmhYDtU8g/0.jpg)](https://www.youtube.com/watch?v=jGhmhYDtU8g)

## Installation

```bash
npm install @garmingo/framework-js-server
```

## Supported Frameworks
 * ESX Legacy
 * ESX Infinity
 * QBCore
 * Custom implementations

## Usage
```typescript
import { Framework } from '@garmingo/framework-js-server';

const framework = new Framework();

framework.getPlayerWalletMoney(playerId);
framework.addPlayerWalletMoney(playerId, 500);
...
```

## Docs
[Project setup and usage](https://docs.garmingo.com/purchase-and-installation/frameworks)

[Type reference](https://tsdocs.dev/docs/@garmingo/framework-js-server/)

## Other packages
https://github.com/Garmingo/framework-js-client

https://github.com/Garmingo/FrameworkLibraryNET

https://github.com/Garmingo/framework-lua

## Contact Us
Discord: https://discord.gg/c7UQ2ca
