Installation Steps:

1. clone repository
2. Then execute "npm install"
3. Then execute "npm run dev" and open this on browser("http://localhost:3000/").

Formulas Used:

Basis (Middle Band) = SMA(source, length)
StdDev = √( Σ(x − μ)² / N )
Using Population StdDev (denominator = N).
Upper = Basis + (StdDev Multiplier × StdDev)
Lower = Basis − (StdDev Multiplier × StdDev)
Offset = Shifts bands by N bars (positive = forward shift)

KLineCharts package - v10
Candlestick chart using KLineCharts

Bollinger Bands overlay:
Inputs: Length, MA Type (SMA), Source (Close), StdDev Multiplier, Offset
Style: visibility, color, line width, line style (solid/dashed)
Background fill with opacity
Tooltip shows Basis / Upper / Lower values for hovered candle
Instant updates on input changes
