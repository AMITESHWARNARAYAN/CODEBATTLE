import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import dotenv from 'dotenv';
import { testConnection } from './services/backendService.js';

dotenv.config();

console.log('🚀 MCP Question Automation - Setup Wizard\n');

async function setup() {
  // 1. Check watch folder
  const watchFolder = process.env.WATCH_FOLDER || 'C:/Users/amitu/Desktop/CodeBattle-Questions';
  
  console.log('📁 Checking watch folder...');
  if (!existsSync(watchFolder)) {
    console.log(`   Creating folder: ${watchFolder}`);
    try {
      await mkdir(watchFolder, { recursive: true });
      console.log('   ✅ Folder created successfully');
    } catch (error) {
      console.log(`   ❌ Failed to create folder: ${error.message}`);
      console.log(`   Please create it manually: ${watchFolder}`);
    }
  } else {
    console.log('   ✅ Folder exists');
  }

  // 2. Check environment variables
  console.log('\n🔧 Checking configuration...');
  
  const checks = [
    { name: 'BACKEND_URL', value: process.env.BACKEND_URL, required: true },
    { name: 'ADMIN_TOKEN', value: process.env.ADMIN_TOKEN, required: true },
    { name: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY, required: false },
    { name: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY, required: false },
    { name: 'AI_PROVIDER', value: process.env.AI_PROVIDER || 'gemini', required: false }
  ];

  let hasErrors = false;
  
  for (const check of checks) {
    if (check.required && !check.value) {
      console.log(`   ❌ ${check.name} - NOT SET (required)`);
      hasErrors = true;
    } else if (!check.value) {
      console.log(`   ⚠️  ${check.name} - NOT SET (optional)`);
    } else {
      const displayValue = check.name.includes('TOKEN') || check.name.includes('KEY')
        ? check.value.substring(0, 10) + '...'
        : check.value;
      console.log(`   ✅ ${check.name} - ${displayValue}`);
    }
  }

  // 3. Check AI provider
  console.log('\n🤖 Checking AI provider...');
  const aiProvider = process.env.AI_PROVIDER || 'gemini';
  
  if (aiProvider === 'gemini' && !process.env.GEMINI_API_KEY) {
    console.log('   ❌ GEMINI_API_KEY not set but AI_PROVIDER is gemini');
    hasErrors = true;
  } else if (aiProvider === 'groq' && !process.env.GROQ_API_KEY) {
    console.log('   ❌ GROQ_API_KEY not set but AI_PROVIDER is groq');
    hasErrors = true;
  } else {
    console.log(`   ✅ Using ${aiProvider.toUpperCase()} for test case generation`);
  }

  // 4. Test backend connection
  if (!hasErrors && process.env.ADMIN_TOKEN) {
    console.log('\n🔗 Testing backend connection...');
    const connected = await testConnection();
    
    if (connected) {
      console.log('   ✅ Successfully connected to backend');
    } else {
      console.log('   ❌ Failed to connect to backend');
      console.log('   Check your BACKEND_URL and ADMIN_TOKEN');
      hasErrors = true;
    }
  }

  // 5. Summary
  console.log('\n' + '='.repeat(60));
  
  if (hasErrors) {
    console.log('❌ Setup incomplete - please fix the errors above');
    console.log('\nTo fix:');
    console.log('1. Edit the .env file');
    console.log('2. Add missing required values');
    console.log('3. Run setup again: node setup.js');
  } else {
    console.log('✅ Setup complete! You\'re ready to go!');
    console.log('\nNext steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Add a question file to: ' + watchFolder);
    console.log('3. Watch it auto-upload to your backend!');
    console.log('\nExample files are in the examples/ folder');
  }
  
  console.log('='.repeat(60) + '\n');
}

setup().catch(console.error);

