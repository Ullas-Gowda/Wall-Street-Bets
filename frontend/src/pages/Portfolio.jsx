import React, { useState, useEffect } from 'react';
import { tradingAPI } from '../api';
import { useAuth } from '../AuthContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Portfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('holdings');

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const [portfolioRes, transactionsRes] = await Promise.all([
        tradingAPI.getPortfolio(),
        tradingAPI.getTransactions(),
      ]);
      setPortfolio(portfolioRes.data);
      setTransactions(transactionsRes.data.transactions || []);
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const holdings = portfolio?.holdings || [];
  const summary = portfolio?.summary || {};
  const userBalance = user?.balance || portfolio?.user?.balance || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-gray-400">Manage your investments</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Cash Balance</p>
          <p className="text-3xl font-bold text-white">${userBalance?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Total Invested</p>
          <p className="text-3xl font-bold text-white">${(summary.totalInvested || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Current Value</p>
          <p className="text-3xl font-bold text-white">${(summary.totalCurrentValue || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Total Return</p>
          <p className={`text-3xl font-bold ${(summary.totalUnrealizedPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(summary.totalUnrealizedPnL || 0) >= 0 ? '+' : ''}${(summary.totalUnrealizedPnL || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            {summary.totalReturnPercentage && (
              <span className="text-sm ml-2">({summary.totalReturnPercentage}%)</span>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {['holdings', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-medium transition-colors ${activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Holdings Tab */}
        {activeTab === 'holdings' && (
          <div>
            {holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
                      <th className="text-right py-3 px-4 text-gray-400">Quantity</th>
                      <th className="text-right py-3 px-4 text-gray-400">Avg Price</th>
                      <th className="text-right py-3 px-4 text-gray-400">Current Price</th>
                      <th className="text-right py-3 px-4 text-gray-400">Total Value</th>
                      <th className="text-right py-3 px-4 text-gray-400">Gain/Loss</th>
                      <th className="text-center py-3 px-4 text-gray-400">Return %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => {
                      const gainLoss = holding.unrealizedPnL || 0;
                      const returnPct = holding.totalInvested > 0
                        ? ((gainLoss / holding.totalInvested) * 100).toFixed(2)
                        : 0;

                      return (
                        <tr key={holding.symbol} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{holding.symbol}</td>
                          <td className="py-3 px-4 text-right text-gray-300">{holding.quantity?.toFixed(8)}</td>
                          <td className="py-3 px-4 text-right text-gray-300">${holding.averagePrice?.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-gray-300">${holding.currentPrice?.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-medium text-white">${holding.currentValue?.toFixed(2)}</td>
                          <td className={`py-3 px-4 text-right font-medium ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {gainLoss >= 0 ? '+' : ''}${gainLoss?.toFixed(2)}
                          </td>
                          <td className={`py-3 px-4 text-center font-medium ${returnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {returnPct >= 0 ? '+' : ''}{returnPct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">No holdings yet. Start trading to build your portfolio.</p>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
                      <th className="text-center py-3 px-4 text-gray-400">Type</th>
                      <th className="text-right py-3 px-4 text-gray-400">Quantity</th>
                      <th className="text-right py-3 px-4 text-gray-400">Price</th>
                      <th className="text-right py-3 px-4 text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn._id || txn.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-gray-400 text-xs">{new Date(txn.createdAt).toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold text-white">{txn.symbol}</td>
                        <td className={`py-3 px-4 text-center font-medium ${txn.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {txn.type}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">{txn.quantity?.toFixed(8)}</td>
                        <td className="py-3 px-4 text-right text-gray-300">${txn.price?.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-medium text-white">${txn.totalValue?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">No transactions yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
