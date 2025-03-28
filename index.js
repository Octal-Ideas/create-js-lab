#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Check for update command
if (process.argv[2] === "--update") {
  console.log("Updating create-js-lab...");
  try {
    execSync("npm install -g create-js-lab@latest", { stdio: "inherit" });
    console.log("✅ Successfully updated to the latest version!");
  } catch (error) {
    console.error("Error updating create-js-lab:", error.message);
  }
  process.exit(0);
}

// Show help
if (process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log(`
create-js-lab - A modern tool to create JavaScript labs with Vitest testing

Usage:
  create-js-lab [lab-name] [options]

Options:
  --help, -h       Show this help message
  --update         Update to the latest version

Examples:
  create-js-lab variables-lab            # Create lab with modern setup
  `);
  process.exit(0);
}

// Get lab name from command line arguments
const labName = process.argv[2];

if (!labName) {
  console.error("Please provide a lab name: create-js-lab lab-name");
  console.log("Run create-js-lab --help for more information");
  process.exit(1);
}

const labDir = path.join(process.cwd(), labName);

// Check if directory already exists
if (fs.existsSync(labDir)) {
  console.error(`Error: Directory "${labName}" already exists`);
  process.exit(1);
}

console.log(`Creating new JavaScript lab: ${labName}...`);

// Create main directory
fs.mkdirSync(labDir, { recursive: true });
fs.mkdirSync(path.join(labDir, "test"), { recursive: true });

// Create package.json with secure, modern dependencies
const packageJson = {
  name: labName,
  version: "1.0.0",
  description: "Modern JavaScript Lab",
  main: "index.js",
  type: "module",
  scripts: {
    test: "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    coverage: "vitest run --coverage",
  },
  keywords: ["javascript", "lab"],
  author: "Principal Kelvo",
  license: "MIT",
  devDependencies: {
    vitest: "^1.0.1",
    "happy-dom": "^12.10.3",
    "@vitest/ui": "^1.0.1",
    "@vitest/coverage-v8": "^1.0.1",
  },
};

fs.writeFileSync(
  path.join(labDir, "package.json"),
  JSON.stringify(packageJson, null, 2)
);

// Create empty index.js
fs.writeFileSync(
  path.join(labDir, "index.js"),
  "// Write your solution here using modern JavaScript\n\n// Example:\nexport const exampleVariable = 'example value';\n\n// Add your code below:\n"
);

// Create vitest.config.js
const vitestConfig = `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom', // Modern browser-like environment
    globals: true, // Allows using expect without importing
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})`;

fs.writeFileSync(path.join(labDir, "vitest.config.js"), vitestConfig);

// Create test setup
const setupTestContent = `// test/setup.js
import { beforeEach } from 'vitest';
import { window } from 'happy-dom';

// Setup global browser environment for tests
beforeEach(() => {
  // Reset the DOM before each test
  document.body.innerHTML = '';
});

// Export any test utilities you might need
export function createTestElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
  return div;
}
`;

fs.writeFileSync(path.join(labDir, "test", "setup.js"), setupTestContent);

// Create test file template
const testContent = `// test/index.test.js
import { describe, it, expect } from 'vitest';
import { exampleVariable } from '../index.js';
import { createTestElement } from './setup.js';

describe('index.js', () => {
  // Add your test cases here
  describe('exampleVariable', () => {
    it('should be defined', () => {
      expect(exampleVariable).toBeDefined();
    });
    
    it('should have the correct value', () => {
      expect(exampleVariable).toBe('example value');
    });
  });

  describe('DOM tests (if needed)', () => {
    it('example DOM test - can be removed if not needed', () => {
      // Create a test element
      const element = createTestElement('<div id="test">Test Content</div>');
      
      // Test DOM manipulation
      expect(document.getElementById('test')).toBeDefined();
      expect(document.getElementById('test').textContent).toBe('Test Content');
    });
  });

  // Add more test cases as needed
});`;

fs.writeFileSync(path.join(labDir, "test", "index.test.js"), testContent);

// Create README template
const readmeContent = `# Modern JavaScript Lab

## Learning Goals

- Add your learning goals here

## Instructions

In this lab, we'll practice modern JavaScript concepts using ES modules and the latest testing tools.

### Getting Started

1. Fork and clone this repository
2. Run \`npm install\` to install dependencies
3. Open the project in your code editor

### Your Task

Edit the \`index.js\` file according to the test requirements. This lab uses ES modules, so make sure to:

- Use \`export\` for any variables, functions, or classes that need to be tested
- Write clean, modern JavaScript (ES6+ features encouraged)

### Running the Tests

Run the tests with:

\`\`\`bash
npm test
\`\`\`

For interactive testing during development:

\`\`\`bash
npm run test:watch
\`\`\`

For a visual UI for tests:

\`\`\`bash
npm run test:ui
\`\`\`

To check test coverage:

\`\`\`bash
npm run coverage
\`\`\`

All tests should pass when you've completed the lab correctly.

## Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [Vitest Documentation](https://vitest.dev/)
- [Modern JS Cheatsheet](https://github.com/mbeaudru/modern-js-cheatsheet)
`;

fs.writeFileSync(path.join(labDir, "README.md"), readmeContent);

// Create solution file template
fs.writeFileSync(
  path.join(labDir, "solution.js"),
  `// Solution for instructor reference only
// This file should not be included in the student repository

// Example solution:
export const exampleVariable = "example value";

// Add the rest of your solution below:

`
);

// Create .gitignore
const gitignoreContent = `node_modules/
.DS_Store
package-lock.json
coverage/
.vite/
.vitest/
dist/
solution.js
`;

fs.writeFileSync(path.join(labDir, ".gitignore"), gitignoreContent);

// Create .npmrc to avoid audit warnings
const npmrcContent = `audit=false
`;

fs.writeFileSync(path.join(labDir, ".npmrc"), npmrcContent);

// Install dependencies
try {
  console.log("Installing dependencies...");
  process.chdir(labDir);
  execSync("npm install", { stdio: "inherit" });
  console.log(`\n✅ Lab "${labName}" created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Navigate to the lab directory: cd ${labName}`);
  console.log(`2. Edit test/index.test.js to add your test cases`);
  console.log(`3. Update README.md with lab instructions`);
  console.log(`4. Create a proper solution in solution.js`);
  console.log(`\nModern features:`);
  console.log(`- ES Modules support (import/export)`);
  console.log(`- Vitest for fast, modern testing`);
  console.log(`- Happy DOM for browser environment testing`);
  console.log(`- Interactive test UI with 'npm run test:ui'`);
  console.log(`- Test coverage reports with 'npm run coverage'`);
} catch (error) {
  console.error("Error installing dependencies:", error.message);
}
