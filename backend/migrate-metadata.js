import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';

// Helper to infer generic types for parameters
function inferGenericType(cppType, javaType) {
  if (!cppType) return 'integer';
  const clean = cppType.replace(/const\s+/, '').replace(/[&*]/g, '').trim();
  
  if (clean === 'int' || clean === 'long' || clean === 'long long') return 'integer';
  if (clean === 'vector<int>') return 'integer[]';
  if (clean === 'vector<vector<int>>') return 'integer[][]';
  if (clean === 'string' || clean === 'char') return 'string';
  if (clean === 'vector<string>' || clean === 'vector<char>') return 'string[]';
  if (clean === 'vector<vector<string>>') return 'string[][]';
  if (clean === 'bool') return 'boolean';
  if (clean === 'ListNode') return 'list';
  if (clean === 'TreeNode') return 'tree';
  if (clean === 'void') return 'void';
  
  // Fallback to javaType
  if (javaType) {
    const cleanJava = javaType.trim();
    if (cleanJava === 'int' || cleanJava === 'long') return 'integer';
    if (cleanJava === 'int[]') return 'integer[]';
    if (cleanJava === 'int[][]') return 'integer[][]';
    if (cleanJava === 'String' || cleanJava === 'char') return 'string';
    if (cleanJava === 'String[]' || cleanJava === 'char[]') return 'string[]';
    if (cleanJava === 'String[][]') return 'string[][]';
    if (cleanJava === 'boolean') return 'boolean';
    if (cleanJava === 'ListNode') return 'list';
    if (cleanJava === 'TreeNode') return 'tree';
  }
  
  return 'integer';
}

// Helper to infer generic return type
function inferGenericReturnType(cppType, javaType) {
  if (!cppType) return 'integer';
  const clean = cppType.replace(/const\s+/, '').replace(/[&*]/g, '').trim();
  
  if (clean === 'int' || clean === 'long' || clean === 'long long') return 'integer';
  if (clean === 'vector<int>') return 'integer[]';
  if (clean === 'vector<vector<int>>') return 'integer[][]';
  if (clean === 'string' || clean === 'char') return 'string';
  if (clean === 'vector<string>' || clean === 'vector<char>') return 'string[]';
  if (clean === 'vector<vector<string>>') return 'string[][]';
  if (clean === 'bool') return 'boolean';
  if (clean === 'ListNode') return 'list';
  if (clean === 'TreeNode') return 'tree';
  if (clean === 'void') return 'void';
  
  // Fallback to javaType
  if (javaType) {
    const cleanJava = javaType.trim();
    if (cleanJava === 'int' || cleanJava === 'long') return 'integer';
    if (cleanJava === 'int[]') return 'integer[]';
    if (cleanJava === 'int[][]') return 'integer[][]';
    if (cleanJava === 'String' || cleanJava === 'char') return 'string';
    if (cleanJava === 'String[]' || cleanJava === 'char[]') return 'string[]';
    if (cleanJava === 'String[][]') return 'string[][]';
    if (cleanJava === 'boolean') return 'boolean';
    if (cleanJava === 'ListNode') return 'list';
    if (cleanJava === 'TreeNode') return 'tree';
    if (cleanJava.startsWith('List<List<Integer>>') || cleanJava.startsWith('List<List<String>>')) return 'integer[][]'; // List of Lists
    if (cleanJava.startsWith('List<Integer>') || cleanJava.startsWith('List<String>')) return 'integer[]';
  }
  
  return 'integer';
}

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const batchesDir = path.join(process.cwd(), 'batches');
    const files = await fs.readdir(batchesDir);
    const batchFiles = files.filter(f => f.endsWith('.js'));
    console.log(`Found ${batchFiles.length} batch files in batches/`);

    let totalUpdated = 0;
    let totalSkipped = 0;
    let notFoundInDb = 0;

    for (const file of batchFiles) {
      const filePath = `./batches/${file}`;
      console.log(`\nProcessing batch file: ${file}`);
      const mod = await import(filePath);
      const problems = mod.default || mod.problems || [];

      for (const p of problems) {
        if (!p.slug) continue;

        let problemDoc = await Problem.findOne({ title: p.title });
        if (!problemDoc) {
          // Fallback matching by testCasesUrl ending with /slug/testcases.json
          problemDoc = await Problem.findOne({
            testCasesUrl: { $regex: new RegExp(`/${p.slug}/testcases.json$`, 'i') }
          });
        }

        if (!problemDoc) {
          console.warn(`  ⚠️ Problem not found in DB: ${p.title} (${p.slug})`);
          notFoundInDb++;
          continue;
        }

        // Build metadata
        const camelName = p.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const params = (p.args || []).map(arg => ({
          name: arg.name,
          type: inferGenericType(arg.cpp, arg.java)
        }));

        let cppRet = '';
        let javaRet = '';
        if (p.retType) {
          if (typeof p.retType === 'string') {
            cppRet = p.retType;
          } else {
            cppRet = p.retType.cpp || '';
            javaRet = p.retType.java || '';
          }
        }
        const returnType = inferGenericReturnType(cppRet, javaRet);

        const newMetaData = {
          name: camelName,
          params,
          return: { type: returnType }
        };

        // Check if metadata actually needs update to prevent unnecessary writes
        const currentMeta = problemDoc.metaData ? problemDoc.metaData.toObject() : null;
        const needsUpdate = !currentMeta || 
                            currentMeta.name !== newMetaData.name || 
                            JSON.stringify(currentMeta.return) !== JSON.stringify(newMetaData.return) ||
                            currentMeta.params.length !== newMetaData.params.length ||
                            currentMeta.params.some((param, idx) => param.name !== newMetaData.params[idx].name || param.type !== newMetaData.params[idx].type);

        if (needsUpdate) {
          problemDoc.metaData = newMetaData;
          await problemDoc.save();
          totalUpdated++;
          console.log(`  ✅ Updated: "${p.title}" -> name: ${camelName}, params: ${params.length}, return: ${returnType}`);
        } else {
          totalSkipped++;
        }
      }
    }

    console.log('\n======================================');
    console.log('🎉 METADATA MIGRATION COMPLETE');
    console.log(`Total problems updated: ${totalUpdated}`);
    console.log(`Total problems skipped (already correct): ${totalSkipped}`);
    console.log(`Total problems not found in DB: ${notFoundInDb}`);
    console.log('======================================');

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

runMigration();
