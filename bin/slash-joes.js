#!/usr/bin/env node
/**
 * /joes slash command handler v1.0.4
 * Routes joes.ai skill installer commands from Telegram
 * 
 * Usage:
 *   /joes install <skill-slug> [--level <level>] [--zip <path>] [--force]
 *   /joes doctor
 *   /joes inspect <skill-slug>
 * 
 * Telegram-native: If message has zip attachment, uses attachment (ignores --zip flag)
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const execAsync = promisify(exec);

async function main() {
    try {
        // Get command arguments (everything after /joes)
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            console.log('Usage: /joes <command> [options]\n');
            console.log('Commands:');
            console.log('  install <skill-slug>   Install a skill with joes.ai certification');
            console.log('    Options:');
            console.log('      --level <cert-level>  Certification level (default: install-verified)');
            console.log('      --zip <path>          Install from local zip file');
            console.log('      --force               Force reinstall');
            console.log('  doctor                 Show loader status and diagnostics');
            console.log('  inspect <skill-slug>   Show installed skill metadata\n');
            console.log('Examples:');
            console.log('  /joes install weather');
            console.log('  /joes install weather --level joes-ai-certified');
            console.log('  /joes install myskill --zip /path/to/skill.zip');
            console.log('  /joes doctor');
            console.log('  /joes inspect globalcontrol');
            return;
        }
        
        const command = args[0];
        
        // Route commands
        if (command === 'install') {
            // Extract skill slug and flags (everything after 'install')
            const installArgs = args.slice(1);
            
            // Build command for installer (pass args without the 'install' command word)
            const installerPath = path.join(__dirname, 'joes-skill-install.js');
            const cmd = `node "${installerPath}" ${installArgs.join(' ')}`;
            
            const { stdout, stderr } = await execAsync(cmd, {
                cwd: __dirname
            });
            
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            
        } else if (command === 'doctor') {
            const installerPath = path.join(__dirname, 'joes-skill-install.js');
            const cmd = `node "${installerPath}" --doctor`;
            
            const { stdout, stderr } = await execAsync(cmd, {
                cwd: __dirname
            });
            
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            
        } else if (command === 'inspect') {
            if (args.length < 2) {
                console.error('Usage: /joes inspect <skill-slug>');
                process.exit(1);
            }
            
            const skillSlug = args[1];
            const installerPath = path.join(__dirname, 'joes-skill-install.js');
            const cmd = `node "${installerPath}" --inspect ${skillSlug}`;
            
            const { stdout, stderr } = await execAsync(cmd, {
                cwd: __dirname
            });
            
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            
        } else {
            console.error(`Unknown command: ${command}`);
            console.error('Valid commands: install, doctor, inspect');
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`❌ Failed to run joes command: ${error.message}`);
        if (error.stdout) console.log(error.stdout);
        if (error.stderr) console.error(error.stderr);
        process.exit(1);
    }
}

main();
