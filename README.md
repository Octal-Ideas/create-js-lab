# create-js-lab

A simple CLI tool to create JavaScript labs with automated testing structure.

## Installation

```bash
npm install -g create-js-lab
```

## Usage

```bash
create-js-lab my-lab-name
```

This will create a new directory with the following structure:

```text
my-lab-name/
├── index.js          # Empty file for students to complete
├── package.json      # With testing dependencies
├── README.md         # Instructions template
├── solution.js       # For instructor reference
└── test/
    ├── helpers.js    # Testing helpers
    └── indexTest.js  # Test cases
```

## Features

- **Instant setup**: Create a complete lab structure with a single command
- **Testing framework**: Includes Mocha and Chai for automated testing
- **Student-ready**: Just customize the tests and README, then share with students
- **Instructor tools**: Includes a separate solution file for reference

## Options

- `--help`, `-h`: Show help information
- `--update`: Update to the latest version

## Example

```bash
# Create a new lab called "variables-lab"
create-js-lab variables-lab

# Navigate to the new lab directory
cd variables-lab

# Edit the test file to match your requirements
nano test/indexTest.js

# Update the README with instructions
nano README.md

# Create your reference solution
nano solution.js
```

## For Team Members

After creating a lab:

1. Update the tests in `test/indexTest.js` to match your learning objectives
2. Update the README.md with clear instructions for students
3. Create a proper solution in solution.js (for your reference only)
4. Push to a Git repository
5. Share with students, but remember to remove solution.js first

## License

MIT
