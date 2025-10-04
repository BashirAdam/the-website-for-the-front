const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Wadi Hawar Democratic Front Website...');
console.log('📁 Project Structure:');
console.log('   Frontend: HTML/CSS/JS with Tailwind');
console.log('   Backend: Strapi CMS with Arabic support');
console.log('   API: RESTful API for content management');
console.log('');

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend', 'wadi-hawar-cms');
if (!fs.existsSync(backendPath)) {
    console.error('❌ Backend directory not found. Please run the setup first.');
    console.log('💡 Run: cd backend && npx create-strapi-app@latest wadi-hawar-cms --quickstart --no-run');
    process.exit(1);
}

// Start the backend server
console.log('🔧 Starting Backend CMS Server...');
console.log('   URL: http://localhost:1337');
console.log('   Admin: http://localhost:1337/admin');
console.log('');

const backend = spawn('node', ['start-server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
});

backend.on('error', (err) => {
    console.error('❌ Failed to start backend:', err);
    process.exit(1);
});

// Instructions for frontend
setTimeout(() => {
    console.log('');
    console.log('🌐 Frontend Instructions:');
    console.log('   1. Open the frontend/index.html file in your browser');
    console.log('   2. Or use a local server like Live Server extension');
    console.log('   3. The frontend will automatically connect to the backend API');
    console.log('');
    console.log('📝 Admin Panel Setup:');
    console.log('   1. Go to: http://localhost:1337/admin');
    console.log('   2. Create your admin account');
    console.log('   3. Start adding content in Arabic!');
    console.log('');
    console.log('✨ Your Arabic news website is ready!');
    console.log('   Press Ctrl+C to stop the server');
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill('SIGTERM');
    process.exit(0);
});
