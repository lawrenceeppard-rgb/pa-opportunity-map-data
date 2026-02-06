# Deployment Guide

## Quick Start with GitHub

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub
2. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

### Step 2: Upload Files

Copy all files to your repository:
```bash
# Copy the data folder (contains all census tract data)
cp -r data/ /path/to/your-repo/

# Copy the HTML file
cp index.html /path/to/your-repo/

# Copy README
cp README.md /path/to/your-repo/
```

### Step 3: Configure GitHub URLs

Edit `index.html` and update line 249-253:

**Before:**
```javascript
const CONFIG = {
    GITHUB_BASE_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data',
    USE_LOCAL_DATA: true,
    LOCAL_DATA_PATH: './data'
};
```

**After:**
```javascript
const CONFIG = {
    GITHUB_BASE_URL: 'https://raw.githubusercontent.com/username/pa-census-tracts/main/data',
    USE_LOCAL_DATA: false,  // Changed to false!
    LOCAL_DATA_PATH: './data'
};
```

### Step 4: Push to GitHub

```bash
cd /path/to/your-repo
git add .
git commit -m "Initial commit: PA Census Tracts Interactive Map"
git push origin main
```

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## GitHub Raw URL Format

GitHub serves raw files at:
```
https://raw.githubusercontent.com/[username]/[repo]/[branch]/[path]
```

Example:
```
https://raw.githubusercontent.com/john-doe/pa-census-tracts/main/data/county_index.json
```

## Testing Your Deployment

### Test Data Loading

Open browser console (F12) and check for:
1. "Loaded data for 3446 tracts" - means tract data loaded successfully
2. No CORS errors
3. Network tab shows successful fetches from GitHub

### Test Search Functionality

1. Switch to "Tract #" tab
2. Search for "4591.01"
3. Should see search results
4. Click a result to view the tract

### Test Map Display

1. Click "Load All Counties" button (if you add one)
2. Or select a tract from search results
3. Map should center on the selected tract
4. Sidebar should show tract information

## Adding Address Geocoding

### Using Nominatim (Free, Open Source)

Add this function to your JavaScript:

```javascript
async function geocodeAddress(address) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(address + ', Pennsylvania, USA')}&` +
            `format=json&` +
            `limit=5&` +
            `countrycodes=us`
        );
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('Geocoding error:', error);
        return [];
    }
}
```

Then update the search functionality:

```javascript
document.getElementById('searchInput').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (query.length < 3) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    if (searchType === 'address') {
        const locations = await geocodeAddress(query);
        
        if (locations.length === 0) {
            resultsDiv.innerHTML = '<div style="padding: 15px;">No locations found</div>';
        } else {
            resultsDiv.innerHTML = locations.map(loc => `
                <div class="search-result-item" onclick="goToLocation(${loc.lat}, ${loc.lon}, '${loc.display_name}')">
                    <div class="result-name">${loc.display_name}</div>
                </div>
            `).join('');
        }
        resultsDiv.style.display = 'block';
    }
    // ... rest of search logic
});
```

Add the location handler:

```javascript
async function goToLocation(lat, lon, name) {
    map.setView([lat, lon], 13);
    
    // Find which tract this location is in
    const point = turf.point([lon, lat]);
    
    // You'll need to check each county to find the containing tract
    // This is a simplified version
    for (const [countyCode, countyInfo] of Object.entries(countyIndex)) {
        const geojson = await loadCounty(countyCode);
        
        for (const feature of geojson.features) {
            const polygon = turf.polygon(feature.geometry.coordinates);
            if (turf.booleanPointInPolygon(point, polygon)) {
                showTract(feature.properties.GEOID);
                return;
            }
        }
    }
    
    // If no tract found, just show the location
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(name)
        .openPopup();
}
```

**Note:** This requires the Turf.js library for spatial operations:
```html
<script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>
```

## Performance Optimization Tips

### 1. Simplify Geometries Further

If files are still too large, reduce coordinate precision:

```python
def simplify_coords(coords, precision=3):  # Changed from 4 to 3
    if isinstance(coords[0], list):
        return [simplify_coords(c, precision) for c in coords]
    else:
        return [round(coords[0], precision), round(coords[1], precision)]
```

### 2. Use CDN for Faster Loading

Consider using a CDN like jsDelivr for GitHub files:
```
https://cdn.jsdelivr.net/gh/username/repo@main/data/county_index.json
```

### 3. Add Service Worker for Caching

Cache data files locally after first load:

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('github')) {
        event.respondWith(
            caches.open('census-data').then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((fetchResponse) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
});
```

### 4. Lazy Load Counties

Only load counties when the map viewport intersects them:

```javascript
map.on('moveend', async () => {
    const bounds = map.getBounds();
    // Load counties that intersect with current view
    // Implementation depends on your needs
});
```

## Common Issues and Solutions

### Issue: CORS Errors

**Solution:** Make sure you're using `raw.githubusercontent.com`, not regular GitHub URLs.

### Issue: Data Not Loading

**Solution:** 
1. Check browser console for errors
2. Verify GitHub URLs are correct
3. Ensure files are pushed to the main branch
4. Wait a few minutes after pushing (GitHub cache)

### Issue: Slow Performance

**Solution:**
1. Don't load all counties at once
2. Use coordinate precision of 3-4 decimal places
3. Implement viewport-based loading
4. Add caching with service worker

### Issue: Mobile Performance

**Solution:**
1. Reduce initial data load
2. Use touch-optimized controls
3. Consider loading lower-resolution boundaries on mobile
4. Add loading indicators

## Monitoring and Analytics

Add Google Analytics or similar to track usage:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Security Considerations

1. **No API Keys in Code:** Don't commit API keys to GitHub
2. **Rate Limiting:** Implement rate limiting for geocoding services
3. **Input Validation:** Sanitize all user inputs
4. **HTTPS Only:** Ensure all external resources use HTTPS

## Backup and Version Control

1. **Tag Releases:**
   ```bash
   git tag -a v1.0 -m "Initial release"
   git push origin v1.0
   ```

2. **Backup Data:**
   Keep original shapefiles and processing scripts

3. **Document Changes:**
   Update README with each major change

## Next Steps

1. ✅ Deploy to GitHub
2. ✅ Test on multiple browsers
3. ⬜ Add address geocoding
4. ⬜ Integrate demographic data
5. ⬜ Add data export features
6. ⬜ Create mobile-optimized version
7. ⬜ Add user analytics
8. ⬜ Implement caching strategy

## Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Leaflet Documentation](https://leafletjs.com/)
- [Nominatim API](https://nominatim.org/release-docs/latest/api/Overview/)
- [Turf.js Documentation](https://turfjs.org/)
