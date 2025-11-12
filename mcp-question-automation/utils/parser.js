/**
 * Parse question file content into structured data
 * Supports multiple formats: JSON, Markdown, Plain Text
 */

/**
 * Main parser function
 * @param {string} content - File content
 * @param {string} fileName - File name for context
 * @returns {Promise<Object>} Parsed question data
 */
export async function parseQuestionFile(content, fileName) {
  try {
    // Try JSON format first
    if (fileName.endsWith('.json')) {
      return parseJSON(content);
    }
    
    // Try Markdown format
    if (fileName.endsWith('.md')) {
      return parseMarkdown(content);
    }
    
    // Try plain text format
    return parsePlainText(content);
    
  } catch (error) {
    console.error('Parse error:', error.message);
    return null;
  }
}

/**
 * Parse JSON format
 */
function parseJSON(content) {
  const data = JSON.parse(content);
  
  return {
    title: data.title || 'Untitled Problem',
    description: data.description || '',
    difficulty: validateDifficulty(data.difficulty),
    tags: Array.isArray(data.tags) ? data.tags : [],
    constraints: data.constraints || '',
    examples: data.examples || [],
    functionSignature: data.functionSignature || {},
    timeLimit: data.timeLimit || 2000,
    memoryLimit: data.memoryLimit || 256,
    solutionLink: data.solutionLink || '',
    category: data.category || null
  };
}

/**
 * Parse Markdown format
 * Expected format:
 * # Title
 * ## Difficulty: Easy/Medium/Hard
 * ## Description
 * ...
 * ## Examples
 * ...
 * ## Constraints
 * ...
 */
function parseMarkdown(content) {
  const lines = content.split('\n');
  const data = {
    title: '',
    description: '',
    difficulty: 'Medium',
    tags: [],
    constraints: '',
    examples: [],
    functionSignature: {},
    timeLimit: 2000,
    memoryLimit: 256
  };
  
  let currentSection = '';
  let descriptionLines = [];
  let constraintsLines = [];
  let exampleBuffer = [];
  
  for (let line of lines) {
    line = line.trim();
    
    // Title (# Title)
    if (line.startsWith('# ') && !data.title) {
      data.title = line.substring(2).trim();
      continue;
    }
    
    // Difficulty
    if (line.toLowerCase().includes('difficulty:')) {
      const match = line.match(/difficulty:\s*(easy|medium|hard)/i);
      if (match) {
        data.difficulty = validateDifficulty(match[1]);
      }
      continue;
    }
    
    // Tags
    if (line.toLowerCase().includes('tags:')) {
      const tagsStr = line.split(':')[1];
      if (tagsStr) {
        data.tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
      }
      continue;
    }
    
    // Section headers
    if (line.startsWith('## ')) {
      currentSection = line.substring(3).toLowerCase().trim();
      continue;
    }
    
    // Content based on section
    if (currentSection === 'description') {
      if (line) descriptionLines.push(line);
    } else if (currentSection === 'constraints') {
      if (line) constraintsLines.push(line);
    } else if (currentSection.includes('example')) {
      if (line) exampleBuffer.push(line);
    }
  }
  
  data.description = descriptionLines.join('\n');
  data.constraints = constraintsLines.join('\n');
  
  // Parse examples
  data.examples = parseExamplesFromText(exampleBuffer.join('\n'));
  
  // Extract title from first line if not found
  if (!data.title && lines.length > 0) {
    data.title = lines[0].replace(/^#+\s*/, '').trim();
  }
  
  return data;
}

/**
 * Parse plain text format
 * Simple format with key-value pairs
 */
function parsePlainText(content) {
  const lines = content.split('\n');
  const data = {
    title: '',
    description: '',
    difficulty: 'Medium',
    tags: [],
    constraints: '',
    examples: [],
    functionSignature: {},
    timeLimit: 2000,
    memoryLimit: 256
  };
  
  let descriptionLines = [];
  let inDescription = false;
  
  for (let line of lines) {
    line = line.trim();
    
    if (line.toLowerCase().startsWith('title:')) {
      data.title = line.substring(6).trim();
    } else if (line.toLowerCase().startsWith('difficulty:')) {
      const diff = line.substring(11).trim();
      data.difficulty = validateDifficulty(diff);
    } else if (line.toLowerCase().startsWith('tags:')) {
      const tagsStr = line.substring(5).trim();
      data.tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
    } else if (line.toLowerCase().startsWith('description:')) {
      inDescription = true;
      const desc = line.substring(12).trim();
      if (desc) descriptionLines.push(desc);
    } else if (line.toLowerCase().startsWith('constraints:')) {
      inDescription = false;
      data.constraints = line.substring(12).trim();
    } else if (inDescription && line) {
      descriptionLines.push(line);
    }
  }
  
  data.description = descriptionLines.join('\n');
  
  // Use first line as title if not found
  if (!data.title && lines.length > 0) {
    data.title = lines[0].trim();
  }
  
  return data;
}

/**
 * Parse examples from text
 */
function parseExamplesFromText(text) {
  const examples = [];
  const exampleBlocks = text.split(/example\s+\d+/i).filter(b => b.trim());
  
  for (const block of exampleBlocks) {
    const inputMatch = block.match(/input:\s*(.+?)(?=output:|$)/is);
    const outputMatch = block.match(/output:\s*(.+?)(?=explanation:|$)/is);
    const explanationMatch = block.match(/explanation:\s*(.+?)$/is);
    
    if (inputMatch && outputMatch) {
      examples.push({
        input: inputMatch[1].trim(),
        output: outputMatch[1].trim(),
        explanation: explanationMatch ? explanationMatch[1].trim() : ''
      });
    }
  }
  
  return examples;
}

/**
 * Validate and normalize difficulty
 */
function validateDifficulty(difficulty) {
  const normalized = String(difficulty).toLowerCase();
  
  if (normalized.includes('easy')) return 'Easy';
  if (normalized.includes('hard')) return 'Hard';
  return 'Medium';
}

