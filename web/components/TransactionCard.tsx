interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const statusColor =
    transaction.status === "SUCCESS"
      ? "text-accent-green"
      : transaction.status === "FAILED"
      ? "text-accent-red"
      : "text-text-secondary";

  const date = transaction.created_at
    ? new Date(transaction.created_at).toLocaleDateString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-bg-secondary/50 border border-border">
      <div>
        <p className="font-semibold">
          {transaction.amount.toLocaleString()} {transaction.currency}
        </p>
        <p className="text-text-secondary text-sm">{date}</p>
      </div>
      <span className={`font-medium ${statusColor}`}>{transaction.status}</span>
    </div>
  );
}
