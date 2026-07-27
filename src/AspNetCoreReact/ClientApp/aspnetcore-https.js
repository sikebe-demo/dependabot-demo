// This script sets up HTTPS for the application using the ASP.NET Core HTTPS certificate
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { argv, env, exit } from 'node:process';
import { fileURLToPath } from 'node:url';

const baseFolder =
  env.APPDATA !== undefined && env.APPDATA !== ''
    ? `${env.APPDATA}/ASP.NET/https`
    : `${env.HOME}/.aspnet/https`;

export function certificateFilePaths(name) {
  const certificateArg = argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
  const certificateName = name ?? (certificateArg ? certificateArg.groups.value : env.npm_package_name);

  if (!certificateName) {
    throw new Error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.');
  }

  return {
    certFilePath: path.join(baseFolder, `${certificateName}.pem`),
    keyFilePath: path.join(baseFolder, `${certificateName}.key`),
  };
}

export function ensureCertificate() {
  const { certFilePath, keyFilePath } = certificateFilePaths();

  if (existsSync(certFilePath) && existsSync(keyFilePath)) {
    return;
  }

  spawn('dotnet', [
    'dev-certs',
    'https',
    '--export-path',
    certFilePath,
    '--format',
    'Pem',
    '--no-password',
  ], { stdio: 'inherit' })
    .on('exit', (code) => exit(code));
}

// Only generate the certificate when executed directly (for example via `npm start`).
if (argv[1] && path.resolve(argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    ensureCertificate();
  } catch (error) {
    console.error(error.message);
    exit(-1);
  }
}
