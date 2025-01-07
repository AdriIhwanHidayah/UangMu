import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TransactionProvider } from "./TransactionContext";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <TransactionProvider> {/* Membungkus aplikasi dengan TransactionProvider */}
        <div className="flex">
          {/* Sidebar dengan posisi tetap */}
          <Sidebar />
          {/* Konten utama dengan margin kiri untuk menyesuaikan lebar sidebar */}
          <div className="flex-1 ml-64 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      </TransactionProvider>
    </Router>
  );
}

export default App;
