import React, { useState } from "react";
import { useTransactions } from "../TransactionContext";

function Transactions() {
  const { addTransaction } = useTransactions();

  // State untuk form input
  const [form, setForm] = useState({
    type: "masuk", // Default jenis transaksi
    amount: "",
    description: "",
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
      date: new Date(),
    });

    // Reset form dan error
    setForm({ type: "masuk", amount: "", description: "" });
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

        {/* Pesan Error */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah Transaksi
        </button>
      </form>
    </div>
  );
}

export default Transactions;
