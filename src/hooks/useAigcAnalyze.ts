import { useCallback, useState } from 'react';
import {
  generateTaskId,
  getAlgorithmKey,
  getRandomAigcSamples,
  mapAigcErrorMessage,
  parseDisplayResponse,
  runBuiltinSampleAnalyze,
  submitAnalyze,
  type ParsedAigcDisplay,
} from '@/api/aigc';
import type { GatewayError } from '@/utils/gateway';

export function useAigcAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<Record<string, unknown> | null>(null);
  const [parsed, setParsed] = useState<ParsedAigcDisplay | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setRaw(null);
    setParsed(null);
  }, []);

  const runAnalyze = useCallback(async (
    modality: string,
    func: string,
    input: { text?: string; file?: File; taskId?: string } = {},
  ) => {
    setLoading(true);
    setError(null);
    setRaw(null);
    setParsed(null);
    try {
      const taskId = input.taskId ?? generateTaskId();
      const data = await submitAnalyze(modality, func, { ...input, taskId });
      const nextParsed = parseDisplayResponse(data);
      setRaw(data);
      setParsed(nextParsed);
      return nextParsed;
    } catch (e) {
      const err = e as GatewayError;
      const msg = mapAigcErrorMessage(err.status, err.message);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const runBuiltinAnalyze = useCallback(async (
    modality: string,
    func: string,
    options: { taskId?: string; excludeSampleId?: string } = {},
  ) => {
    setLoading(true);
    setError(null);
    setRaw(null);
    setParsed(null);
    try {
      const algorithmKey = getAlgorithmKey(modality, func);
      const data = await getRandomAigcSamples({
        algorithmKey,
        count: options.excludeSampleId ? 5 : 1,
        replace: true,
      });
      const items = Array.isArray(data?.items) ? data.items : [];
      const sample = options.excludeSampleId
        ? items.find((item) => item.sample_id !== options.excludeSampleId) ?? items[0]
        : items[0];
      if (!sample) throw new Error('暂无内置样例');

      const taskId = options.taskId ?? `builtin_${sample.sample_id}_${Date.now()}`;
      const result = await runBuiltinSampleAnalyze(sample, taskId);
      const nextParsed = parseDisplayResponse(result);
      // 与 Vue useAigcAnalyze 一致：把样例挂到 parsed 上便于结果区展示
      (nextParsed as ParsedAigcDisplay & { _sample?: Record<string, unknown> })._sample = sample;
      setRaw(result);
      setParsed(nextParsed);
      return nextParsed;
    } catch (e) {
      const err = e as GatewayError;
      const msg = mapAigcErrorMessage(err.status, err.message);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, raw, parsed, runAnalyze, runBuiltinAnalyze, reset };
}
