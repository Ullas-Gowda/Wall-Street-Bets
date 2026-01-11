#!/bin/bash

BASE_URL="http://localhost:5001/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "======================================="
echo "  Wall Street Bets API Test Suite"
echo "======================================="
echo

# Colors for results
pass() {
    echo -e "${GREEN}✓ PASS${NC} - $1"
}

fail() {
    echo -e "${RED}✗ FAIL${NC} - $1"
}

info() {
    echo -e "${YELLOW}ℹ INFO${NC} - $1"
}

# 1. Test Signup
echo "Testing Authentication Endpoints..."
echo

SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    pass "Signup endpoint - User registered successfully"
else
    fail "Signup endpoint - Failed to get token"
    echo "Response: $SIGNUP_RESPONSE"
fi

# 2. Test Login
echo

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
    pass "Login endpoint - User logged in successfully"
else
    fail "Login endpoint"
    echo "Response: $LOGIN_RESPONSE"
fi

# 3. Test Get Current User
echo

ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ME_RESPONSE" | grep -q "test@example.com"; then
    pass "Get Current User - Retrieved user info"
else
    fail "Get Current User"
    echo "Response: $ME_RESPONSE"
fi

# Test Trading Endpoints
echo
echo "Testing Trading Endpoints..."
echo

# 4. Test Buy Asset
BUY_RESPONSE=$(curl -s -X POST "$BASE_URL/trade/buy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "pricePerUnit": 182.52,
    "type": "stock"
  }')

if echo "$BUY_RESPONSE" | grep -q "Buy order executed"; then
    pass "Buy Asset - Purchased AAPL"
else
    fail "Buy Asset"
    echo "Response: $BUY_RESPONSE"
fi

# 5. Test Get Portfolio
PORTFOLIO_RESPONSE=$(curl -s -X GET "$BASE_URL/trade/portfolio" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PORTFOLIO_RESPONSE" | grep -q "AAPL"; then
    pass "Get Portfolio - Retrieved portfolio with holdings"
else
    fail "Get Portfolio"
    echo "Response: $PORTFOLIO_RESPONSE"
fi

# 6. Test Get Transactions
TX_RESPONSE=$(curl -s -X GET "$BASE_URL/trade/transactions" \
  -H "Authorization: Bearer $TOKEN")

if echo "$TX_RESPONSE" | grep -q "BUY"; then
    pass "Get Transactions - Retrieved transaction history"
else
    fail "Get Transactions"
    echo "Response: $TX_RESPONSE"
fi

# 7. Test Get Single Holding
HOLDING_RESPONSE=$(curl -s -X GET "$BASE_URL/trade/holding/AAPL" \
  -H "Authorization: Bearer $TOKEN")

if echo "$HOLDING_RESPONSE" | grep -q "AAPL"; then
    pass "Get Single Holding - Retrieved AAPL holding details"
else
    fail "Get Single Holding"
    echo "Response: $HOLDING_RESPONSE"
fi

# 8. Test Sell Asset
SELL_RESPONSE=$(curl -s -X POST "$BASE_URL/trade/sell" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "quantity": 5,
    "pricePerUnit": 185.00,
    "type": "stock"
  }')

if echo "$SELL_RESPONSE" | grep -q "Sell order executed"; then
    pass "Sell Asset - Sold AAPL shares"
else
    fail "Sell Asset"
    echo "Response: $SELL_RESPONSE"
fi

# Test Market Endpoints
echo
echo "Testing Market Data Endpoints (No Auth Required)..."
echo

# 9. Test Get Market Price
PRICE_RESPONSE=$(curl -s -X GET "$BASE_URL/market/price/AAPL")

if echo "$PRICE_RESPONSE" | grep -q "Apple"; then
    pass "Get Market Price - Retrieved AAPL price"
else
    fail "Get Market Price"
    echo "Response: $PRICE_RESPONSE"
fi

# 10. Test Get Multiple Prices
PRICES_RESPONSE=$(curl -s -X GET "$BASE_URL/market/prices?symbols=AAPL&symbols=BTC")

if echo "$PRICES_RESPONSE" | grep -q "prices"; then
    pass "Get Multiple Prices - Retrieved multiple asset prices"
else
    fail "Get Multiple Prices"
    echo "Response: $PRICES_RESPONSE"
fi

# 11. Test Get Price History
HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/market/history/AAPL")

if echo "$HISTORY_RESPONSE" | grep -q "history"; then
    pass "Get Price History - Retrieved price history"
else
    fail "Get Price History"
    echo "Response: $HISTORY_RESPONSE"
fi

# 12. Test Search Assets
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/market/search?q=Apple")

if echo "$SEARCH_RESPONSE" | grep -q "results"; then
    pass "Search Assets - Found matching assets"
else
    fail "Search Assets"
    echo "Response: $SEARCH_RESPONSE"
fi

# 13. Test Get Trending
TRENDING_RESPONSE=$(curl -s -X GET "$BASE_URL/market/trending")

if echo "$TRENDING_RESPONSE" | grep -q "trending"; then
    pass "Get Trending - Retrieved trending assets"
else
    fail "Get Trending"
    echo "Response: $TRENDING_RESPONSE"
fi

# 14. Test Get Market Overview
OVERVIEW_RESPONSE=$(curl -s -X GET "$BASE_URL/market/overview")

if echo "$OVERVIEW_RESPONSE" | grep -q "assets"; then
    pass "Get Market Overview - Retrieved all assets"
else
    fail "Get Market Overview"
    echo "Response: $OVERVIEW_RESPONSE"
fi

echo
echo "======================================="
echo "  Test Suite Complete"
echo "======================================="
