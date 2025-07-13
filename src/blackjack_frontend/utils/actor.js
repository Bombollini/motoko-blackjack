import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/blackjack_backend/blackjack_backend.did.js';

// Use the correct canister ID for local development
const canisterId = process.env.CANISTER_ID_BLACKJACK_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai';

console.log('Creating actor with canister ID:', canisterId);

export const createActor = (canisterId, options = {}) => {
  const isLocal = process.env.DFX_NETWORK === 'local' || !process.env.DFX_NETWORK;
  const host = isLocal ? 'http://localhost:4943' : 'https://ic0.app';
  
  console.log('Creating agent with host:', host);
  console.log('DFX_NETWORK:', process.env.DFX_NETWORK);
  
  const agent = new HttpAgent({ 
    host,
    // Disable certificate verification for local development
    verifyQuerySignatures: false,
    ...options?.agentOptions 
  });

  // Fetch root key for certificate validation during development
  if (isLocal) {
    agent.fetchRootKey().then(() => {
      console.log('Root key fetched successfully');
    }).catch(err => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};

export const blackjack_backend = createActor(canisterId);
