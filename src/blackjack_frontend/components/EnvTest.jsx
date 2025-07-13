console.log('Environment Variables:');
console.log('CANISTER_ID_BLACKJACK_BACKEND:', process.env.CANISTER_ID_BLACKJACK_BACKEND);
console.log('CANISTER_ID_INTERNET_IDENTITY:', process.env.CANISTER_ID_INTERNET_IDENTITY);
console.log('DFX_NETWORK:', process.env.DFX_NETWORK);
console.log('II_URL:', process.env.II_URL);

export default function EnvTest() {
  const internetIdentityUrl = process.env.II_URL || (process.env.DFX_NETWORK === 'local' 
    ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`
    : 'https://identity.ic0.app');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px', fontSize: '12px' }}>
      <h3>Environment Variables Debug</h3>
      <p><strong>CANISTER_ID_BLACKJACK_BACKEND:</strong> {process.env.CANISTER_ID_BLACKJACK_BACKEND}</p>
      <p><strong>CANISTER_ID_INTERNET_IDENTITY:</strong> {process.env.CANISTER_ID_INTERNET_IDENTITY}</p>
      <p><strong>DFX_NETWORK:</strong> {process.env.DFX_NETWORK}</p>
      <p><strong>II_URL:</strong> {process.env.II_URL}</p>
      <p><strong>Computed II URL:</strong> {internetIdentityUrl}</p>
      <button onClick={() => window.open(internetIdentityUrl, '_blank')}>
        Test Internet Identity URL
      </button>
    </div>
  );
}
