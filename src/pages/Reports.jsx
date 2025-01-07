import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaRegEyeSlash, FaRegEye, FaTrashAlt } from "react-icons/fa";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [hideSaldo, setHideSaldo] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Fetch transactions from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const fetchedTransactions = snapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.date && data.date.seconds
          ? new Date(data.date.seconds * 1000)
          : null; // Validasi date
        return { id: doc.id, ...data, date }; // Simpan sebagai objek Date
      });
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

  const handleEditStart = (index, currentData) => {
    setEditingIndex(index);
    setEditedData({
      ...currentData,
      date: currentData.date ? currentData.date.toISOString().split("T")[0] : "", // Format untuk input
      time: currentData.date ? currentData.date.toTimeString().slice(0, 5) : "",
    });
  };

  const handleEditChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (index) => {
    if (!editedData) return;

    try {
      const transactionId = transactions[index].id;
      const transactionRef = doc(db, "transactions", transactionId);

      const updatedDate = new Date(`${editedData.date}T${editedData.time}`);
      await updateDoc(transactionRef, {
        ...editedData,
        date: updatedDate, // Simpan sebagai Date
        amount: parseFloat(editedData.amount),
      });

      const updatedTransactions = [...transactions];
      updatedTransactions[index] = {
        ...editedData,
        date: updatedDate,
        amount: parseFloat(editedData.amount),
        id: transactionId,
      };
      setTransactions(updatedTransactions);

      setEditingIndex(null);
      setEditedData({});
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditedData({});
  };

  const handleDelete = async (index) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        const transactionId = transactions[index].id;
        const transactionRef = doc(db, "transactions", transactionId);
        await deleteDoc(transactionRef);

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
            {hideSaldo ? <FaRegEyeSlash className="h-6 w-6" /> : <FaRegEye className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold mt-4 mb-2">Daftar Transaksi</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Tanggal</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Jam</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tipe</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Nominal</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Deskripsi</th>

          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => {
            let formattedDate = "Invalid Date";
            let formattedTime = "Invalid Time";

            if (t.date instanceof Date && !isNaN(t.date)) {
              formattedDate = t.date.toISOString().split("T")[0];
              formattedTime = t.date.toTimeString().slice(0, 5);
            }

            return (
              <tr key={index} className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                <td className="border border-gray-300 px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="date"
                      value={editedData.date || ""}
                      onChange={(e) => handleEditChange("date", e.target.value)}
                      className="p-1 border border-gray-300 rounded w-full"
                    />
                  ) : (
                    formattedDate
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="time"
                      value={editedData.time || ""}
                      onChange={(e) => handleEditChange("time", e.target.value)}
                      className="p-1 border border-gray-300 rounded w-full"
                    />
                  ) : (
                    formattedTime
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingIndex === index ? (
                    <select
                      value={editedData.type || ""}
                      onChange={(e) => handleEditChange("type", e.target.value)}
                      className="p-1 border border-gray-300 rounded w-full"
                    >
                      <option value="masuk">Masuk</option>
                      <option value="keluar">Keluar</option>
                    </select>
                  ) : (
                    t.type
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {editingIndex === index ? (
                    <input
                      type="number"
                      value={editedData.amount || ""}
                      onChange={(e) => handleEditChange("amount", e.target.value)}
                      className="p-1 border border-gray-300 rounded w-20"
                    />
                  ) : (
                    t.amount.toLocaleString()
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editedData.category || ""}
                      onChange={(e) => handleEditChange("category", e.target.value)}
                      className="p-1 border border-gray-300 rounded w-full"
                    />
                  ) : (
                    t.category
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editedData.description || ""}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      className="p-1 border border-gray-300 rounded w-full"
                    />
                  ) : (
                    t.description
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingIndex === index ? (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditSubmit(index)}
                        className="text-green-500 hover:text-green-700 ml-2"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditStart(index, t)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  )}
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
