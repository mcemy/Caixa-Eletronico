import { Request, Response, NextFunction } from "express";

/**
 * Interface para o corpo da requisição de saque
 */
interface WithdrawalRequest {
  valor: unknown;
}

/**
 * Interface estendida de Request com dados validados
 */
export interface ValidatedRequest extends Request {
  validatedAmount?: number;
}

/**
 * Middleware para validar o valor de saque
 * Verifica se é um número inteiro positivo
 */
export function validateWithdrawalRequest(
  req: ValidatedRequest,
  res: Response,
  next: NextFunction
): void {
  const { valor } = req.body as WithdrawalRequest;

  // Validar se o valor existe
  if (valor === undefined || valor === null) {
    res.status(400).json({ error: "Campo 'valor' é obrigatório" });
    return;
  }

  // Validar se é um número
  if (typeof valor !== "number") {
    res.status(400).json({
      error: "Campo 'valor' deve ser um número",
    });
    return;
  }

  // Validar se é um número inteiro
  if (!Number.isInteger(valor)) {
    res.status(400).json({
      error: "Campo 'valor' deve ser um número inteiro",
    });
    return;
  }

  // Validar se é positivo
  if (valor <= 0) {
    res.status(400).json({
      error: "Campo 'valor' deve ser um número positivo",
    });
    return;
  }

  req.validatedAmount = valor;
  next();
}
