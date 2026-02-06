# Adding Census Demographic Data

This guide shows how to enhance your map with demographic data from the Census API.

## Overview

The Census Bureau provides free API access to demographic data. You can fetch:
- Population counts
- Age distribution
- Income statistics
- Housing data
- And much more

## Getting a Census API Key

1. Visit: https://api.census.gov/data/key_signup.html
2. Sign up for a free API key
3. You'll receive the key via email

## Example: Fetching Population Data

### JavaScript Integration

Add this to your `index.html`:

```javascript
// Census API configuration
const CENSUS_API_KEY = 'YOUR_API_KEY_HERE';
const CENSUS_API_BASE = 'https://api.census.gov/data/2021/acs/acs5';

// Fetch demographic data for a tract
async function getCensusData(geoid) {
    // Extract state, county, and tract from GEOID
    // GEOID format: SSCCCTTTTTT (State, County, Tract)
    const state = geoid.substring(0, 2);
    const county = geoid.substring(2, 5);
    const tract = geoid.substring(5);
    
    try {
        // Request multiple variables at once
        const variables = [
            'B01003_001E',  // Total population
            'B19013_001E',  // Median household income
            'B25077_001E',  // Median home value
            'B01002_001E',  // Median age
            'B25001_001E',  // Total housing units
            'B25003_002E',  // Owner-occupied units
            'B25003_003E'   // Renter-occupied units
        ].join(',');
        
        const url = `${CENSUS_API_BASE}?get=NAME,${variables}&for=tract:${tract}&in=state:${state}%20county:${county}&key=${CENSUS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length < 2) return null;
        
        // Parse the response (first row is headers, second is data)
        const headers = data[0];
        const values = data[1];
        
        const result = {};
        headers.forEach((header, i) => {
            result[header] = values[i];
        });
        
        return {
            population: parseInt(result['B01003_001E']) || 0,
            medianIncome: parseInt(result['B19013_001E']) || 0,
            medianHomeValue: parseInt(result['B25077_001E']) || 0,
            medianAge: parseFloat(result['B01002_001E']) || 0,
            totalHousing: parseInt(result['B25001_001E']) || 0,
            ownerOccupied: parseInt(result['B25003_002E']) || 0,
            renterOccupied: parseInt(result['B25003_003E']) || 0
        };
    } catch (error) {
        console.error('Census API error:', error);
        return null;
    }
}

// Update displayTractInfo to include census data
async function displayTractInfo(geoid) {
    const data = tractData[geoid];
    
    if (!data) {
        showError('Tract data not found');
        return;
    }
    
    // Show loading state
    document.getElementById('tractInfo').innerHTML = `
        <div class="tract-info">
            <div class="tract-header">
                <div class="tract-name">${data.name}</div>
                <div class="tract-id">GEOID: ${geoid}</div>
            </div>
            <div class="loading">Loading demographic data...</div>
        </div>
    `;
    showSection('tractInfo');
    
    // Fetch census data
    const censusData = await getCensusData(geoid);
    
    // Build HTML with all data
    const html = `
        <div class="tract-info">
            <div class="tract-header">
                <div class="tract-name">${data.name}</div>
                <div class="tract-id">GEOID: ${geoid}</div>
            </div>
            
            ${censusData ? `
                <h3 style="margin: 20px 0 10px 0; color: #667eea;">Demographics (2021 ACS)</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Total Population</div>
                        <div class="info-value">${censusData.population.toLocaleString()}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Median Age</div>
                        <div class="info-value">${censusData.medianAge} years</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Median Household Income</div>
                        <div class="info-value">$${censusData.medianIncome.toLocaleString()}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Median Home Value</div>
                        <div class="info-value">$${censusData.medianHomeValue.toLocaleString()}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Total Housing Units</div>
                        <div class="info-value">${censusData.totalHousing.toLocaleString()}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Homeownership Rate</div>
                        <div class="info-value">${((censusData.ownerOccupied / (censusData.ownerOccupied + censusData.renterOccupied)) * 100).toFixed(1)}%</div>
                    </div>
                </div>
            ` : '<div class="error">Unable to load demographic data</div>'}
            
            <h3 style="margin: 20px 0 10px 0; color: #667eea;">Geographic Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Tract Number</div>
                    <div class="info-value">${data.tractNumber}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">County Code</div>
                    <div class="info-value">${data.county}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Land Area</div>
                    <div class="info-value">${formatArea(data.landArea)} sq mi</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Water Area</div>
                    <div class="info-value">${formatArea(data.waterArea)} sq mi</div>
                </div>
                
                ${censusData ? `
                    <div class="info-item">
                        <div class="info-label">Population Density</div>
                        <div class="info-value">${(censusData.population / formatArea(data.landArea)).toFixed(1)} per sq mi</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('tractInfo').innerHTML = html;
}
```

## Caching Census Data

To avoid repeated API calls, implement caching:

```javascript
// Cache for census data
const censusCache = new Map();

