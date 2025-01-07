import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import konfigurasi Firebase
import { collection, addDoc, onSnapshot } from "firebase/firestore";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "masuk",
    amount: "",
    description: "",
    category: "makanan",
    date: "",  // Menambahkan state untuk tanggal
    time: "",  // Menambahkan state untuk waktu
  });
  const [error, setError] = useState("");

  // Fetch transactions dari Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const fetchedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Log fetched transactions untuk debugging
      console.log("Fetched transactions:", fetchedTransactions);
      
      setTransactions(fetchedTransactions);
    });
    return () => unsubscribe();
  }, []);

  // Tambahkan transaksi ke Firestore
  const addTransaction = async (transaction) => {
    try {
      console.log("Adding transaction:", transaction); // Log untuk debugging
      await addDoc(collection(db, "transactions"), transaction);
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  // Fungsi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || !form.description || !form.date || !form.time) {
      setError("Keterangan transaksi, nominal, tanggal, atau waktu tidak boleh kosong!");
      return;
    }

    addTransaction({
      type: form.type,
      amount: parseFloat(form.amount),
      description: form.description,
      category: form.type === "keluar" ? form.category : null,
      date: new Date(`${form.date}T${form.time}`), // Menggunakan tanggal dan waktu dari form
    });

    setForm({ type: "masuk", amount: "", description: "", category: "makanan", date: "", time: "" });
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

        {/* Input Tanggal */}
        <div>
          <label className="block">Tanggal:</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Input Waktu */}
        <div>
          <label className="block">Waktu:</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
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

      {/* Daftar Transaksi */}
      <h1 className="text-lg font-semibold mb-4 mt-8">Daftar Transaksi</h1>
      <ul className="space-y-2">
        {transactions.map((transaction, index) => {
          const transactionDate = new Date(transaction.date.seconds * 1000);
          const hours = transactionDate.getHours();
          const minutes = transactionDate.getMinutes();
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedTime = `${hours % 12}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`; // Format jam dalam 12 jam

          return (
            <li key={index} className="p-2 border border-gray-300 rounded">
              <p><strong>Tanggal:</strong> {transactionDate.toLocaleDateString()}</p>
              <p><strong>Jam:</strong> {formattedTime}</p> {/* Menampilkan jam dalam format 12 jam */}
              <p><strong>Jumlah:</strong> {transaction.amount}</p>
              <p><strong>Kategori:</strong> {transaction.category || ""}</p>
              <p><strong>Deskripsi:</strong> {transaction.description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Transactions;
