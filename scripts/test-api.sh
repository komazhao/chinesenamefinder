#!/bin/bash

# API 测试脚本
# API Testing Script for Chinese Name Finder

set -e

# 配置
BASE_URL="http://localhost:3000"
if [ "$1" = "production" ]; then
    BASE_URL="https://your-domain.com"
fi

echo "🧪 开始 API 测试..."
echo "Testing API endpoints at: $BASE_URL"
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试结果统计
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=${4:-200}
    local data=${5:-""}
    local headers=${6:-""}

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "Testing: $description... "

    if [ -n "$data" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method \
                -H "Content-Type: application/json" \
                -H "$headers" \
                -d "$data" \
                "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method \
                -H "Content-Type: application/json" \
                -d "$data" \
                "$BASE_URL$endpoint")
        fi
    else
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -H "$headers" "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
        fi
    fi

    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')

    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($status_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        echo "Response: $response_body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# 1. 基础健康检查
echo -e "\n${YELLOW}📋 基础端点测试${NC}"
test_endpoint "GET" "/" "主页加载" 200
test_endpoint "GET" "/api/health" "健康检查" 200

# 2. 认证相关测试
echo -e "\n${YELLOW}🔐 认证功能测试${NC}"
test_endpoint "POST" "/api/auth/register" "用户注册 (无数据)" 400 ""
test_endpoint "POST" "/api/auth/login" "用户登录 (无数据)" 400 ""

# 3. AI 起名功能测试
echo -e "\n${YELLOW}🤖 AI 起名功能测试${NC}"
test_endpoint "POST" "/api/generate-name" "AI起名 (未授权)" 401 '{"englishName":"John","gender":"male","style":"modern"}'

# 4. 名字管理功能测试
echo -e "\n${YELLOW}📝 名字管理功能测试${NC}"
test_endpoint "GET" "/api/names" "获取名字列表 (未授权)" 401
test_endpoint "POST" "/api/names" "创建名字 (未授权)" 401

# 5. 支付功能测试
echo -e "\n${YELLOW}💳 支付功能测试${NC}"
test_endpoint "POST" "/api/create-payment" "创建支付 (未授权)" 401 '{"planType":"basic"}'
test_endpoint "POST" "/api/stripe-webhook" "Stripe Webhook (无签名)" 400 '{}'

# 6. 静态资源测试
echo -e "\n${YELLOW}📁 静态资源测试${NC}"
test_endpoint "GET" "/favicon.ico" "网站图标" 200

# 7. 错误处理测试
echo -e "\n${YELLOW}⚠️ 错误处理测试${NC}"
test_endpoint "GET" "/api/nonexistent" "不存在的端点" 404
test_endpoint "POST" "/api/generate-name" "错误的请求格式" 400 '{"invalid":"data"}'

# 8. 性能测试
echo -e "\n${YELLOW}⚡ 性能测试${NC}"
start_time=$(date +%s)
test_endpoint "GET" "/" "响应时间测试" 200
end_time=$(date +%s)
response_time=$((end_time - start_time))

if [ $response_time -le 3 ]; then
    echo -e "${GREEN}✅ 响应时间良好: ${response_time}s${NC}"
else
    echo -e "${YELLOW}⚠️ 响应时间较慢: ${response_time}s${NC}"
fi

# 测试结果汇总
echo -e "\n${YELLOW}📊 测试结果汇总${NC}"
echo "=================================="
echo "总测试数: $TOTAL_TESTS"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 所有测试通过！${NC}"
    exit 0
else
    echo -e "\n${RED}❌ 有 $FAILED_TESTS 个测试失败${NC}"
    exit 1
fi