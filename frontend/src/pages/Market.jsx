import React, { useState, useEffect } from 'react';
import { marketAPI } from '../api';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

const Market = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
  const crypto = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL'];

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await marketAPI.getPrices();
      setAssets(res.data);
    } catch (err) {
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'stocks') return matchesSearch && stocks.includes(asset.symbol);
    if (filter === 'crypto') return matchesSearch && crypto.includes(asset.symbol);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Market</h1>
        <p className="text-gray-400">Browse all available assets</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'stocks', 'crypto'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div key={asset.symbol} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{asset.symbol}</h3>
                    <p className="text-gray-400 text-sm">{stocks.includes(asset.symbol) ? 'Stock' : 'Crypto'}</p>
                  </div>
                  {asset.priceChange >= 0 ? (
                    <TrendingUp className="text-green-400" size={24} />
                  ) : (
                    <TrendingDown className="text-red-400" size={24} />
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-2">${asset.currentPrice?.toFixed(2)}</p>
                <p className={`text-lg font-semibold ${asset.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.priceChange >= 0 ? '+' : ''}{asset.priceChange?.toFixed(2)}%
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No assets found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;
