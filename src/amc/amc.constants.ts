export enum AMCStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum AmcPlanType {
  HOME = 'home',
  FIVE_PC = '5pc',
  TEN_PC = '10pc',
  TWENTY_PC = '20pc',
}

export type PlanType = `${AmcPlanType}`;
