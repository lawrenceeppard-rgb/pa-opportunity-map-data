# Pennsylvania Census Tracts Interactive Map with Social Capital Data

An interactive web map displaying all 3,446 census tracts in Pennsylvania with **social capital percentages** and efficient data loading from GitHub.

## ✨ NEW: Social Capital Data Integration

When you click on a census tract, the sidebar now displays:
- **Social Capital Percentage** for each ZIP code that intersects the tract
- **City name** for each ZIP code
- **Overlap ratio** showing what percentage of the tract area each ZIP represents
- **Multiple ZIP codes** if the tract intersects with more than one

### Example Display:
```
Census Tract 4591.01

Social Capital Data
─────────────────────
ZIP 15026          54.54%
Clinton
24.5% of tract area

ZIP 15001          41.46%
Aliquippa
3.8% of tract area
```

## Features

### ✅ Core Features
- Interactive Leaflet map with zoom/pan
- Search by census tract number
- **Social capital data** for 3,437 tracts
- Sidebar with detailed tract information
- Efficient county-based data loading
- Clean, modern UI with purple gradient theme
- Responsive design for all devices

### 📊 Social Capital Data
- **Coverage**: 3,437 out of 3,446 PA census tracts (99.7%)
- **Source**: ZIP code level social capital data
- **Crosswalk**: Accurate ZIP-to-tract mapping with overlap ratios
- **Display**: Shows all relevant ZIP codes when a tract spans multiple areas
- **File Size**: 888 KB (loaded from GitHub, not embedded in HTML)

## Quick Start

### Local Testing
```bash
cd pa-census-tracts
python -m http.server 8000
# Visit: http://localhost:8000
```

### Deploy to GitHub
```bash
cd pa-census-tracts
bash deploy.sh
# Follow the prompts!
```

## Data Structure

The social capital data is stored separately from the HTML:

```javascript
// Data loaded from GitHub
{
  "42003459101": [  // Census tract GEOID
    {
      "zip": "15026",
      "socialCapital": 54.54,
      "ratio": 0.2453,
      "city": "CLINTON"
    }
  ]
}
```

## File Structure

```
pa-census-tracts/
├── index.html                          # Main application (21 KB)
├── README.md                           # This file
├── data/
    ├── social_capital.json            # Social capital data (888 KB) ← NEW
    ├── tract_data.json                # Tract information (730 KB)
    └── counties/                      # 67 county boundary files
```

## Setup Instructions

### 1. Test Locally

```bash
python -m http.server 8000
```
Open http://localhost:8000 and click on any tract to see social capital data!

### 2. Deploy to GitHub

1. Create a new GitHub repository
2. Upload all files (including the `data` folder with `social_capital.json`)
3. Update `index.html` line 250:
   ```javascript
   GITHUB_BASE_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data',
   USE_LOCAL_DATA: false
   ```
4. Enable GitHub Pages in repository settings

## Social Capital Display

### Single ZIP Code
If a tract falls entirely within one ZIP code:
```
Social Capital Data
ZIP 15026          54.54%
Clinton
100% of tract area
```

### Multiple ZIP Codes
If a tract intersects multiple ZIP codes:
```
Social Capital Data

ZIP 15026          54.54%
Clinton
24.5% of tract area

ZIP 15001          41.46%
Aliquippa
3.8% of tract area

Note: This census tract intersects with 2 ZIP codes.
Each is shown with its social capital percentage and overlap ratio.
```

## Performance

- **Initial Load**: <1 second
- **Tract Selection**: <100ms (data already loaded)
- **Total Data Size**: 888 KB social capital + 730 KB tract data
- **Browser-Friendly**: All data loaded from GitHub, not embedded

## Data Coverage

- **Total PA Census Tracts**: 3,446
- **Tracts with Social Capital Data**: 3,437 (99.7%)
- **Missing Data**: 9 tracts (0.3% - no matching ZIP code data)

## Use Cases

1. **Community Development**: Identify areas needing social cohesion programs
2. **Policy Planning**: Target interventions based on social capital metrics  
3. **Academic Research**: Study geographic patterns of social capital
4. **Urban Planning**: Understand neighborhood connectivity
5. **Grant Applications**: Demonstrate community need with data

## Customization

### Change Social Capital Colors
Find this line in `index.html` (in the `displayTractInfo` function):
```javascript
border-left: 3px solid #667eea;
```
Change `#667eea` to your preferred color.

### Add Social Capital Thresholds
You can highlight high/low social capital areas:
```javascript
const color = zip.socialCapital > 60 ? '#10b981' : 
              zip.socialCapital > 40 ? '#667eea' : '#ef4444';
```

## Browser Compatibility

✅ Chrome/Edge | ✅ Firefox | ✅ Safari | ✅ Mobile

## Future Enhancements

- [ ] Filter tracts by social capital range
- [ ] Choropleth map colored by social capital
- [ ] Compare multiple tracts
- [ ] Export data for selected tracts
- [ ] Add demographic correlations

## Data Sources

- **Census Boundaries**: U.S. Census Bureau TIGER/Line (2025)
- **Social Capital Data**: User-provided ZIP code data
- **ZIP-Tract Crosswalk**: HUD USPS ZIP Code Crosswalk (Q3 2025)

## License

- Code: MIT License
- Census Data: Public domain
- Social Capital Data: [Specify your data source license]

---

**Version 2.0** - Now with Social Capital Integration
**Coverage**: 99.7% of PA census tracts (3,437/3,446)
