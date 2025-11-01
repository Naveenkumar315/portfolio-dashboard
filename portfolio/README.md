1.Clone the Repository
  git clone https://github.com/Naveenkumar315/portfolio-dashboard.git

2.Install Frontend Dependencies
  cd frontend
  npm install --force

3.Install Backend Dependencies
  cd ../backend
  npm install --force

4.Start Frontend
  npm start

5. Start Backend
  nodemon server.js


The goal was to build a real-time portfolio dashboard that:
    Fetches CMP (Current Market Price) from Yahoo Finance
    Fetches P/E Ratio and Earnings from Google Finance
    Computes gain/loss dynamically
    Displays aggregated sector-level insights