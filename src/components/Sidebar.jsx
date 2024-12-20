import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <ul>
        <li className="mb-2">
          <Link to="/" className="hover:text-gray-400">Dashboard</Link>
        </li>
        <li className="mb-2">
          <Link to="/transactions" className="hover:text-gray-400">Transaksi</Link>
        </li>
        <li className="mb-2">
          <Link to="/reports" className="hover:text-gray-400">Laporan</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
