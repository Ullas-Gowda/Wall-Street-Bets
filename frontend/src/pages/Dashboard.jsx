import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { tradingAPI, marketAPI } from '../api';
import { TrendingUp, Wallet, PieChart, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch user portfolio and transactions (these are fast)
        const [portfolioRes, transactionsRes] = await Promise.all([
          tradingAPI.getPortfolio(),
          tradingAPI.getTransactions(),
        ]);

        setPortfolio(portfolioRes.data);
        setTransactions(transactionsRes.data?.transactions || transactionsRes.data || []);

        // Fetch market overview separately (slower due to external API)
        try {
          const overviewRes = await marketAPI.getOverview();
          setOverview(overviewRes.data);
        } catch (overviewErr) {
          console.warn('Market overview failed, using defaults:', overviewErr.message);
          // Continue without market overview
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    setError('');
    try {
      setLoading(true);
      const [portfolioRes, transactionsRes] = await Promise.all([
        tradingAPI.getPortfolio(),
        tradingAPI.getTransactions(),
      ]);

      setPortfolio(portfolioRes.data);
      setTransactions(transactionsRes.data?.transactions || transactionsRes.data || []);

      try {
        const overviewRes = await marketAPI.getOverview();
        setOverview(overviewRes.data);
      } catch (overviewErr) {
        console.warn('Market overview failed:', overviewErr.message);
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Retry error:', err);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalBalance = (portfolio?.user?.balance || 0) + (portfolio?.summary?.totalCurrentValue || 0);
  const portfolioValue = portfolio?.summary?.totalCurrentValue || 0;
  const cashBalance = portfolio?.user?.balance || 0;
  const totalPL = portfolio?.summary?.totalUnrealizedPnL || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400">Here's your trading overview</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={retrying ? 'animate-spin' : ''} />
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Balance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Balance</h3>
            <Wallet className="text-blue-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400">Starting balance: ${user?.balance?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>

        {/* Portfolio Value */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Portfolio Value</h3>
            <PieChart className="text-purple-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400">Holdings value</p>
        </div>

        {/* Cash Balance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Cash Balance</h3>
            <Wallet className="text-green-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${cashBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400">Available to trade</p>
        </div>

        {/* Total P/L */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total P/L</h3>
            <TrendingUp className={totalPL >= 0 ? 'text-green-400' : 'text-red-400'} size={24} />
          </div>
          <p className={`text-3xl font-bold mb-1 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400">{totalPL >= 0 ? 'Profit' : 'Loss'}</p>
        </div>
      </div>

      {/* Market Overview */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-3 card">
            <h2 className="text-xl font-bold text-white mb-6">Market Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(overview.assets || []).slice(0, 4).map((asset) => (
                <div key={asset.symbol || asset.id} className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {asset.image && (
                      <img src={asset.image} alt={asset.name} className="w-5 h-5 rounded-full" />
                    )}
                    <p className="text-gray-400 text-sm font-medium">{asset.symbol}</p>
                  </div>
                  <p className="text-white font-bold text-lg">
                    ${asset.current_price?.toFixed(2)}
                  </p>
                  <p className={`text-sm ${(asset.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(asset.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                    {asset.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
                  <th className="text-left py-3 px-4 text-gray-400">Type</th>
                  <th className="text-right py-3 px-4 text-gray-400">Quantity</th>
                  <th className="text-right py-3 px-4 text-gray-400">Price</th>
                  <th className="text-right py-3 px-4 text-gray-400">Total</th>
                  <th className="text-left py-3 px-4 text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{txn.symbol}</td>
                    <td className={`py-3 px-4 font-medium ${txn.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.type}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">{txn.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-300">${txn.price?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-white font-medium">${txn.totalValue?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No transactions yet. Start trading to see your activity here.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
