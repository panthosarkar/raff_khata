import { useTransactions } from "@/hooks/useTransactions";
import { TRANSACTION_CATEGORIES } from "@/contexts/TransactionsContext";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

export function TransactionsCategoryFilter() {
  const { category, setCategory } = useTransactions();
  const activeCategory = category || "All categories";

  return (
    <div className="digital-panel rounded-4xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm uppercase tracking-[0.24em] text-[rgba(243,251,255,0.55)]">
          Filter by category
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="w-full justify-between sm:max-w-xs"
            >
              {activeCategory}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setCategory("")}>
              All categories
              {!category && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {TRANSACTION_CATEGORIES.map((item) => (
              <DropdownMenuItem key={item} onSelect={() => setCategory(item)}>
                {item}
                {category === item && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
