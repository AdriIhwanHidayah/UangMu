import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Pastikan path import db sesuai
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"; // Impor Firestore methods
import { FaRegEyeSlash, FaRegEye, FaTrashAlt } from "react-icons/fa";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [hideSaldo, setHideSaldo] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");

  // Fetch transactions from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const fetchedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(fetchedTransactions);
    });

    return () => unsubscribe();
  }, []);

  // Hitung total masuk
  const totalMasuk = transactions
    .filter((t) => t.type === "masuk")
    .reduce((acc, t) => acc + t.amount, 0);

  // Hitung total keluar
  const totalKeluar = transactions
    .filter((t) => t.type === "keluar")
    .reduce((acc, t) => acc + t.amount, 0);

  const saldo = totalMasuk - totalKeluar;

  const handleEditStart = (index, currentAmount) => {
    setEditingIndex(index);
    setEditedAmount(currentAmount.toString());
  };

  const handleEditSubmit = async (index) => {
    if (editedAmount === "") return;

    try {
      // Ambil ID transaksi untuk diperbarui
      const transactionId = transactions[index].id;

      // Referensi ke dokumen transaksi di Firestore
      const transactionRef = doc(db, "transactions", transactionId);

      // Update transaksi dengan nominal baru
      await updateDoc(transactionRef, {
        amount: parseFloat(editedAmount), // Perbarui nominal
      });

      // Update transaksi di state setelah berhasil
      const updatedTransactions = [...transactions];
      updatedTransactions[index].amount = parseFloat(editedAmount);
      setTransactions(updatedTransactions);

      setEditingIndex(null);
      setEditedAmount("");
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditedAmount("");
  };

  const handleDelete = async (index) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        // Ambil ID transaksi untuk dihapus
        const transactionId = transactions[index].id;

        // Referensi ke dokumen transaksi di Firestore
        const transactionRef = doc(db, "transactions", transactionId);

        // Menghapus dokumen
        await deleteDoc(transactionRef);

        // Berhasil menghapus, update transaksi di state
        setTransactions(transactions.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting transaction: ", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-sm font-semibold mb-4">Laporan Keuangan</h1>
      <div className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          <p className="text-lg">
            Saldo Anda:{" "}
            <span className="font-bold">
              {hideSaldo ? "**********" : `Rp ${saldo.toLocaleString()}`}
            </span>
          </p>
          <button
            onClick={() => setHideSaldo(!hideSaldo)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            {hideSaldo ? (
              <FaRegEyeSlash className="h-6 w-6" />
            ) : (
              <FaRegEye className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold mt-4 mb-2">Daftar Transaksi</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Tanggal</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Jam</th> {/* Menambahkan kolom Jam */}
            <th className="border border-gray-300 px-4 py-2 text-left">Tipe</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Nominal</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Deskripsi</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Hapus</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => {
            // Mengambil waktu dari transaksi
            const transactionDate = new Date(t.date.seconds * 1000);
            const hours = transactionDate.getHours();
            const minutes = transactionDate.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedTime = `${hours % 12}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`; // Format jam dalam 12 jam

            return (
              <tr key={index} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                <td className="border border-gray-300 px-4 py-2">
                  {transactionDate.toLocaleDateString()} {/* Menampilkan tanggal */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formattedTime} {/* Menampilkan jam dalam format 12 jam */}
                </td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{t.type}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {editingIndex === index ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(e.target.value)}
                        className="p-1 border border-gray-300 rounded w-20"
                      />
                      <button
                        onClick={() => handleEditSubmit(index)}
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => handleEditStart(index, t.amount)}
                    >
                      {t.amount.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{t.category}</td>
                <td className="border border-gray-300 px-4 py-2">{t.description}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
