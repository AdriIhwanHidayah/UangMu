import React, { createContext, useContext, useState } from "react";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "masuk",
      amount: 500,
      category: "transfer",
      description: "Saldo awal",
      date: new Date().toISOString(),
    },
  ]);

  // Tambah transaksi
  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  // Hapus transaksi
  const removeTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  // Perbarui transaksi
  const updateTransaction = (index, updatedFields) => {
    setTransactions((prev) =>
      prev.map((transaction, i) =>
        i === index ? { ...transaction, ...updatedFields } : transaction
      )
    );
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
