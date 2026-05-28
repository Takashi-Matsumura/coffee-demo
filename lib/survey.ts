// アンケート回答のメモリストア。lib/orders.ts と同じく globalThis に保持し、
// 開発時の HMR でも回答が消えないようにする。集計画面は持たず保存のみ。

export type SurveyAnswers = Record<string, string | string[]>;

export type SurveyResponseInput = {
  answers: SurveyAnswers;
};

export type SurveyResponse = SurveyResponseInput & {
  id: string;
  createdAt: string;
};

type SurveyStore = {
  responses: SurveyResponse[];
};

declare global {
  var __occSurveyStore: SurveyStore | undefined;
}

function getStore(): SurveyStore {
  if (!globalThis.__occSurveyStore) {
    globalThis.__occSurveyStore = { responses: [] };
  }
  return globalThis.__occSurveyStore;
}

export function addSurveyResponse(input: SurveyResponseInput): SurveyResponse {
  const store = getStore();
  const response: SurveyResponse = {
    ...input,
    id: `sv-${store.responses.length + 1}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.responses.push(response);
  return response;
}

export function listSurveyResponses(): SurveyResponse[] {
  return getStore().responses;
}
