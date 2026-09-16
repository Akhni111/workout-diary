/**
 * Push to GitHub Helper
 * Usage:
 *   node git-push.js <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
 * Or run standard git command:
 *   git push -u origin main
 */
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';

const dir = process.cwd();
const token = process.argv[2] || process.env.GITHUB_TOKEN;

async function push() {
  console.log('Pushing main branch to https://github.com/Akhni111/workout-diary.git ...');

  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      onAuth: () => {
        if (token) {
          return { username: token };
        }
        return undefined;
      }
    });
    console.log('✅ Push to GitHub successful!', pushResult);
  } catch (err) {
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      console.log('\n🔒 GitHub ต้องการการยืนยันตัวตน (Authentication):');
      console.log('วิธีที่ 1: รันคำสั่งพร้อมใส่ GitHub Personal Access Token:');
      console.log('   node git-push.js ghp_xxxxxxxxxxxxxxxxxxxx\n');
      console.log('วิธีที่ 2: รันผ่าน Git CLI (หากมี Git ในเครื่อง):');
      console.log('   git push -u origin main\n');
    } else {
      console.error('Error:', err.message);
    }
  }
}

push();
