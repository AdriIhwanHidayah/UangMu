import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "./firebase"; // Pastikan path benar
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const transactionCollection = collection(db, "transactions");

  // Sinkronkan data transaksi dari Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(transactionCollection, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
    });

    return () => unsubscribe();
  }, []);

  // Tambah transaksi ke Firestore
  const addTransaction = async (transaction) => {
    try {
      const docRef = await addDoc(transactionCollection, transaction);
      setTransactions([...transactions, { id: docRef.id, ...transaction }]);
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  // Hapus transaksi dari Firestore
  const removeTransaction = async (id) => {
    try {
      await deleteDoc(doc(transactionCollection, id));
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error("Error removing transaction: ", error);
    }
  };

  // Perbarui transaksi di Firestore
  const updateTransaction = async (id, updatedFields) => {
    try {
      const transactionDoc = doc(transactionCollection, id);
      await updateDoc(transactionDoc, updatedFields);
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id
            ? { ...transaction, ...updatedFields }
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
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
