# FiveM Framework Library (server-side)
This library allows you to easily interact with the servers framework, without writing the same code over and over again for each framework.

## Installation

```bash
npm install @garmingo/framework-js-server
```

## Requirements
You might have to set up a `.npmrc` file in your project root, to be able to install this package. This is due to the fact that this package is hosted on a private npm registry.
The `.npmrc` file should contain the following line:
```npmrc
@garmingo:registry=https://npm.pkg.github.com
```

## Usage
```typescript
import { Framework } from '@garmingo/framework-js-server';

const framework = new Framework();

framework.getPlayerWalletMoney(playerId);
framework.addPlayerWalletMoney(playerId, 500);
...
```

## Obfuscation

This package itself is not obfuscated. However, it is recommended to include this package in your build process and obfuscate the entire build output.

You might want to have a look at [js-obfuscator](https://www.npmjs.com/package/javascript-obfuscator) for this.

## License

This project is not licensed. This means that you are not allowed to use this project in any way, shape or form. Even if you are a paying customer of Garmingo.

Only Garmingo is allowed to use this project. If you are not Garmingo, you are not allowed to use this project.

Except you got a written permission from Garmingo. In that case you are allowed to use this project.
