import React from 'react';
import { Layout } from 'lucide-react';

export const DashboardHeader = ({ title, subtitle, actions }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        <Layout size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">{subtitle}</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
    </div>
    <div className="flex gap-3">
      {actions}
    </div>
  </div>
);

export const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div className={`stat-card ${gradient}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-4xl font-black mb-1">{value}</p>
        <p className="text-sm font-medium opacity-80 uppercase tracking-wide">{title}</p>
      </div>
      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export const TabBar = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex bg-gray-200/50 p-1 rounded-xl w-fit mb-8">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === tab.id
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const DataTable = ({ columns, data, actions }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gradient-primary-horiz text-white">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-xs font-black uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm font-medium text-gray-600">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm font-medium text-right">
                  <div className="flex justify-end gap-2">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg size={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
