export const formatCurrencyGBP = (amount: number | null) => {
  const value = amount || 0;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
};
