import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { tradingAPI, marketAPI } from '../api';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const Trade = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [availableAssets, setAvailableAssets] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('BUY');
  const [price, setPrice] = useState(null);
  const [assetType, setAssetType] = useState('crypto');
  const [loading, setLoading] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Load available assets and check for URL param on mount
  useEffect(() => {
    loadAvailableAssets();
  }, []);

  // Check for symbol in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSymbol = params.get('symbol');
    if (urlSymbol && availableAssets.length > 0) {
      const asset = availableAssets.find(a => a.symbol.toUpperCase() === urlSymbol.toUpperCase());
      if (asset) {
        setSymbol(asset.symbol);
        setPrice(asset.current_price);
        setAssetType(asset.type || 'crypto');
      }
    }
  }, [location.search, availableAssets]);

  const loadAvailableAssets = async () => {
    try {
      setLoadingAssets(true);
      // Load both crypto and stocks
      const res = await marketAPI.getMarkets('usd', 50, 1, 'all');
      setAvailableAssets(res.data.markets || []);
      // Set first asset as default
      if (res.data.markets && res.data.markets.length > 0) {
        const firstAsset = res.data.markets[0];
        setSymbol(firstAsset.symbol);
        setPrice(firstAsset.current_price);
        setAssetType(firstAsset.type);
      }
    } catch (err) {
      console.error('Failed to load assets:', err);
      setMessage('Failed to load available assets');
      setMessageType('error');
    } finally {
      setLoadingAssets(false);
    }
  };

  const fetchPrice = async (sym) => {
    try {
      const res = await marketAPI.getPrice(sym);
      if (res.data) {
        setPrice(res.data.current_price);
        setAssetType(res.data.type || 'crypto');
      }
    } catch (err) {
      console.error('Failed to fetch price:', err);
      setMessage('Failed to fetch price');
      setMessageType('error');
    }
  };

  const handleSymbolChange = (e) => {
    const newSymbol = e.target.value;
    setSymbol(newSymbol);

    // Find the asset in available assets for quick price update
    const asset = availableAssets.find(a => a.symbol === newSymbol);
    if (asset) {
      setPrice(asset.current_price);
      setAssetType(asset.type || 'crypto');
    } else {
      fetchPrice(newSymbol);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!quantity || quantity <= 0) {
      setMessage('Please enter a valid quantity');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!price) {
      setMessage('Price not loaded. Please try again.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        symbol,
        quantity: parseFloat(quantity),
        pricePerUnit: price,
        type: assetType,
      };

      if (type === 'BUY') {
        const res = await tradingAPI.buyAsset(payload);
        setMessageType('success');
        setMessage(res.data.message || `Successfully bought ${quantity} of ${symbol}!`);
        // Update user balance using new updateUser function from context
        if (res.data.remainingBalance !== undefined && user) {
          updateUser({ ...user, balance: res.data.remainingBalance });
        }
      } else {
        const res = await tradingAPI.sellAsset(payload);
        setMessageType('success');
        setMessage(res.data.message || `Successfully sold ${quantity} of ${symbol}!`);
        // Update user balance
        if (res.data.remainingBalance !== undefined && user) {
          updateUser({ ...user, balance: res.data.remainingBalance });
        }
      }
      setQuantity('');

      // Refresh price after trade
      fetchPrice(symbol);
    } catch (err) {
      setMessageType('error');
      const errorMsg = err.response?.data?.message || err.message || 'Transaction failed. Please try again.';
      setMessage(errorMsg);
      console.error('Trade error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = price && quantity ? (price * parseFloat(quantity)).toFixed(2) : 0;

  if (loadingAssets) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Trade</h1>
        <p className="text-gray-400">Buy or sell stocks and cryptocurrencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trade Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Trade Type</label>
                <div className="flex gap-4">
                  {['BUY', 'SELL'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${type === t
                        ? t === 'BUY'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Asset</label>
                <select
                  value={symbol}
                  onChange={handleSymbolChange}
                  className="input-field"
                >
                  <option value="" disabled>Select a crypto asset</option>
                  {availableAssets.map((asset) => (
                    <option key={asset.id} value={asset.symbol}>
                      {asset.symbol} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Price */}
              {price && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-gray-400 text-sm mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-white">${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${assetType === 'crypto' ? 'bg-purple-900/30 text-purple-300' : 'bg-blue-900/30 text-blue-300'
                    }`}>
                    {assetType === 'crypto' ? 'Cryptocurrency' : 'Stock'}
                  </span>
                </div>
              )}

              {/* Quant ity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="0.00001"
                  step="0.00001"
                  className="input-field"
                />
              </div>

              {/* Total Value */}
              {quantity && price && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-gray-400 text-sm mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-white">${totalValue}</p>
                </div>
              )}

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${messageType === 'error'
                  ? 'bg-red-900/20 border border-red-500/50'
                  : 'bg-green-900/20 border border-green-500/50'
                  }`}>
                  {messageType === 'error' ? (
                    <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
                  ) : (
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  )}
                  <p className={messageType === 'error' ? 'text-red-400' : 'text-green-400'}>
                    {message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !quantity || !price}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${type === 'BUY'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {loading ? 'Processing...' : `${type} ${symbol}`}
              </button>
            </form>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Account Balance</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Available Cash</p>
                <p className="text-2xl font-bold text-white">${user?.balance?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0.00'}</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-gray-400 text-sm mb-1">Max Units ({symbol})</p>
                <p className="text-2xl font-bold text-blue-400">
                  {price && user?.balance ? (user.balance / price).toFixed(8) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Trading Tips */}
          <div className="card bg-blue-900/20 border border-blue-500/50">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Trading Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Start with small positions</li>
              <li>• Diversify your portfolio</li>
              <li>• Never risk more than you can afford</li>
              <li>• Keep emotions out of trading</li>
              <li>• Research before buying</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
