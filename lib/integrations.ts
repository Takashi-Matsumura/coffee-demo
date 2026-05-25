import type { IntegrationKey } from "./types";

export type IntegrationMeta = {
  key: IntegrationKey;
  label: string;
  caption: string;
  dotClass: string;
};

const integrations: Record<IntegrationKey, IntegrationMeta> = {
  hr: {
    key: "hr",
    label: "HR Master API",
    caption: "人事マスタ連携（モック）",
    dotClass: "bg-coffee",
  },
  policy: {
    key: "policy",
    label: "Benefit Policy Engine",
    caption: "福利厚生ロジック",
    dotClass: "bg-coffee-light",
  },
  expense: {
    key: "expense",
    label: "Expense SaaS Connector",
    caption: "経費精算連携（モック）",
    dotClass: "bg-crema",
  },
  slack: {
    key: "slack",
    label: "Slack Notify",
    caption: "業務チャネル通知（モック）",
    dotClass: "bg-mint",
  },
  bi: {
    key: "bi",
    label: "BI Dashboard Core",
    caption: "集計基盤",
    dotClass: "bg-espresso",
  },
};

export function getIntegration(key: IntegrationKey): IntegrationMeta {
  return integrations[key];
}

export function listIntegrations(keys: IntegrationKey[]): IntegrationMeta[] {
  return keys.map(getIntegration);
}