async function getCensusData(geoid) {
    // Check cache first
    if (censusCache.has(geoid)) {
        return censusCache.get(geoid);
    }
    
    // Fetch from API
    const data = await fetchCensusDataFromAPI(geoid);
    
    // Store in cache
    if (data) {
        censusCache.set(geoid, data);
    }
    
    return data;
}
```

## Pre-fetching Demographic Data

For better performance, pre-fetch all census data and store it with your tract data:

### Python Script to Fetch All Data

```python
import requests
import json
import time

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.census.gov/data/2021/acs/acs5'

# Load existing tract data
with open('pa_tracts_data.json', 'r') as f:
    tract_data = json.load(f)

# Fetch census data for all tracts
enhanced_data = {}

for geoid, data in tract_data.items():
    state = geoid[0:2]
    county = geoid[2:5]
    tract = geoid[5:]
    
    variables = [
        'B01003_001E',  # Total population
        'B19013_001E',  # Median household income
        'B25077_001E',  # Median home value
        'B01002_001E',  # Median age
        'B25001_001E',  # Total housing units
        'B25003_002E',  # Owner-occupied
        'B25003_003E'   # Renter-occupied
    ]
    
    url = f"{BASE_URL}?get=NAME,{','.join(variables)}&for=tract:{tract}&in=state:{state}%20county:{county}&key={API_KEY}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            result = response.json()
            if len(result) > 1:
                headers = result[0]
                values = result[1]
                
                census_data = dict(zip(headers, values))
                
                # Add to existing data
                enhanced_data[geoid] = {
                    **data,
                    'demographics': {
                        'population': int(census_data.get('B01003_001E', 0)),
                        'medianIncome': int(census_data.get('B19013_001E', 0)),
                        'medianHomeValue': int(census_data.get('B25077_001E', 0)),
                        'medianAge': float(census_data.get('B01002_001E', 0)),
                        'totalHousing': int(census_data.get('B25001_001E', 0)),
                        'ownerOccupied': int(census_data.get('B25003_002E', 0)),
                        'renterOccupied': int(census_data.get('B25003_003E', 0))
                    }
                }
                
                print(f"Fetched data for {geoid}")
        
        # Rate limiting - Census API allows 500 requests per day
        time.sleep(0.5)
        
    except Exception as e:
        print(f"Error fetching {geoid}: {e}")
        enhanced_data[geoid] = data

# Save enhanced data
with open('pa_tracts_data_enhanced.json', 'w') as f:
    json.dump(enhanced_data, f, indent=2)

print(f"Enhanced data saved with {len(enhanced_data)} tracts")
```

## Census Variable Reference

### Population Variables
- `B01003_001E` - Total population
- `B01001_002E` - Male population
- `B01001_026E` - Female population
- `B01002_001E` - Median age

### Income Variables
- `B19013_001E` - Median household income
- `B19301_001E` - Per capita income
- `B17001_002E` - Population below poverty level

### Housing Variables
- `B25001_001E` - Total housing units
- `B25002_002E` - Occupied housing units
- `B25002_003E` - Vacant housing units
- `B25003_002E` - Owner-occupied units
- `B25003_003E` - Renter-occupied units
- `B25077_001E` - Median home value
- `B25064_001E` - Median gross rent

### Education Variables
- `B15003_022E` - Bachelor's degree
- `B15003_023E` - Master's degree
- `B15003_024E` - Professional degree
- `B15003_025E` - Doctorate degree

### Race Variables
- `B02001_002E` - White alone
- `B02001_003E` - Black or African American alone
- `B02001_004E` - American Indian and Alaska Native alone
- `B02001_005E` - Asian alone
- `B03003_003E` - Hispanic or Latino

## Advanced Features

### 1. Choropleth Map by Population

```javascript
function colorByPopulation(population) {
    return population > 5000 ? '#800026' :
           population > 4000 ? '#BD0026' :
           population > 3000 ? '#E31A1C' :
           population > 2000 ? '#FC4E2A' :
           population > 1000 ? '#FD8D3C' :
           population > 500  ? '#FEB24C' :
           population > 250  ? '#FED976' :
                               '#FFEDA0';
}

// When displaying tracts
L.geoJSON(features, {
    style: (feature) => ({
        fillColor: colorByPopulation(feature.properties.population),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    })
}).addTo(map);
```

### 2. Legend

```javascript
const legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 250, 500, 1000, 2000, 3000, 4000, 5000];
    
    div.innerHTML = '<h4>Population</h4>';
    
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorByPopulation(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
};

legend.addTo(map);
```

### 3. Comparison Tool

```javascript
let selectedTracts = [];

function compareTracts() {
    if (selectedTracts.length < 2) {
        alert('Please select at least 2 tracts to compare');
        return;
    }
    
    const comparison = selectedTracts.map(geoid => ({
        name: tractData[geoid].name,
        ...tractData[geoid].demographics
    }));
    
    // Display comparison table
    showComparisonTable(comparison);
}
```

## API Rate Limits

**Free API Key Limits:**
- 500 requests per day per IP address
- 5 requests per second

**Solutions:**
1. Pre-fetch all data (recommended)
2. Implement aggressive caching
3. Request multiple variables in single API call

## Resources

- [Census API Documentation](https://www.census.gov/data/developers/data-sets.html)
- [Available Variables](https://api.census.gov/data/2021/acs/acs5/variables.html)
- [Census Data Explorer](https://data.census.gov/)
