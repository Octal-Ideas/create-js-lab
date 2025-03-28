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
create-js-lab - A simple tool to create JavaScript labs with testing structure

Usage:
  create-js-lab [lab-name] [options]

Options:
  --help, -h       Show this help message
  --update         Update to the latest version
  --compat, -c     Use compatibility mode with original dependencies

Examples:
  create-js-lab variables-lab            # Create lab with modern dependencies
  create-js-lab variables-lab --compat   # Create lab with original dependencies for compatibility

Note:
  Compatibility mode uses older dependencies that will show npm warnings but
  maintains maximum compatibility with existing Learn.co labs.
  `);
  process.exit(0);
}

// Get lab name from command line arguments
const labName = process.argv[2];

// Check for compatibility mode flag
const compatMode =
  process.argv.includes("--compat") || process.argv.includes("-c");

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
if (compatMode) {
  console.log(
    "Using compatibility mode with original dependencies (will show warnings)"
  );
}

// Create main directory
fs.mkdirSync(labDir, { recursive: true });
fs.mkdirSync(path.join(labDir, "test"), { recursive: true });

// Create package.json with appropriate dependencies
let packageJson;

if (compatMode) {
  // Original dependencies for compatibility
  packageJson = {
    name: labName,
    version: "1.0.0",
    description: "JavaScript Lab",
    main: "index.js",
    scripts: {
      test: "mocha --timeout 5000 -R mocha-multi --reporter-options spec=-,json=.results.json",
    },
    keywords: ["javascript", "lab"],
    author: "Your Name",
    license: "MIT",
    devDependencies: {
      "babel-core": "6.26.3",
      "babel-preset-env": "1.7.0",
      chai: "4.1.2",
      jsdom: "9.2.1",
      mocha: "5.2.0",
      "mocha-jsdom": "~1.1.0",
      "mocha-multi": "1.0.1",
      "chai-spies-next": "^0.9.3",
    },
    dependencies: {
      sinon: "^7.3.2",
    },
  };
} else {
  // Modern dependencies
  packageJson = {
    name: labName,
    version: "1.0.0",
    description: "JavaScript Lab",
    main: "index.js",
    scripts: {
      test: "mocha --timeout 5000",
    },
    keywords: ["javascript", "lab"],
    author: "Your Name",
    license: "MIT",
    devDependencies: {
      "@babel/core": "^7.22.10",
      "@babel/preset-env": "^7.22.10",
      chai: "^4.3.7",
      jsdom: "^22.1.0",
      mocha: "^10.2.0",
      sinon: "^16.0.0",
    },
  };
}

fs.writeFileSync(
  path.join(labDir, "package.json"),
  JSON.stringify(packageJson, null, 2)
);

// Create empty index.js
fs.writeFileSync(
  path.join(labDir, "index.js"),
  "// Write your solution here\n"
);

// Create test helper
const helpersContent = compatMode
  ? `const chai = require('chai');
global.expect = chai.expect;

// Load the student's code
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Support for DOM testing
require('jsdom-global')();

// Read the student's code
const code = fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf-8');

// Create a sandbox to run the code
const sandbox = {};
const script = new vm.Script(code);
const context = vm.createContext(sandbox);

// Run the code in the sandbox
script.runInContext(context);

// Make variables from the student's code available globally for tests
Object.keys(sandbox).forEach(key => {
  global[key] = sandbox[key];
});`
  : `const chai = require('chai');
global.expect = chai.expect;

// Load JSDOM for browser-like environment if needed
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

// Set up browser environment globals
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Load the student's code
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Read the student's code
const code = fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf-8');

// Create a sandbox with browser globals
const sandbox = {
  window: global.window,
  document: global.document,
  navigator: global.navigator,
  console: console
};

// Run the code in the sandbox
const script = new vm.Script(code);
const context = vm.createContext(sandbox);
script.runInContext(context);

// Make variables from the student's code available globally for tests
Object.keys(sandbox).forEach(key => {
  if (!['window', 'document', 'navigator', 'console'].includes(key)) {
    global[key] = sandbox[key];
  }
});`;

fs.writeFileSync(path.join(labDir, "test", "helpers.js"), helpersContent);

// Create test file template
const testContent = compatMode
  ? `require('./helpers.js');

const fs = require('fs');
const path = require('path');

// Get the student's code for regex testing
const js = fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf-8');

describe('index.js', function () {
  // Add your test cases here
  describe('exampleVariable', function () {
    it('should be defined', function () {
      expect(typeof exampleVariable).to.not.equal('undefined');
    });
    
    it('should have the correct value', function () {
      expect(exampleVariable).to.equal('example value');
    });
  });

  // Add more test cases as needed
});`
  : `require('./helpers.js');

const fs = require('fs');
const path = require('path');

// Get the student's code for regex testing
const js = fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf-8');

describe('index.js', function () {
  // Add your test cases here
  describe('exampleVariable', function () {
    it('should be defined', function () {
      expect(typeof exampleVariable).to.not.equal('undefined');
    });
    
    it('should have the correct value', function () {
      expect(exampleVariable).to.equal('example value');
    });
  });

  describe('DOM tests (if needed)', function() {
    // Uncomment below for DOM tests
    // it('should update the DOM correctly', function() {
    //   // Your DOM-related tests here
    //   document.body.innerHTML = '<div id="test"></div>';
    //   expect(document.getElementById('test')).to.exist;
    // });
  });

  // Add more test cases as needed
});`;

fs.writeFileSync(path.join(labDir, "test", "indexTest.js"), testContent);

// Create README template
const readmeContent = `# JavaScript Lab

## Learning Goals

- Add your learning goals here

## Instructions

In this lab, we'll practice JavaScript concepts.

### Getting Started

1. Fork and clone this repository
2. Run \`npm install\` to install dependencies
3. Open the project in your code editor

### Your Task

Edit the \`index.js\` file according to the test requirements.

### Running the Tests

Run the tests with:

\`\`\`bash
npm test
\`\`\`

All tests should pass when you've completed the lab correctly.

## Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
`;

fs.writeFileSync(path.join(labDir, "README.md"), readmeContent);

// Create solution file template
fs.writeFileSync(
  path.join(labDir, "solution.js"),
  '// Add your solution here\n// This file is for instructor reference only\n\nconst exampleVariable = "example value";'
);

// Create .gitignore
const gitignoreContent = `node_modules/
.DS_Store
package-lock.json
`;

fs.writeFileSync(path.join(labDir, ".gitignore"), gitignoreContent);

// Install dependencies
try {
  console.log("Installing dependencies...");
  process.chdir(labDir);
  execSync("npm install", { stdio: "inherit" });
  console.log(`\n✅ Lab "${labName}" created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Navigate to the lab directory: cd ${labName}`);
  console.log(`2. Edit test/indexTest.js to add your test cases`);
  console.log(`3. Update README.md with lab instructions`);
  console.log(`4. Create a proper solution in solution.js`);
} catch (error) {
  console.error("Error installing dependencies:", error.message);
}
