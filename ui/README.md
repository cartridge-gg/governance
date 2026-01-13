# Survivor Governance UI

A modern governance interface for the Survivor Governor contract built with React, Vite, and Starknet.

## Features

- 📊 **Proposals Dashboard** - View and vote on active governance proposals
- 👥 **Delegation System** - Delegate voting power to trusted community members
- ✏️ **Proposal Creation** - Create new proposals with multiple execution calls
- 🔗 **Starknet Integration** - Connect with Argent or Braavos wallets
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- A Starknet wallet (Argent or Braavos)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Configure your contract addresses in `src/config/contracts.ts`:
```typescript
export const contracts = {
  governor: {
    address: "YOUR_GOVERNOR_CONTRACT_ADDRESS",
    abi: [], // Add your contract ABI
  },
  token: {
    address: "YOUR_TOKEN_CONTRACT_ADDRESS",
    abi: [],
  },
  // ... other contracts
};
```

### Development

Start the development server:
```bash
bun dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
bun run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── layout/      # Layout components (Header, Layout)
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts (StarknetProvider)
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   ├── Proposals.tsx
│   ├── Delegates.tsx
│   └── CreateProposal.tsx
├── config/          # Configuration files
└── lib/            # Utility functions
```

## Contract Integration

The UI is designed to work with the Survivor Governor contract. Before using the app:

1. Deploy your governance contracts on Starknet
2. Update the contract addresses in `src/config/contracts.ts`
3. Add the contract ABIs to enable full functionality

### Required Contracts

- **Governor Contract**: Main governance contract for proposals and voting
- **Token Contract**: ERC20 token with voting capabilities
- **Timelock Controller**: (Optional) For delayed proposal execution

## Features Overview

### Proposals Page
- View all governance proposals
- Filter by status (Active, Passed, Failed)
- See voting statistics and quorum progress
- Cast votes on active proposals

### Delegates Page
- Browse community delegates
- View delegation statistics
- Delegate your voting power
- Search and filter delegates

### Create Proposal Page
- Write proposal title and description (Markdown supported)
- Add multiple contract calls for execution
- Preview proposal before submission
- Automatic validation of proposal parameters

## Wallet Connection

The app supports:
- Argent X
- Braavos
- Other Starknet-compatible wallets via get-starknet

## Styling

The app uses a dark theme by default to match the Ekubo governance design. Colors and styling can be customized in:
- `src/index.css` - CSS variables and Tailwind configuration
- `tailwind.config.js` - Tailwind theme configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.