#!/usr/bin/env node

/**
 * Start All Services - Appointment System
 * 
 * Usage: node start-all-services.js
 * 
 * This script starts all microservices and frontends in child processes.
 * Output from all services is displayed in the console with colored prefixes.
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Services configuration
const services = [
  {
    name: 'API Gateway',
    path: 'api-gateway',
    command: 'npm',
    args: ['start'],
    port: 3000,
    color: colors.cyan,
  },
  {
    name: 'User Service',
    path: 'user-service',
    command: 'npm',
    args: ['start'],
    port: 3001,
    color: colors.green,
  },
  {
    name: 'Doctor Service',
    path: 'doctor-service',
    command: 'npm',
    args: ['start'],
    port: 3002,
    color: colors.blue,
  },
  {
    name: 'Appointment Service',
    path: 'appointment-service',
    command: 'npm',
    args: ['start'],
    port: 3003,
    color: colors.magenta,
  },
  {
    name: 'Feedback Service',
    path: 'feedback-service',
    command: 'npm',
    args: ['start'],
    port: 3004,
    color: colors.yellow,
  },
  {
    name: 'Admin Frontend',
    path: 'admin',
    command: 'npm',
    args: ['run', 'dev'],
    port: 5173,
    color: colors.white,
  },
  {
    name: 'User Frontend',
    path: 'userFrontend/appointment',
    command: 'npm',
    args: ['run', 'dev'],
    port: 5174,
    color: colors.bright,
  },
];

const baseDir = __dirname;
const processes = [];

console.log(`\n${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════╗
║     Appointment System - Starting All Services               ║
║                                                              ║
║  Shutting down: Press Ctrl+C to stop all services            ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

// Start each service
services.forEach((service, index) => {
  const serviceDir = path.join(baseDir, service.path);
  
  console.log(`${colors.bright}[${index + 1}/${services.length}]${colors.reset} Starting ${service.name}...`);
  
  const child = spawn(service.command, service.args, {
    cwd: serviceDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  // Handle output with color
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]${colors.reset} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${colors.red}[${service.name} ERROR]${colors.reset} ${line}`);
      }
    });
  });

  child.on('error', (err) => {
    console.error(`${colors.red}Failed to start ${service.name}:${colors.reset}`, err.message);
  });

  child.on('close', (code) => {
    console.log(`${colors.yellow}[${service.name}] Stopped (code: ${code})${colors.reset}`);
  });

  processes.push({ name: service.name, process: child, port: service.port });
});

// Wait a bit before showing the ready message
setTimeout(() => {
  console.log(`\n${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════╗
║           🎉 All Services Started Successfully!              ║
╚══════════════════════════════════════════════════════════════╝

${colors.cyan}📍 Frontend Access Points:${colors.reset}
  • Admin Dashboard: http://localhost:5173
  • User Frontend:   http://localhost:5174

${colors.cyan}🔌 Backend Services:${colors.reset}
  • API Gateway:        http://localhost:3000
  • User Service:       http://localhost:3001
  • Doctor Service:     http://localhost:3002
  • Appointment Service: http://localhost:3003
  • Feedback Service:   http://localhost:3004

${colors.cyan}📝 Service Status:${colors.reset}
`);

  processes.forEach(p => {
    const status = p.process.killed ? '❌ Stopped' : '✅ Running';
    console.log(`  ${p.name.padEnd(25)} ${status.padEnd(12)} (port: ${p.port})`);
  });

  console.log(`\n${colors.bright}Ready to use! ${colors.reset}\n`);
}, 3000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down all services...${colors.reset}\n`);
  
  processes.forEach(p => {
    p.process.kill();
  });

  setTimeout(() => {
    console.log(`${colors.green}All services stopped.${colors.reset}`);
    process.exit(0);
  }, 2000);
});

process.on('SIGHUP', () => {
  processes.forEach(p => p.process.kill());
  process.exit(0);
});
