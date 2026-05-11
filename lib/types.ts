export type Transaction = {
  id?: string;
  amount: number;
  currency?: string;
  category: string;
  note?: string;
  date?: string;
  is_income?: boolean;
  folder_id?: string;
};
