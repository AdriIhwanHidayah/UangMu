import React, { useState } from "react";
import { useTransactions } from "../TransactionContext";

function Transactions() {
  const { transactions, addTransaction } = useTransactions();

  // State untuk form input
  const [form, setForm] = useState({
    type: "masuk", // Default jenis transaksi
    amount: "",
    description: "",
    category: "makanan", // Default kategori, hanya untuk transaksi keluar
  });

  // State untuk error
  const [error, setError] = useState("");

  // Fungsi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (!form.amount || !form.description) {
      setError("Keterangan transaksi atau nominal tidak boleh kosong!");
      return;
    }

    // Tambahkan transaksi jika valid
    addTransaction({
      type: form.type,
      amount: parseFloat(form.amount),
      description: form.description,
      category: form.type === "keluar" ? form.category : null, // hanya masukkan kategori jika jenis transaksi "keluar"
      date: new Date(),
    });

    // Reset form dan error
    setForm({ type: "masuk", amount: "", description: "", category: "makanan" });
    setError("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Jenis Transaksi:</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="p-2 border rounded w-full"
          >
            <option value="masuk">Masuk</option>
            <option value="keluar">Keluar</option>
          </select>
        </div>

        <div>
          <label className="block">Nominal:</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block">Keterangan:</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Kategori hanya muncul jika jenis transaksi adalah 'keluar' */}
        {form.type === "keluar" && (
          <div>
            <label className="block">Kategori:</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="makanan">Makanan</option>
              <option value="transportasi">Transportasi</option>
              <option value="jalan-jalan">Jalan-jalan</option>
            </select>
          </div>
        )}

        {/* Pesan Error */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah Transaksi
        </button>
      </form>

      <h1 className="text-lg font-semibold mb-4 mt-8">Daftar Transaksi</h1>
      <ul className="space-y-2">
        {transactions.map((transaction, index) => (
          <li key={index} className="p-2 border border-gray-300 rounded">
            <p><strong>Tanggal:</strong> {new Date(transaction.date).toLocaleString()}</p>
            <p><strong>Jumlah:</strong> {transaction.amount}</p>
            <p><strong>Kategori:</strong> {transaction.category}</p>
            <p><strong>Deskripsi:</strong> {transaction.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
