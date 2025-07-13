#!/bin/bash

# Get canister IDs and set environment variables
export CANISTER_ID_BLACKJACK_BACKEND=$(dfx canister id blackjack_backend)
export CANISTER_ID_INTERNET_IDENTITY=$(dfx canister id internet_identity)
export DFX_NETWORK=local

echo "Environment variables set:"
echo "CANISTER_ID_BLACKJACK_BACKEND=$CANISTER_ID_BLACKJACK_BACKEND"
echo "CANISTER_ID_INTERNET_IDENTITY=$CANISTER_ID_INTERNET_IDENTITY"
echo "DFX_NETWORK=$DFX_NETWORK"

# Build and deploy frontend
npm run build
dfx deploy blackjack_frontend
