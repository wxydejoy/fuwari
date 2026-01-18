#!/usr/bin/env node
/* This is a script to bump the version number in package.json */

import fs from 'fs';
import { execSync } from 'child_process';

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return packageJson.version;
}

function bumpVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}

function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
}

function addToGit() {
  execSync('git add package.json', { stdio: 'inherit' });
}

// Get the version bump type from arguments (default: patch)
const args = process.argv.slice(2);
const bumpType = args[0] || 'patch';

// Validate bump type
const validTypes = ['major', 'minor', 'patch'];
if (!validTypes.includes(bumpType)) {
  console.error(`Error: Invalid bump type '${bumpType}'. Must be one of: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Execute version bump
const currentVersion = getCurrentVersion();
const newVersion = bumpVersion(currentVersion, bumpType);

console.log(`Bumping version from ${currentVersion} to ${newVersion} (${bumpType})`);

updatePackageJson(newVersion);
addToGit();

console.log(`Version bumped successfully!`);
