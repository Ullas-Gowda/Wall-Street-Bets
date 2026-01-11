import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { tradingAPI, marketAPI } from '../api';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const Trade = () => {
  const { user } = useAuth();
  const [symbol, setSymbol] = useState('AAPL');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('BUY');
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'BTC', 'ETH', 'XRP', 'ADA', 'SOL'];

  const fetchPrice = async (sym) => {
    try {
      const res = await marketAPI.getPrice(sym);
      setPrice(res.data.currentPrice);
    } catch (err) {
      setMessage('Failed to fetch price');
      setMessageType('error');
    }
  };

  const handleSymbolChange = (e) => {
    const newSymbol = e.target.value;
    setSymbol(newSymbol);
    fetchPrice(newSymbol);
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

    try {
      if (type === 'BUY') {
        await tradingAPI.buyAsset({ symbol, quantity: parseInt(quantity) });
        setMessageType('success');
        setMessage(`Successfully bought ${quantity} share(s) of ${symbol}!`);
      } else {
        await tradingAPI.sellAsset({ symbol, quantity: parseInt(quantity) });
        setMessageType('success');
        setMessage(`Successfully sold ${quantity} share(s) of ${symbol}!`);
      }
      setQuantity('');
      fetchPrice(symbol);
    } catch (err) {
      setMessageType('error');
      setMessage(err || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalValue = price && quantity ? (price * quantity).toFixed(2) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Trade</h1>
        <p className="text-gray-400">Buy or sell assets in the market</p>
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
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                        type === t
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
                  {symbols.map((sym) => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
              </div>

              {/* Current Price */}
              {price && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <p className="text-gray-400 text-sm mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-white">${price.toFixed(2)}</p>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
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
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  messageType === 'error'
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
                className={`w-full py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  type === 'BUY'
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
                <p className="text-2xl font-bold text-white">${user?.balance?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-gray-400 text-sm mb-1">Max Shares ({symbol})</p>
                <p className="text-2xl font-bold text-blue-400">
                  {price ? Math.floor(user?.balance / price) : 0}
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
