import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketAPI } from '../api';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

const Market = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [assetType, setAssetType] = useState('all'); // 'all', 'crypto', 'stock'

  // Debounced search timer
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchMarkets = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await marketAPI.getMarkets(currency, 50, 1, assetType);
        if (active) {
          setAssets(res.data.markets || []);
        }
      } catch (err) {
        if (active) {
          console.error('Failed to load market data:', err);
          setError('Failed to load market data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMarkets();

    return () => {
      active = false;
    };
  }, [currency, assetType]);

  // Debounced search effect
  // ... (keep search effect same, it uses a separate handler)

  /* Removing duplicate fetchMarkets definition since it's now inside useEffect */

  const handleLiveSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setSearching(true);
      setError('');
      const res = await marketAPI.searchAssets(query);
      setAssets(res.data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleAssetClick = (symbol) => {
    navigate(`/trade?symbol=${symbol}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Market</h1>
        <p className="text-gray-400">Track cryptocurrency and stock prices</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">

        {/* Currency Toggle (Always Visible) */}
        <div className="flex gap-2">
          {['usd', 'inr'].map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currency === curr
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
            >
              {curr.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crypto..."
            className="input-field w-full pr-10"
          />
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${searching ? 'animate-pulse' : ''}`} size={20} />
          {searching && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id || asset.symbol}
            onClick={() => handleAssetClick(asset.symbol)}
            className="card hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {asset.image && (
                  <img src={asset.image} alt={asset.name} className="w-10 h-10 rounded-full" onError={(e) => e.target.style.display = 'none'} />
                )}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {asset.symbol}
                  </h3>
                  <p className="text-gray-400 text-sm">{asset.name}</p>
                  <span className={`text-xs px-2 py-1 rounded ${asset.type === 'crypto' ? 'bg-purple-900/30 text-purple-300' : 'bg-blue-900/30 text-blue-300'
                    }`}>
                    {asset.type === 'crypto' ? 'Crypto' : 'Stock'} {asset.market && `(${asset.market})`}
                  </span>
                </div>
              </div>
              {(asset.price_change_percentage_24h || 0) >= 0 ? (
                <TrendingUp className="text-green-400" size={24} />
              ) : (
                <TrendingDown className="text-red-400" size={24} />
              )}
            </div>

            <p className="text-3xl font-bold text-white mb-2">
              {asset.currency === 'INR' ? '₹' : '$'}
              {asset.current_price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>

            <p className={`text-lg font-semibold mb-1 ${(asset.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(asset.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
              {asset.price_change_percentage_24h?.toFixed(2)}%
            </p>

            {asset.market_cap && asset.market_cap > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                MCap: {asset.currency === 'INR' ? '₹' : '$'}
                {(asset.market_cap / 1e9).toFixed(2)}B
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-blue-400 group-hover:text-blue-300 font-medium">
                Click to trade →
              </p>
            </div>
          </div>
        ))}
      </div>

      {assets.length === 0 && !loading && !searching && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No assets found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
        </div>
      )}

      {searching && assets.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Searching...</p>
        </div>
      )}
    </div>
  );
};

export default Market;
