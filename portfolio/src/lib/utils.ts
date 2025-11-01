export function formatNumber(value: string | number | undefined): string {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
}
