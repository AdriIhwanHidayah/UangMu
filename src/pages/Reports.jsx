import React from "react";
import { useTransactions } from "../TransactionContext";

function Reports() {
  const { transactions } = useTransactions();

  const totalMasuk = transactions
    .filter((t) => t.type === "masuk")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalKeluar = transactions
    .filter((t) => t.type === "keluar")
    .reduce((acc, t) => acc + t.amount, 0);

  const saldo = totalMasuk - totalKeluar;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
      <p>Total Masuk: Rp {totalMasuk}</p>
      <p>Total Keluar: Rp {totalKeluar}</p>
      <p>Saldo Akhir: Rp {saldo}</p>
      <h2 className="text-xl font-bold mt-4">Daftar Transaksi</h2>
      <ul>
        {transactions.map((t, index) => (
          <li key={index}>
            {t.date.toLocaleString()} - {t.type} - Rp {t.amount}: {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
