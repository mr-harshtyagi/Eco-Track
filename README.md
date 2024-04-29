# Eco Track

## Introduction

A blockchain-based platform for tracking and verifying the sustainability practices of companies.
Utilizes smart contracts and ZK-proofs to provide transparent and verifiable records of a company's
environmental impact.

## Deployed Contract Addresses

- EcoTrack.sol 0x8dc7202c27de1d423ae8011f898ca172af28b762
- UltraVerifier.sol 0x4612869797a1f8ec40d5fc12fe17519674dacf30

## Setup Instructions

- git clone `https://github.com`
- Install packages using `yarn`. Make sure you are using nargo 0.22.0 and node 18.x
- Run test `yarn test`
- Deploy contract on localhost using `NETWORK=localhost yarn deploy`
- Now you can run frontend locally with `yarn dev`

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
