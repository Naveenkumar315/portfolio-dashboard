

export interface Stock {
    name: string;
    symbol: string;
    cmp: number;
    purchasePrice: number;
    qty: number;
    investment: string;
    presentValue: string;
    gainLoss: string;
    gainLossPercent: string;
    pe?: string;
    eps?: string;
    marketCap?: string;
    sector: string;
    stage2?: string;
}
