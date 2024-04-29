# Eco Track

## Idea

A blockchain-based platform for tracking and verifying the sustainability practices of companies.
Utilizes smart contracts and ZK-proofs to provide transparent and verifiable records of a company's
environmental impact.

## Dev Instructions

- Package Manager - yarn
- Node version - v18.x (use nvm)
- EcoTrack Contract can:
  - save sustanibility proofs and public inputs given by company
  - Verifies on chain using UltraVerifier.sol contract
  - You can only submit once with one wallet.
- Verify route
  - Open to everyone using app.
  - Enter wallet address to query sustability data and display on page.
  - Click "Verify Proof On-chain" to verify proof
