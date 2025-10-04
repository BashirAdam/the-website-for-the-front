const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Wadi Hawar CMS Backend...');

// Change to the Strapi directory
process.chdir(path.join(__dirname, 'wadi-hawar-cms'));

// Start Strapi in development mode
const strapi = spawn('npm', ['run', 'develop'], {
  stdio: 'inherit',
  shell: true
});

strapi.on('close', (code) => {
  console.log(`Strapi process exited with code ${code}`);
});

strapi.on('error', (err) => {
  console.error('Failed to start Strapi:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Strapi...');
  strapi.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Strapi...');
  strapi.kill('SIGTERM');
  process.exit(0);
});
