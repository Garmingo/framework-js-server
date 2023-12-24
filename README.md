# FiveM Framework Library (server-side)
This library allows you to easily interact with the servers framework, without writing the same code over and over again for each framework.

## Installation

```bash
npm install @garmingo/framework-js-server
```

## Usage
```typescript
import { Framework } from '@garmingo/framework-js-server';

const framework = new Framework();

framework.getPlayerWalletMoney(playerId);
framework.addPlayerWalletMoney(playerId, 500);
...
```

## Docs
https://docs.garmingo.com/purchase-and-installation/frameworks

## Other packages
https://github.com/Garmingo/framework-js-client

https://github.com/Garmingo/FrameworkLibraryNET

https://github.com/Garmingo/framework-lua
