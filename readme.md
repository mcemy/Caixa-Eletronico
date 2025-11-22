# ATM API - Caixa Eletrônico

API REST que simula um caixa eletrônico. Calcula a quantidade mínima de cédulas necessárias para compor um valor de saque usando algoritmo greedy.

**Cédulas:** 100, 50, 20, 10, 5, 2

## Início Rápido

```bash
npm install
npm run build
npm run start
# Servidor em http://localhost:5000
```

## Como Usar

### Health Check

```bash
curl http://localhost:5000/health
# {"status":"ok"}
```

### Saque - Exemplos

```bash
# Saque de 380 → 6 cédulas
curl -X POST http://localhost:5000/api/saque \
  -H "Content-Type: application/json" \
  -d '{"valor": 380}'
# {"100":3,"50":1,"20":1,"10":1,"5":0,"2":0}

# Saque de 100 → 1 cédula
curl -X POST http://localhost:5000/api/saque \
  -H "Content-Type: application/json" \
  -d '{"valor": 100}'

# Saque de 2 → 1 cédula
curl -X POST http://localhost:5000/api/saque \
  -H "Content-Type: application/json" \
  -d '{"valor": 2}'

# Erro: valor inválido
curl -X POST http://localhost:5000/api/saque \
  -H "Content-Type: application/json" \
  -d '{"valor": 1}'
# {"error":"Valor 1 não pode ser sacado com as cédulas disponíveis"}
```

## Validações

- Campo `valor` obrigatório
- Deve ser número inteiro
- Deve ser positivo
- Impossíveis: 1, 3, 11, 13, 15, 17, 19...

## Algoritmo

Greedy: itera de maior para menor denominação, usando máximo possível em cada etapa.

```text
Para 380:
380 ÷ 100 = 3 → Resta 80
 80 ÷ 50  = 1 → Resta 30
 30 ÷ 20  = 1 → Resta 10
 10 ÷ 10  = 1 → Resta 0

Resultado: 3 + 1 + 1 + 1 = 6 cédulas (mínimo)
```

## Testes

```bash
npm test              # Unitários (11)
npm run test:api      # Integração (9) + servidor
npm run test:watch    # Watch mode
```

## Scripts

| Comando            | Descrição                   |
| ------------------ | --------------------------- |
| `npm run dev`      | Desenvolvimento com ts-node |
| `npm run build`    | Compilar TypeScript         |
| `npm start`        | Servidor produção           |
| `npm test`         | Testes unitários            |
| `npm run test:api` | Testes + servidor           |

## Estrutura

```text
src/
  ├── index.ts              # Server Express
  ├── calculateWithdrawal.ts # Algoritmo greedy
  └── middleware.ts         # Validação
tests/
  └── calculateWithdrawal.test.ts # 11 testes
dist/                # Build compilado
```

## Stack

- **TypeScript 5.9** - Type safety
- **Express 4.18** - Framework
- **Jest 29.7** - Testes
- **Node.js 16+**

## Fluxo de Requisição

```
POST /api/saque
     ↓
validateWithdrawalRequest (middleware)
     ↓
calculateWithdrawal (algoritmo)
     ↓
Response JSON
```

## Desafios Enfrentados

1. **Garantir que o TypeScript entenda os tipos de dado corretamente**

   - Problema: TypeScript é rigoroso e não aceita tipos imprecisos (tipo `any`)
   - Solução: Definir interfaces claras (`WithdrawalResult`, `ValidatedRequest`) e usar tipos específicos em cada função

2. **Validar dados de entrada em camadas**

   - Problema: Não basta receber um número, precisa certificar que é inteiro, positivo e obrigatório
   - Solução: Criar middleware que valida: se existe → se é número → se é inteiro → se é positivo

3. **Alguns valores não podem ser sacados**

   - Problema: Com cédulas de 100, 50, 20, 10, 5, 2, alguns valores como 1, 3, 11, 13 são impossíveis
   - Solução: O algoritmo greedy testa e retorna erro para esses casos

4. **Sincronizar servidor com testes de integração**
   - Problema: O script de testes iniciava o servidor mas não sabia quando estava pronto. Se esperasse pela mensagem "rodando" e ela não aparecesse, ficava travado para sempre (timeout)
   - Solução: Colocar `console.log()` no servidor quando está pronto e o script esperar por essa mensagem antes de executar testes
