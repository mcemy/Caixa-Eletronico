#!/usr/bin/env node

/**
 * Script de teste completo - inicia servidor e testa API
 */

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

console.log("ATM API - Teste Completo\n");

// Iniciar servidor
console.log("Iniciando servidor...");
const server = spawn("node", ["dist/index.js"], {
  cwd: __dirname,
  stdio: "pipe",
});

let serverOutput = "";
server.stdout.on("data", (data) => {
  serverOutput += data.toString();
  if (serverOutput.includes("rodando")) {
    console.log("[OK] Servidor iniciado com sucesso!\n");
    runTests();
  }
});

server.stderr.on("data", (data) => {
  console.error("Erro no servidor:", data.toString());
});

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers["Content-Length"] = Buffer.byteLength(bodyString);
    }

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log("=== TESTES DA API ===\n");

  const tests = [
    {
      name: "✓ Health Check",
      method: "GET",
      path: "/health",
      body: null,
      expectedStatus: 200,
    },
    {
      name: "✓ Saque 380 (sucesso)",
      method: "POST",
      path: "/api/saque",
      body: { valor: 380 },
      expectedStatus: 200,
    },
    {
      name: "✓ Saque 2 (sucesso)",
      method: "POST",
      path: "/api/saque",
      body: { valor: 2 },
      expectedStatus: 200,
    },
    {
      name: "✓ Saque 127 (sucesso)",
      method: "POST",
      path: "/api/saque",
      body: { valor: 127 },
      expectedStatus: 200,
    },
    {
      name: "✗ Saque 1 (inválido)",
      method: "POST",
      path: "/api/saque",
      body: { valor: 1 },
      expectedStatus: 400,
    },
    {
      name: "✗ Saque -100 (negativo)",
      method: "POST",
      path: "/api/saque",
      body: { valor: -100 },
      expectedStatus: 400,
    },
    {
      name: "✗ Saque sem valor",
      method: "POST",
      path: "/api/saque",
      body: {},
      expectedStatus: 400,
    },
    {
      name: "✗ Saque 100.5 (decimal)",
      method: "POST",
      path: "/api/saque",
      body: { valor: 100.5 },
      expectedStatus: 400,
    },
    {
      name: "✗ Rota não encontrada",
      method: "GET",
      path: "/api/xyz",
      body: null,
      expectedStatus: 404,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await makeRequest(test.method, test.path, test.body);

      if (result.status === test.expectedStatus) {
        console.log(`${test.name}`);
        console.log(`   Status: ${result.status} [OK]`);
        console.log(`   Resposta: ${JSON.stringify(result.body)}`);
        console.log();
        passed++;
      } else {
        console.log(`${test.name}`);
        console.log(
          `   Status: ${result.status} [ERRO] (esperado ${test.expectedStatus})`
        );
        console.log(`   Resposta: ${JSON.stringify(result.body)}`);
        console.log();
        failed++;
      }
    } catch (error) {
      console.log(`${test.name}`);
      console.log(`   Erro: ${error.message} [ERRO]`);
      console.log();
      failed++;
    }
  }

  console.log(`\nResultados: ${passed} passou, ${failed} falhou\n`);

  if (failed === 0) {
    console.log("TODOS OS TESTES PASSARAM!\n");
  } else {
    console.log("Alguns testes falharam.\n");
  }

  // Finalizar servidor
  server.kill();
  process.exit(failed > 0 ? 1 : 0);
}

// Timeout de segurança
setTimeout(() => {
  console.error("[ERRO] Timeout - servidor não respondeu");
  server.kill();
  process.exit(1);
}, 10000);
