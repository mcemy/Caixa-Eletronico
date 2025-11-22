import { calculateWithdrawal } from "../src/calculateWithdrawal";

describe("calculateWithdrawal", () => {
  describe("Casos de sucesso", () => {
    test("Deve calcular corretamente para 380", () => {
      const result = calculateWithdrawal(380);
      expect(result).toEqual({
        100: 3,
        50: 1,
        20: 1,
        10: 1,
        5: 0,
        2: 0,
      });
    });

    test("Deve calcular corretamente para 100", () => {
      const result = calculateWithdrawal(100);
      expect(result).toEqual({
        100: 1,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        2: 0,
      });
    });

    test("Deve calcular corretamente para 2", () => {
      const result = calculateWithdrawal(2);
      expect(result).toEqual({
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        2: 1,
      });
    });

    test("Deve calcular corretamente para 127", () => {
      const result = calculateWithdrawal(127);
      expect(result).toEqual({
        100: 1,
        50: 0,
        20: 1,
        10: 0,
        5: 1,
        2: 1,
      });
    });

    test("Deve calcular corretamente para 4", () => {
      const result = calculateWithdrawal(4);
      expect(result).toEqual({
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        2: 2,
      });
    });

    test("Deve calcular corretamente para 50", () => {
      const result = calculateWithdrawal(50);
      expect(result).toEqual({
        100: 0,
        50: 1,
        20: 0,
        10: 0,
        5: 0,
        2: 0,
      });
    });

    test("Deve calcular corretamente para 75", () => {
      const result = calculateWithdrawal(75);
      expect(result).toEqual({
        100: 0,
        50: 1,
        20: 1,
        10: 0,
        5: 1,
        2: 0,
      });
    });
  });

  describe("Casos de erro", () => {
    test("Deve lançar erro para valores que não podem ser sacados (ex: 1)", () => {
      expect(() => calculateWithdrawal(1)).toThrow(
        "Valor 1 não pode ser sacado com as cédulas disponíveis"
      );
    });

    test("Deve lançar erro para valores que não podem ser sacados (ex: 3)", () => {
      expect(() => calculateWithdrawal(3)).toThrow(
        "Valor 3 não pode ser sacado com as cédulas disponíveis"
      );
    });

    test("Deve lançar erro para valores que não podem ser sacados (ex: 11)", () => {
      expect(() => calculateWithdrawal(11)).toThrow(
        "Valor 11 não pode ser sacado com as cédulas disponíveis"
      );
    });

    test("Deve lançar erro para valores que não podem ser sacados (ex: 13)", () => {
      expect(() => calculateWithdrawal(13)).toThrow(
        "Valor 13 não pode ser sacado com as cédulas disponíveis"
      );
    });
  });
});
