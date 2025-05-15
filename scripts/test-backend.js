#!/usr/bin/env node
// Test script to check the connection to the backend API

const API_URL = 'http://localhost:3000';
const API_KEY = 'a07756a8-c5f2-40e5-8fdb-0866c53a6cf5'; // Should match your .env.local

async function testBackendConnection() {
  console.log('🔍 Testing connection to backend server...');
  
  try {
    // Check if server is running by pinging /articles endpoint
    console.log(`Testing endpoint: ${API_URL}/articles`);
    const articlesResponse = await fetch(`${API_URL}/articles`);
    
    if (!articlesResponse.ok) {
      throw new Error(`Articles endpoint returned status: ${articlesResponse.status}`);
    }
    
    const articles = await articlesResponse.json();
    console.log(`✅ Successfully connected to articles endpoint. Found ${articles.length} articles.`);
    
    // Test article generation endpoint
    console.log(`\nTesting endpoint: ${API_URL}/create-articles`);
    console.log(`Using API Key: ${API_KEY}`);
    
    const generateResponse = await fetch(`${API_URL}/create-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: API_KEY }),
    });
    
    if (!generateResponse.ok) {
      if (generateResponse.status === 404) {
        console.error('❌ Error: 404 Not Found - The /create-articles endpoint does not exist on the server.');
        console.error('This could mean:');
        console.error('  - The backend server is not running correctly');
        console.error('  - The endpoint is defined differently than expected');
        console.error('\nPlease check:');
        console.error('  1. That the integrityproject server is running (npm run dev in that folder)');
        console.error('  2. The server logs for any errors during startup');
        return;
      }
      
      if (generateResponse.status === 401) {
        console.error('❌ Error: 401 Unauthorized - The API key is not valid.');
        console.error('\nPlease check:');
        console.error('  1. That the API key exists in the backend database');
        console.error('  2. That the API key is in the correct format (UUID)');
        return;
      }
      
      throw new Error(`Generate endpoint returned status: ${generateResponse.status}`);
    }
    
    const result = await generateResponse.json();
    console.log(`✅ Successfully connected to generate endpoint. Response:`, result);
    
  } catch (error) {
    console.error(`❌ Error connecting to backend: ${error.message}`);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
      console.error('\n🔴 The backend server appears to be offline or not responding.');
      console.error('Please start the backend server by running:');
      console.error('cd ../integrityproject && npm run dev');
    }
  }
}

testBackendConnection();
