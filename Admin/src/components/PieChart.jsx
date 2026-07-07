import React from 'react';

const data = [
  { label: 'Admin', value: 80 },
  { label: 'User', value: 50 },
  { label: 'Moderator', value: 65 },
];

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

const PieChart = () => {
  const blockedRoles = ["shopkeeper", "guest"];
  const userRole = localStorage.getItem("name");
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const createArc = (startAngle, endAngle) => {
    const rad = Math.PI / 180;
    const radius = 100;
    const cx = 120;
    const cy = 120;

    const x1 = cx + radius * Math.cos(rad * startAngle);
    const y1 = cy + radius * Math.sin(rad * startAngle);

    const x2 = cx + radius * Math.cos(rad * endAngle);
    const y2 = cy + radius * Math.sin(rad * endAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
  };

  let cumulativeAngle = 0;

if (!blockedRoles.includes(userRole)) {
  return (
    <svg width={240} height={240}>
      {data.map(({ label, value }, index) => {
        const sliceAngle = (value / total) * 360;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + sliceAngle;
        const path = createArc(startAngle, endAngle);

        // Compute midpoint angle
        const midAngle = (startAngle + endAngle) / 2;
        const rad = Math.PI / 180;
        const cx = 120;
        const cy = 120;
        const labelRadius = 60; // distance from center to label (inside slice)

        const labelX = cx + labelRadius * Math.cos(midAngle * rad);
        const labelY = cy + labelRadius * Math.sin(midAngle * rad);

        cumulativeAngle += sliceAngle;

        return (
          <g key={label}>
            <path d={path} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth="2" />
            <text
              x={labelX}
              y={labelY}
              fill="#fff"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
};

export default PieChart;
