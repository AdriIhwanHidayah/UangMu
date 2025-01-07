import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaExchangeAlt, FaChartBar } from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 w-64 bg-gray-900 text-white h-screen p-4 shadow-lg">
      <h1 className="text-2xl font-extrabold mb-6 text-center text-gray-100 tracking-wide">
        Uang<span className="text-green-400">Mu</span>
      </h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaTachometerAlt className="text-lg" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/transactions"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaExchangeAlt className="text-lg" />
              <span className="text-sm font-medium">Transaksi</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaChartBar className="text-lg" />
              <span className="text-sm font-medium">Laporan</span>
            </Link>
          </li>
        </ul>
      </nav>
      <footer className="mt-auto text-center text-xs text-gray-500">
        <p>&copy; 2025 UangMu. All rights reserved.</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
