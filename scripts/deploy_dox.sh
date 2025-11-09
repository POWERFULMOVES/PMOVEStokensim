#!/bin/bash
#
# PMOVES-DoX Deployment Quick Start Script
# Run this on your local machine with Docker installed
#

set -e

echo "🚀 PMOVES-DoX Deployment Quick Start"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
echo -e "${BLUE}[1/6]${NC} Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}❌ Docker not found!${NC}"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker found: $(docker --version)${NC}"
echo ""

# Check Docker Compose
echo -e "${BLUE}[2/6]${NC} Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}❌ Docker Compose not found!${NC}"
    echo "Please install Docker Compose or update Docker Desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose found: $(docker compose version)${NC}"
echo ""

# Navigate to DoX directory
echo -e "${BLUE}[3/6]${NC} Setting up PMOVES-DoX..."
DOX_DIR="/home/user/PMOVES-DoX"
if [ ! -d "$DOX_DIR" ]; then
    echo -e "${YELLOW}❌ DoX directory not found at $DOX_DIR${NC}"
    echo "Please clone the repository first:"
    echo "  git clone https://github.com/POWERFULMOVES/PMOVES-DoX.git $DOX_DIR"
    exit 1
fi
cd "$DOX_DIR"
echo -e "${GREEN}✅ Found DoX directory${NC}"
echo ""

# Create .env file
echo -e "${BLUE}[4/6]${NC} Creating .env configuration..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from template${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Deploy with Docker Compose (CPU profile)
echo -e "${BLUE}[5/6]${NC} Deploying PMOVES-DoX (CPU profile)..."
echo "This will:"
echo "  - Build backend (FastAPI + IBM Granite Docling)"
echo "  - Build frontend (Next.js + React)"
echo "  - Download AI models (~2-3 GB first time)"
echo "  - Start services on ports 8484 (backend) and 3737 (frontend)"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

docker compose -f docker-compose.cpu.yml up --build -d

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}[6/6]${NC} Waiting for services to be ready..."
echo "This may take 30-60 seconds..."
sleep 10

# Check backend health
MAX_RETRIES=12
RETRY_COUNT=0
until curl -f http://localhost:8484/health &> /dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e "${YELLOW}⚠️  Backend health check timeout${NC}"
        echo "Check logs with: docker compose -f docker-compose.cpu.yml logs -f backend"
        break
    fi
    echo "  Waiting for backend... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 5
done

if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo -e "${GREEN}✅ Backend is healthy!${NC}"
fi
echo ""

# Display status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 PMOVES-DoX is running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Access points:"
echo "  📊 Frontend:  http://localhost:3737"
echo "  🔧 Backend:   http://localhost:8484"
echo "  📖 API Docs:  http://localhost:8484/docs"
echo ""
echo "Test the integration:"
echo "  cd /home/user/PMOVEStokensim"
echo "  python scripts/integrate_with_dox.py"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose -f docker-compose.cpu.yml logs -f"
echo "  Stop:         docker compose -f docker-compose.cpu.yml down"
echo "  Restart:      docker compose -f docker-compose.cpu.yml restart"
echo ""
echo "Next steps:"
echo "  1. Visit http://localhost:3737"
echo "  2. Try uploading a CSV or PDF"
echo "  3. Run the integration script to test with simulation data"
echo ""
echo -e "${GREEN}Happy analyzing! 🚀${NC}"
