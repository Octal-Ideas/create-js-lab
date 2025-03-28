# create-js-lab

A modern CLI tool to create JavaScript labs with Vitest and ES modules.

## Installation

```bash
npm install -g create-js-lab
```

## Usage

```bash
# Create a new lab with modern setup
create-js-lab my-lab-name
```

This will create a new directory with a complete modern JavaScript lab structure:

```text
my-lab-name/
├── index.js                # Student solution file with ES modules
├── package.json            # With Vitest and testing tools
├── vitest.config.js        # Vitest configuration
├── README.md               # Instructions for students
├── solution.js             # For instructor reference
└── test/
    ├── setup.js            # Test environment setup
    └── index.test.js       # Test cases
```

## Features

- **ES Modules**: Uses modern JavaScript module system
- **Vitest**: Ultra-fast testing framework compatible with Jest syntax
- **Happy DOM**: Modern environment for DOM testing
- **Interactive UI**: Test UI for visualizing test results
- **Coverage Reports**: Built-in code coverage reporting
- **Zero Config**: Works out of the box with sensible defaults

## Options

- `--help`, `-h`: Show help information
- `--update`: Update to the latest version

## Example

```bash
# Create a new lab
create-js-lab variables-lab

# Navigate to the new lab directory
cd variables-lab

# Edit the test file to match your requirements
nano test/index.test.js

# Update the README with instructions
nano README.md

# Create your reference solution
nano solution.js
```

## Student Experience

Students will enjoy a modern development experience:

- **ES Modules**: Teaching modern import/export syntax
- **Fast Tests**: Lightning-fast test feedback with Vitest
- **Watch Mode**: Interactive development with `npm run test:watch`
- **Visual UI**: Beautiful test UI with `npm run test:ui`
- **Coverage**: Visual coverage reports with `npm run coverage`

## For Team Members

After creating a lab:

1. Update the tests in `test/index.test.js` to match your learning objectives
2. Update the README.md with clear instructions for students
3. Create a proper solution in solution.js (for your reference only)
4. Push to a Git repository
5. Share with students (remember to remove solution.js first)

## Why This Approach?

- **Modern**: Uses the latest tools and practices
- **Fast**: Vitest is significantly faster than Mocha/Jest
- **No Warnings**: No deprecated dependency warnings
- **Better DX**: Improved developer experience for both instructors and students
- **Future-Proof**: Teaches modern JavaScript practices

## License

MIT
