// Simple test script to verify Aether Chat API
// Usage: node scripts/test-chat.mjs

console.log('Testing Aether API at http://localhost:3000/api/gemini ...');

try {
  const response = await fetch('http://localhost:3000/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: 'Hello, I am feeling a bit overwhelmed today.' }
      ]
    })
  });

  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText);
    console.error(await response.text());
    process.exit(1);
  }

  console.log('--- Response Headers ---');
  console.log('Status:', response.status);
  
  console.log('\n--- Start of Stream ---');
  
  // Node.js 18+ native fetch supports web streams
  if (response.body) {
    // For Node environment, we might need to handle the stream differently if getReader isn't fully polyfilled
    // But let's try the standard async iterator
    for await (const chunk of response.body) {
      const text = new TextDecoder().decode(chunk);
      process.stdout.write(text);
    }
  } else {
    console.log(await response.text());
  }
  
  console.log('\n--- End of Stream ---');

} catch (error) {
  console.error('Connection Failed:', error);
  console.log('Make sure your Next.js dev server is running on port 3000 (npm run dev)');
}
