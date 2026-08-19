import { spawn } from "node:child_process";
import net from "node:net";

const host = "127.0.0.1";
const requestedPort = Number(process.env.PORT ?? 0);

function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(requestedPort, host, () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : 0;
      probe.close(() => resolve(port));
    });
  });
}

const port = await getFreePort();
const server = spawn("pnpm", ["exec", "tsx", "server/_core/index.ts"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development", PORT: String(port) },
});

function waitForPort(timeoutMs = 30_000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const probe = () => {
      const socket = net.createConnection({ host, port });
      socket.once("connect", () => { socket.destroy(); resolve(); });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() >= deadline) reject(new Error(`Server did not start on ${host}:${port}`));
        else setTimeout(probe, 250);
      });
    };
    probe();
  });
}

try {
  await waitForPort();
  const test = spawn("pnpm", ["exec", "vitest", "run", "server/integration.test.ts"], {
    stdio: "inherit",
    env: { ...process.env, INTEGRATION_BASE_URL: `http://${host}:${port}` },
  });
  const exitCode = await new Promise((resolve) => test.once("exit", (code) => resolve(code ?? 1)));
  process.exitCode = exitCode;
} finally {
  server.kill("SIGTERM");
}
