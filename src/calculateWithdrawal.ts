/**
 * Interface para o resultado do cálculo de saque
 */
interface WithdrawalResult {
  100: number;
  50: number;
  20: number;
  10: number;
  5: number;
  2: number;
}

/**
 * Valores de cédulas disponíveis no caixa eletrônico (tipados como chaves)
 */
const DENOMINATIONS: Array<keyof WithdrawalResult> = [100, 50, 20, 10, 5, 2];

/**
 * Calcula a quantidade mínima de cédulas necessárias para um valor de saque
 * Utiliza algoritmo guloso (greedy) que é ótimo para essa combinação de cédulas
 *
 * @param amount - Valor do saque desejado (inteiro positivo)
 * @returns Objeto com a quantidade de cédulas de cada valor
 * @throws Error se o valor não puder ser sacado com as cédulas disponíveis
 */
export function calculateWithdrawal(amount: number): WithdrawalResult {
  const result: WithdrawalResult = {
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
    2: 0,
  };

  let remaining = amount;

  for (const denomination of DENOMINATIONS) {
    if (remaining >= denomination) {
      const count = Math.floor(remaining / denomination);
      result[denomination] = count;
      remaining -= count * denomination;
    }
  }

  // Se há resto, o valor não pode ser sacado com as cédulas disponíveis
  if (remaining > 0) {
    throw new Error(
      `Valor ${amount} não pode ser sacado com as cédulas disponíveis`
    );
  }

  return result;
}

export type { WithdrawalResult };
