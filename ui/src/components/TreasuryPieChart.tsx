import { useMemo, useState } from "react";

interface PieChartData {
  label: string;
  value: number;
  color: string;
  symbol?: string;
  logo?: string;
}

interface TreasuryPieChartProps {
  data: PieChartData[];
}

export function TreasuryPieChart({ data }: TreasuryPieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate total and percentages
  const { total, segments } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
      return { total: 0, segments: [] };
    }

    let currentAngle = -90; // Start from top
    const segments = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        index,
      };
    });

    return { total, segments };
  }, [data]);

  // Generate SVG path for a pie slice
  const generatePath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number = 0
  ) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + outerRadius * Math.cos(startRad);
    const y1 = 100 + outerRadius * Math.sin(startRad);
    const x2 = 100 + outerRadius * Math.cos(endRad);
    const y2 = 100 + outerRadius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (innerRadius === 0) {
      // Regular pie chart
      return `M 100 100 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    } else {
      // Donut chart
      const x3 = 100 + innerRadius * Math.cos(endRad);
      const y3 = 100 + innerRadius * Math.sin(endRad);
      const x4 = 100 + innerRadius * Math.cos(startRad);
      const y4 = 100 + innerRadius * Math.sin(startRad);

      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    }
  };

  // Color palette for different assets
  const colors = [
    "#FFE97F", // Gold
    "#1aff5c", // Green
    "#FF6B6B", // Red
    "#4ECDC4", // Cyan
    "#95E1D3", // Mint
    "#F38181", // Pink
    "#AA96DA", // Purple
    "#FCBAD3", // Light Pink
    "#A8D8EA", // Light Blue
    "#FFD93D", // Yellow
  ];

  const enrichedSegments = segments.map((segment, index) => ({
    ...segment,
    color: segment.color || colors[index % colors.length],
  }));

  // Smart USD formatter that adjusts decimals based on value magnitude
  const formatUsdSmart = (value: number): string => {
    if (value === 0) return "$0.00";

    const absValue = Math.abs(value);

    // For very large values (>= $1M), show no decimals
    if (absValue >= 1_000_000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    // For large values (>= $1000), show 2 decimals
    if (absValue >= 1000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // For medium values ($1 - $1000), show 2 decimals
    if (absValue >= 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // For small values ($0.01 - $1), show 4 decimals
    if (absValue >= 0.01) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(value);
    }

    // For very small values ($0.0001 - $0.01), show 6 decimals
    if (absValue >= 0.0001) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(value);
    }

    // For extremely small values (< $0.0001), use scientific notation
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  // Standard formatter for total (always 2 decimals)
  const formatUsd = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (total === 0 || segments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      {/* Pie Chart */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 0 200 200"
          className="w-80 h-80 lg:w-96 lg:h-96 transform transition-transform duration-300"
        >
          {enrichedSegments.map((segment) => {
            const isHovered = hoveredIndex === segment.index;
            const outerRadius = isHovered ? 92 : 90;
            const innerRadius = 55; // Larger donut hole for more center space

            return (
              <g key={segment.index}>
                <path
                  d={generatePath(
                    segment.startAngle,
                    segment.endAngle,
                    outerRadius,
                    innerRadius
                  )}
                  fill={segment.color}
                  stroke="rgba(10,10,10,0.8)"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(segment.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered
                      ? "brightness(1.2) drop-shadow(0 0 8px currentColor)"
                      : "none",
                  }}
                />
              </g>
            );
          })}

          {/* Center text */}
          <text
            x="100"
            y="92"
            textAnchor="middle"
            className="text-xs fill-gray-400 uppercase tracking-wider"
            style={{ fontSize: "11px" }}
          >
            Total Value
          </text>
          <text
            x="100"
            y="108"
            textAnchor="middle"
            className="text-lg font-bold fill-[#FFE97F] font-['Cinzel']"
            style={{ fontSize: "16px", fontWeight: 700 }}
          >
            {formatUsd(total)}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {enrichedSegments.map((segment) => {
          const isHovered = hoveredIndex === segment.index;

          return (
            <div
              key={segment.index}
              onMouseEnter={() => setHoveredIndex(segment.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                p-3 rounded-lg border transition-all duration-200 cursor-pointer
                ${
                  isHovered
                    ? "border-[#FFE97F] bg-[rgba(255,233,127,0.1)]"
                    : "border-[rgb(8,62,34)] bg-[rgba(24,40,24,0.3)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Color indicator */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />

                {/* Token logo if available */}
                {segment.logo && (
                  <img
                    src={segment.logo}
                    alt={segment.label}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#FFE97F] truncate">
                      {segment.symbol || segment.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {segment.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatUsdSmart(segment.value)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
