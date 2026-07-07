import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

// ✅ This is a valid TopoJSON map file
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json";

// ✅ Example user data by country (ISO Alpha-3 codes)
const userData = {
  USA: 120,
  IND: 80,
  CHN: 95,
  BRA: 40,
  CAN: 30,
  AUS: 20,
};

const colorScale = (value) => {
  if (!value) return '#eee';
  if (value > 100) return '#006400';
  if (value > 50) return '#32CD32';
  return '#90EE90';
};

const WorldUserMap = () => {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Users by Country</h2>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.properties.ISO_A3;
              const userCount = userData[countryCode];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(userCount)}
                  stroke="#D6D6DA"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#FFD700", outline: "none" },
                    pressed: { outline: "none" }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldUserMap;
