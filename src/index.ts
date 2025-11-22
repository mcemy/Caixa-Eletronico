import express, { Request, Response } from "express";
import { calculateWithdrawal } from "./calculateWithdrawal";
import { validateWithdrawalRequest, ValidatedRequest } from "./middleware";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

/**
 * Rota de health check
 */
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

/**
 * Rota POST /api/saque
 * Calcula a quantidade mínima de cédulas para um saque
 */
app.post(
  "/api/saque",
  validateWithdrawalRequest,
  (req: ValidatedRequest, res: Response) => {
    try {
      const amount = req.validatedAmount!;
      const result = calculateWithdrawal(amount);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
);

// Tratamento de rotas não encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
