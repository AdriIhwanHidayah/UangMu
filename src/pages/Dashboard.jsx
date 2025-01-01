import React, { useState } from "react";
import { useTransactions } from "../TransactionContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Dashboard() {
  const { transactions } = useTransactions();
  
  const [isSaldoVisible, setIsSaldoVisible] = useState(true);

  // Hitung total masuk
  const totalMasuk = transactions
    .filter((t) => t.type === "masuk")
    .reduce((acc, t) => acc + t.amount, 0);

  // Hitung total keluar
  const totalKeluar = transactions
    .filter((t) => t.type === "keluar")
    .reduce((acc, t) => acc + t.amount, 0);

  // Hitung saldo
  const saldo = totalMasuk - totalKeluar;

  // Kelompokkan pengeluaran berdasarkan kategori
  const categories = ["makanan", "transportasi", "jalan-jalan"];
  const groupedByCategory = categories.map((category) => {
    const totalPerCategory = transactions
      .filter((t) => t.type === "keluar" && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
    return { category, total: totalPerCategory };
  });

  const toggleSaldoVisibility = () => {
    setIsSaldoVisible(!isSaldoVisible);
  };

  return (
    <div className="p-4">
      <div className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-white flex items-center">
        <h2 className="text-lg font-bold mr-2">Saldo Anda:</h2>
        <p className="text-2xl font-bold text-green-600 mr-2">
          {isSaldoVisible ? `Rp ${saldo.toLocaleString()}` : "**********"}
        </p>
        <div onClick={toggleSaldoVisibility} className="cursor-pointer">
          {isSaldoVisible ? (
            <FaRegEye className="text-gray-500" />
          ) : (
            <FaRegEyeSlash className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Notifikasi jika saldo di bawah 50 */}
      {saldo < 50 && (
        <div className="mb-4 p-4 border border-red-300 rounded-md shadow-sm bg-red-100">
          <p className="text-red-700 font-bold">
            Peringatan: Saldo Anda berada di bawah Rp 50!
          </p>
        </div>
      )}

      <p>Selamat datang di dashboard UangMu! Mari atur dan cek pengeluaranmu.</p>

      {/* Bagian Pengelompokan Pengeluaran */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Pengeluaran Berdasarkan Kategori</h3>
        <div className="space-y-4 mt-4">
          {groupedByCategory.map((group, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-md shadow-sm bg-white">
              <h4 className="font-bold text-xl capitalize">{group.category}</h4>
              <p className="text-lg">
                Total Pengeluaran: Rp {group.total.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
