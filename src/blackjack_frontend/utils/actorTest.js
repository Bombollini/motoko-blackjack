import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/blackjack_backend/blackjack_backend.did.js';

// Direct test for backend connection
const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    const agent = new HttpAgent({ 
      host: 'http://localhost:4943',
      // Disable certificate verification for local development
      verifyQuerySignatures: false
    });
    
    // Fetch root key for local development
    await agent.fetchRootKey();
    
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: 'uxrrr-q7777-77774-qaaaq-cai',
    });
    
    console.log('Actor created successfully');
    
    // Test a simple call with proper principal
    const testPrincipal = 'rrkah-fqaaa-aaaaa-aaaaq-cai'; // Use a valid principal format
    const result = await actor.getProfile(testPrincipal);
    console.log('Profile result:', result);
    
    return actor;
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
};

export { testBackendConnection };
export const blackjack_backend = await testBackendConnection();
