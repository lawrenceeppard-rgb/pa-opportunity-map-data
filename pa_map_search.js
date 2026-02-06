// PA Census Tract Map Search Functionality
// This file should be hosted on GitHub and loaded by the main HTML

let tractLookupData = {};

// Initialize search functionality
async function initSearch(tractLookupUrl) {
    try {
        const response = await fetch(tractLookupUrl);
        tractLookupData = await response.json();
        console.log('Loaded tract lookup data:', Object.keys(tractLookupData).length, 'tracts');
    } catch (error) {
        console.error('Error loading tract lookup:', error);
    }
}

// Search by census tract number
function searchByTractNumber(query, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc) {
    query = query.trim();
    
    // Try exact GEOID match first (e.g., 42071011801)
    if (tractLookupData[query]) {
        zoomToTract(query, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
        return true;
    }
    
    // Try matching just the tract number (e.g., 118.01)
    const matches = Object.entries(tractLookupData).filter(([geoid, data]) => 
        data.name === query || data.name.replace('.', '') === query.replace('.', '')
    );
    
    if (matches.length === 1) {
        zoomToTract(matches[0][0], mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
        return true;
    } else if (matches.length > 1) {
        showSearchResults(matches, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
        return true;
    }
    
    // Try partial match
    const partialMatches = Object.entries(tractLookupData).filter(([geoid, data]) => 
        data.name.includes(query) || data.fullname.toLowerCase().includes(query.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
        showSearchResults(partialMatches.slice(0, 10), mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
        return true;
    }
    
    return false;
}

// Search by address or city using Nominatim
async function searchByAddress(query, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc) {
    const searchQuery = query.includes('PA') ? query : query + ', Pennsylvania, USA';
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'PA-Census-Tract-Map'
            }
        });
        const results = await response.json();
        
        if (results.length === 0) {
            return false;
        }
        
        // If single result, find the tract
        if (results.length === 1) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);
            findTractByCoordinates(lat, lon, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
            return true;
        }
        
        // Multiple results - show options
        showAddressResults(results, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
        return true;
    } catch (error) {
        console.error('Geocoding error:', error);
        return false;
    }
}

// Find which tract contains the given coordinates
function findTractByCoordinates(lat, lon, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc) {
    const point = L.latLng(lat, lon);
    
    // Check each tract layer to see if it contains the point
    for (const [geoid, layer] of Object.entries(tractLayers)) {
        const bounds = layer.getBounds();
        if (bounds.contains(point)) {
            // More precise check - is point actually inside polygon?
            const coords = layer.toGeoJSON().geometry.coordinates;
            if (isPointInPolygon([lon, lat], coords[0])) {
                zoomToTract(geoid, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
                return;
            }
        }
    }
    
    // If no exact match, find closest tract
    let closestTract = null;
    let closestDistance = Infinity;
    
    for (const [geoid, data] of Object.entries(tractLookupData)) {
        const tractPoint = L.latLng(data.lat, data.lon);
        const distance = point.distanceTo(tractPoint);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTract = geoid;
        }
    }
    
    if (closestTract) {
        zoomToTract(closestTract, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc);
    }
}

// Point in polygon check
function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        
        const intersect = ((yi > point[1]) !== (yj > point[1]))
            && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Zoom to a specific tract
function zoomToTract(geoid, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc) {
    const layer = tractLayers[geoid];
    if (layer) {
        // Trigger click on the layer
        layer.fire('click');
    }
}

// Show search results for multiple tract matches
function showSearchResults(matches, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc) {
    const resultsHtml = `
        <div style="padding: 20px;">
            <h3 style="margin-bottom: 15px; color: #1f2937;">Search Results (${matches.length})</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                ${matches.map(([geoid, data]) => `
                    <div class="search-result-item" onclick="selectSearchResult('${geoid}')" 
                         style="padding: 12px; margin-bottom: 8px; background: #f9fafb; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;">
                        <div style="font-weight: 600; color: #1f2937;">${data.fullname}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Tract ${data.name} • GEOID: ${geoid}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('tract-info').innerHTML = resultsHtml;
    openSidebarFunc();
}

// Show address search results
function showAddressResults(results, mapInstance, tractLayers, updateSidebarFunc, openSidebarFunc) {
    const resultsHtml = `
        <div style="padding: 20px;">
            <h3 style="margin-bottom: 15px; color: #1f2937;">Select Location</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                ${results.map((result, idx) => `
                    <div class="search-result-item" onclick="selectAddressResult(${result.lat}, ${result.lon})" 
                         style="padding: 12px; margin-bottom: 8px; background: #f9fafb; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb;">
                        <div style="font-weight: 600; color: #1f2937;">${result.display_name.split(',').slice(0, 2).join(',')}</div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${result.display_name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('tract-info').innerHTML = resultsHtml;
    openSidebarFunc();
}

// Make functions globally accessible for onclick handlers
window.selectSearchResult = function(geoid) {
    window.dispatchEvent(new CustomEvent('selectTract', { detail: { geoid } }));
};

window.selectAddressResult = function(lat, lon) {
    window.dispatchEvent(new CustomEvent('selectAddress', { detail: { lat, lon } }));
};

// Export functions
window.PAMapSearch = {
    initSearch,
    searchByTractNumber,
    searchByAddress,
    findTractByCoordinates
};
