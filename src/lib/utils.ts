export const formatRupiah = (value: number | string | any): string => {
  if (value === undefined || value === null) return 'Rp 0';
  const numericValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(numericValue)) return 'Rp 0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};
