# VMkit

<div align="center">
  <img src="/assets/icon-dark-512x512.png" alt="VMkit Logo" width="200" />
  <h3>Universal Blockchain Connection Library</h3>
  <p>A comprehensive toolkit for connecting to multiple blockchain networks with a unified API</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![GitHub Stars](https://img.shields.io/github/stars/headline-design/vmkit?style=social)](https://github.com/headline-design/vmkit)
  [![Twitter Follow](https://img.shields.io/twitter/follow/vmkit_xyz?style=social)](https://twitter.com/headline_design)
</div>

Thought for 1 second### VMkit

## 🌟 About VMkit

VMkit is a powerful, open-source framework that enables developers to build blockchain applications with a unified API across multiple virtual machine ecosystems. Whether you're building on EVM (Ethereum), SVM (Solana), AVM (Algorand), or Substrate networks (Polkadot/Kusama), VMkit provides a consistent developer experience with features designed for modern web applications.

The framework offers a suite of packages and tools that work together to simplify blockchain integration:

- **Unified API**: Write your application once and connect to any supported blockchain
- **Framework Agnostic**: Core packages work with any JavaScript framework
- **React Integration**: React components and hooks for rapid development
- **Next.js Ready**: Optimized for Next.js with App Router support (Next.js 15+)
- **Type-Safe**: Written in TypeScript with full type definitions
- **VMstack Template**: Production-ready Next.js template for quick project bootstrapping


## 📦 Packages

| Package | Description | Version | Links
|-----|-----|-----|-----
| `@vmkit/connect-evm` | Connect to Ethereum Virtual Machine networks (EVM) such as Ethereum, Binance Smart Chain, Polygon, and more. | [![npm version](https://img.shields.io/npm/v/@vmkit/connect-evm.svg)](https://www.npmjs.com/package/@vmkit/connect-evm) | [Documentation](https://vmkit.xyz/docs/packages/connect-evm) |
| `@vmkit/connect-svm` | Connect to Solana Virtual Machine networks (SVM) such as Solana. | [![npm version](https://img.shields.io/npm/v/@vmkit/connect-svm.svg)](https://www.npmjs.com/package/@vmkit/connect-svm) | [Documentation](https://vmkit.xyz/docs/packages/connect-svm) |
| `@vmkit/connect-avm` | Connect to Algorand Virtual Machine networks (AVM) such as Algorand. | [![npm version](https://img.shields.io/npm/v/@vmkit/connect-avm.svg)](https://www.npmjs.com/package/@vmkit/connect-avm) | [Documentation](https://vmkit.xyz/docs/packages/connect-avm) |
| `@vmkit/connect-substrate` | Connect to Substrate-based networks such as Polkadot and Kusama. | [![npm version](https://img.shields.io/npm/v/@vmkit/connect-substrate.svg)](https://www.npmjs.com/package/@vmkit/connect-substrate) | [Documentation](https://vmkit.xyz/docs/packages/connect-substrate)


## ✨ Key Features

- **Multi-Chain Support**: Connect to EVM, SVM, AVM, and Substrate networks with a consistent API
- **Wallet Management**: Connect to wallets across different blockchain networks with a unified interface
- **Smart Contract Interactions**: Query data and execute transactions on smart contracts
- **Event Subscriptions**: Real-time event subscriptions across all supported networks
- **Authentication**: Sign-in with wallet authentication for secure user identification
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modular Architecture**: Use only the packages you need to keep your bundle size small
- **React Hooks & Components**: Ready-to-use React hooks and components for common blockchain operations
- **Framework Agnostic Core**: Core functionality works with any JavaScript framework
- **Performance Optimized**: Efficient implementation with minimal overhead
- **Comprehensive Documentation**: Detailed guides, API references, and examples


## 🚀 VMstack: The Official Next.js Template

VMstack is a production-ready template for building blockchain applications with Next.js 15 and VMkit. It provides:

- **Full Next.js 15 Setup**: Leveraging the latest Next.js features including App Router
- **Multi-Chain Configuration**: Pre-configured for EVM, SVM, AVM, and Substrate networks
- **UI Components**: Beautiful, accessible UI components built with Tailwind CSS and shadcn/ui
- **Authentication**: Wallet-based authentication with SIWE/SIWS
- **Dashboard Layout**: Responsive dashboard layout with sidebar navigation
- **Dark Mode Support**: Toggle between light and dark themes
- **API Routes**: Server-side API routes for secure blockchain interactions
- **State Management**: Efficient state management with React Context and Zustand
- **SEO Optimization**: Built-in SEO support with Next.js metadata API
- **Developer Experience**: ESLint, TypeScript, and Prettier configurations


## 🎨 Design System & Styling

VMkit comes with a flexible design system:

- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Adaptive Theming**: Support for light and dark modes
- **Custom Components**: Specialized blockchain components like wallet connectors and transaction status indicators
- **Modular Design**: Mix and match components to create your own UI
- **Responsive Layouts**: Mobile-first design approach
- **Motion Effects**: Subtle animations for enhanced user experience
- **Accessible UI**: ARIA-compliant components for accessibility


## 🛠️ Tech Stack

VMkit is built with modern web technologies:

- **TypeScript**: Type-safe development with comprehensive type definitions
- **Next.js 15**: Built for the latest Next.js capabilities including App Router
- **React 19**: Leveraging the latest React features and optimizations
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible components for building high-quality UIs
- **viem**: Type-safe Ethereum interactions for EVM networks
- **@solana/web3.js**: Solana JavaScript API for SVM networks
- **@polkadot/api**: JavaScript API for Substrate-based chains
- **Zustand**: Lightweight state management
- **TanStack Query**: Data fetching and caching for blockchain data
- **SIWE/SIWS**: Sign-In with Ethereum/Solana for authentication
- **ESLint & Prettier**: Code quality tools for consistent style
- **pnpm**: Fast, disk-efficient package manager
- **Turborepo**: Optimized build system for monorepos


## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later


### Installation

#### Using the VMstack Template

Create a new project with the VMstack template:

```shellscript
npx create-next-app@latest my-blockchain-app --template vmstack
# or
pnpm create next-app my-blockchain-app --template vmstack
# or
yarn create next-app my-blockchain-app --template vmstack
```

#### Using the VMkit CLI

```shellscript
# Install the CLI globally
npm install -g @vmkit/cli
# or
pnpm add -g @vmkit/cli

# Create a new project
vmkit create my-blockchain-app

# Follow the interactive prompts to customize your project
```

#### Manual Installation

1. Create a new Next.js project:


```shellscript
npx create-next-app@latest my-blockchain-app
cd my-blockchain-app
```

2. Install VMkit packages:


```shellscript
# Install core and network packages
npm install @vmkit/connect-core @vmkit/connect-evm @vmkit/connect-svm
# or
pnpm add @vmkit/connect-core @vmkit/connect-evm @vmkit/connect-svm
```

3. Set up providers in your app:


```typescriptreact
// app/providers.tsx
'use client'

import { EVMProvider } from '@vmkit/connect-evm'
import { SVMProvider } from '@vmkit/connect-svm'
import { PropsWithChildren } from 'react'

export function Providers({ children }: PropsWithChildren) {
  return (
    <EVMProvider>
      <SVMProvider>
        {children}
      </SVMProvider>
    </EVMProvider>
  )
}
```

4. Add to your layout:


```typescriptreact
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Development

To start developing with the monorepo:

```shellscript
# Clone the repository
git clone https://github.com/headline-design/vmkit.git
cd vmkit

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the development environment
pnpm dev
```

## 📚 Documentation

Comprehensive documentation is available at [vmkit.xyz/docs](https://vmkit.xyz/docs):

- **Getting Started**: Installation, quick start guides, and CLI usage
- **Core Concepts**: Smart contracts, wallet management, event subscriptions
- **Package References**: Detailed API documentation for each package
- **Guides**: Step-by-step tutorials for common use cases
- **Examples**: Code examples for various blockchain interactions
- **Advanced Topics**: Performance optimization, security best practices, debugging


## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](/docs/contributing) for more information on how to get involved.

## 📄 License

VMkit is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- Thanks to the Ethereum, Solana, Algorand, and Polkadot communities
- Built with support from Headline Design
- Special thanks to all contributors and early adopters
