<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/244e97e3-962e-41b5-bbbf-8c485ad24207" />
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/507a18c6-8cd8-417e-8d49-4279f1dc9b68" />

Installation Steps:

1. clone repository
2. Then execute "npm install"
3. Then execute "npm run dev" and open this on browser("http://localhost:3000/").

Formulas Used:

1. Basis (Middle Band) = SMA(source, length)
2. StdDev = √( Σ(x − μ)² / N )
3. Using Population StdDev (denominator = N).
4. Upper = Basis + (StdDev Multiplier × StdDev)
5. Lower = Basis − (StdDev Multiplier × StdDev)
6. Offset = Shifts bands by N bars (positive = forward shift)

KLineCharts package - v10
Candlestick chart using KLineCharts
