import { spawn } from 'child_process';

/**
 * Execute a Docker CLI command and return the output.
 * Wraps child_process.spawn for cleaner async/await usage.
 */
export async function execDocker(
  args: string[],
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const proc = spawn('docker', args, {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? 1,
      });
    });

    proc.on('error', (err) => {
      resolve({
        stdout: '',
        stderr: err.message,
        exitCode: 1,
      });
    });
  });
}

/**
 * Stream Docker command output in real-time.
 * Used for build operations where we want live logs.
 */
export async function execDockerWithStream(
  args: string[],
  onOutput: (line: string) => void,
): Promise<{ exitCode: number; error?: string }> {
  return new Promise((resolve) => {
    const proc = spawn('docker', args, {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let lastError = '';

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      lines.forEach(onOutput);
    });

    proc.stderr.on('data', (data) => {
      const text = data.toString();
      lastError = text;
      // Docker build outputs progress to stderr, so stream it too
      const lines = text.split('\n').filter(Boolean);
      lines.forEach(onOutput);
    });

    proc.on('close', (code) => {
      resolve({
        exitCode: code ?? 1,
        error: code !== 0 ? lastError : undefined,
      });
    });

    proc.on('error', (err) => {
      resolve({
        exitCode: 1,
        error: err.message,
      });
    });
  });
}

/**
 * Check if Docker is available on the system.
 */
export async function isDockerAvailable(): Promise<boolean> {
  const result = await execDocker(['version', '--format', '{{.Server.Version}}']);
  return result.exitCode === 0 && result.stdout.length > 0;
}
