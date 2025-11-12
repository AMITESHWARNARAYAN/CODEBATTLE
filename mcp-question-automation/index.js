import chokidar from 'chokidar';
import { readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import dotenv from 'dotenv';
import { generateTestCases } from './services/aiService.js';
import { uploadProblem } from './services/backendService.js';
import { parseQuestionFile } from './utils/parser.js';

dotenv.config();

const WATCH_FOLDER = process.env.WATCH_FOLDER || 'C:/Users/amitu/Desktop/CodeBattle-Questions';

console.log('🚀 MCP Question Automation Server Starting...');
console.log(`📁 Watching folder: ${WATCH_FOLDER}`);
console.log(`🔗 Backend URL: ${process.env.BACKEND_URL}`);
console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);

// Track processed files to avoid duplicates
const processedFiles = new Set();

// Initialize file watcher
const watcher = chokidar.watch(WATCH_FOLDER, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: false,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

// Handle new files
watcher.on('add', async (filePath) => {
  const ext = extname(filePath).toLowerCase();
  const fileName = basename(filePath);
  
  // Only process .txt, .md, or .json files
  if (!['.txt', '.md', '.json'].includes(ext)) {
    return;
  }

  // Skip if already processed
  if (processedFiles.has(filePath)) {
    return;
  }

  console.log(`\n📄 New file detected: ${fileName}`);
  
  try {
    // Mark as processing
    processedFiles.add(filePath);
    
    // Read file content
    const content = await readFile(filePath, 'utf-8');
    
    // Parse question from file
    console.log('📝 Parsing question...');
    const questionData = await parseQuestionFile(content, fileName);
    
    if (!questionData) {
      console.log('❌ Failed to parse question file');
      return;
    }
    
    console.log(`✅ Parsed: ${questionData.title}`);
    console.log(`   Difficulty: ${questionData.difficulty}`);
    console.log(`   Tags: ${questionData.tags.join(', ')}`);
    
    // Generate test cases using AI
    console.log('🤖 Generating test cases with AI...');
    const testCases = await generateTestCases(questionData);
    
    if (!testCases || testCases.length === 0) {
      console.log('❌ Failed to generate test cases');
      return;
    }
    
    console.log(`✅ Generated ${testCases.length} test cases`);
    
    // Add test cases to question data
    questionData.testCases = testCases;
    
    // Upload to backend
    console.log('📤 Uploading to backend...');
    const result = await uploadProblem(questionData);
    
    if (result.success) {
      console.log(`✅ Successfully uploaded: ${result.problem.title}`);
      console.log(`   Problem ID: ${result.problem._id}`);
      console.log(`   Created at: ${new Date(result.problem.createdAt).toLocaleString()}`);
    } else {
      console.log(`❌ Upload failed: ${result.error}`);
      // Remove from processed set so it can be retried
      processedFiles.delete(filePath);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    // Remove from processed set so it can be retried
    processedFiles.delete(filePath);
  }
});

watcher.on('ready', () => {
  console.log('\n✅ MCP Server is ready and watching for new questions!');
  console.log('📋 Supported file formats: .txt, .md, .json');
  console.log('\n💡 Add a question file to the watched folder to auto-upload it!\n');
});

watcher.on('error', (error) => {
  console.error('❌ Watcher error:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MCP server...');
  watcher.close();
  process.exit(0);
});

