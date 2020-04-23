let child_process = require('child_process');

for (let i = 0; i < 10; i++) {
    let process = child_process.spawn('node', ['./tests/trafficTestThread.js']);
    process.stdout.on('data', function(data) { console.log(`thread ${i+1} -> ${data}`) })    
}