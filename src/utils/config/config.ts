import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envConfigPath = path.resolve(process.cwd(), 'config/.env.config');
const envDefaultPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envConfigPath)) {
  dotenv.config({ path: envConfigPath, override: true });
} else if (fs.existsSync(envDefaultPath)) {
  dotenv.config({ path: envDefaultPath, override: true });
}

console.log('Loaded SMTP env:', {
  envFile: fs.existsSync(envConfigPath) ? envConfigPath : fs.existsSync(envDefaultPath) ? envDefaultPath : 'none',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL,
});

const config = {
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'your_email@example.com',
        pass: process.env.SMTP_PASS || 'your_email_password',
      },
    },
    from: process.env.SMTP_USER,
  },
  clientUrl: process.env.FRONTEND_URL || 'http://localhost:3000/api/v1',
};

export default config;
