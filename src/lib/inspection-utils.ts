import type { PhaseCode, UADField } from '@/types/inspection';

export function evaluateCondition(
  expr: string | undefined,
  currentPhase: PhaseCode,
  store: Record<PhaseCode, Record<string, any>>
): boolean {
  if (!expr || expr.trim() === '') return true;
  if (expr.includes('CONTEXT') || expr.includes('TABLE_ROW')) return true;

  try {
    let sanitized = expr;

    sanitized = sanitized.replace(/\[(.*?)\]/g, (_match, fieldName) => {
      const value = store[currentPhase]?.[fieldName];
      if (value === undefined || value === null) return 'null';
      if (typeof value === 'string') return JSON.stringify(value);
      if (Array.isArray(value)) return JSON.stringify(value);
      return String(value);
    });

    sanitized = sanitized.replace(/(?<![<>!])=/g, '===');
    sanitized = sanitized.replace(/ AND /gi, ' && ');
    sanitized = sanitized.replace(/ OR /gi, ' || ');

    const result = new Function('return ' + sanitized)();
    return Boolean(result);
  } catch (e) {
    console.warn('Evaluation error:', expr, e);
    return true;
  }
}

export function parseEnumOptions(possibleAnswers: string | undefined): string[] {
  if (!possibleAnswers) return [];
  return possibleAnswers
    .split(/[,\n]/)
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0);
}

export function countVisibleFields(
  fields: UADField[],
  store: Record<PhaseCode, Record<string, any>>,
  currentPhase: PhaseCode
): number {
  return fields.filter(field =>
    evaluateCondition(field.show_if, currentPhase, store)
  ).length;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const EMPTY_STORE = { P1: {}, P2: {}, P3: {}, P4: {}, P5: {}, P6: {}, P7: {}, P8: {} };

export function createEmptyStore() {
  return JSON.parse(JSON.stringify(EMPTY_STORE));
}
