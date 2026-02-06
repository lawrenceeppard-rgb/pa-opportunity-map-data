# Deployment Checklist

Use this checklist to ensure your PA Census Tracts map is deployed correctly.

## ☐ Pre-Deployment

- [ ] Downloaded all project files
- [ ] Verified data folder contains 67 county files
- [ ] Read README.md for overview
- [ ] Read DEPLOYMENT.md for detailed instructions

## ☐ Local Testing

- [ ] Opened terminal in project folder
- [ ] Ran local server: `python -m http.server 8000`
- [ ] Visited http://localhost:8000 in browser
- [ ] Tested tract number search (try "4591.01")
- [ ] Clicked on search results to view tract
- [ ] Verified sidebar shows tract information
- [ ] Checked browser console for errors (press F12)
- [ ] Tested on mobile device or Chrome DevTools mobile view

## ☐ GitHub Setup

- [ ] Created GitHub account (if needed)
- [ ] Created new repository on GitHub
- [ ] Named repository (e.g., "pa-census-tracts")
- [ ] Did NOT initialize with README (important!)
- [ ] Noted repository URL

## ☐ Configuration Update

### Method 1: Automated (Recommended)
- [ ] Ran deployment script: `bash deploy.sh`
- [ ] Entered GitHub username when prompted
- [ ] Entered repository name when prompted
- [ ] Verified configuration was updated

### Method 2: Manual
- [ ] Opened index.html in text editor
- [ ] Found line 250 (CONFIG section)
- [ ] Updated GITHUB_BASE_URL with your username/repo
- [ ] Changed USE_LOCAL_DATA to false
- [ ] Saved file

## ☐ Upload to GitHub

- [ ] Initialized git: `git init`
- [ ] Added all files: `git add .`
- [ ] Created commit: `git commit -m "Initial commit"`
- [ ] Added remote: `git remote add origin YOUR_REPO_URL`
- [ ] Pushed to GitHub: `git push -u origin main`
- [ ] Verified files appear on GitHub

## ☐ Enable GitHub Pages

- [ ] Went to repository Settings
- [ ] Clicked on "Pages" in sidebar
- [ ] Selected "main" branch as source
- [ ] Clicked "Save"
- [ ] Noted the published URL (shown at top)
- [ ] Waited 1-2 minutes for deployment

## ☐ Verify Deployment

- [ ] Visited GitHub Pages URL
- [ ] Page loads without errors
- [ ] Map displays correctly
- [ ] Search functionality works
- [ ] Tract information displays in sidebar
- [ ] No console errors (press F12)
- [ ] Tested on mobile device

## ☐ Post-Deployment Testing

### Test Search Feature
- [ ] Search by tract number: "4591.01" → Shows results
- [ ] Click result → Map zooms to tract
- [ ] Sidebar shows tract information
- [ ] Try another tract: "4315" → Works correctly

### Test Map Interaction
- [ ] Can zoom in and out
- [ ] Can pan around Pennsylvania
- [ ] Tract highlights when selected
- [ ] Popup shows on hover (if implemented)

### Test Data Loading
- [ ] Open browser console (F12)
- [ ] Look for "Loaded data for 3446 tracts" message
- [ ] Network tab shows successful data fetches
- [ ] No 404 or CORS errors

### Cross-Browser Testing
- [ ] Chrome/Edge ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Mobile Safari ✓
- [ ] Mobile Chrome ✓

## ☐ Optional Enhancements

- [ ] Read CENSUS_API_INTEGRATION.md
- [ ] Signed up for Census API key
- [ ] Implemented demographic data loading
- [ ] Added address geocoding (Nominatim)
- [ ] Created choropleth visualization
- [ ] Added legend to map
- [ ] Implemented comparison tool

## ☐ Documentation

- [ ] Updated README with your specific setup
- [ ] Added screenshots to repository
- [ ] Documented any customizations made
- [ ] Created issues list for future improvements

## ☐ Sharing

- [ ] Shared URL with intended audience
- [ ] Added link to your website/portfolio
- [ ] Posted on social media (if desired)
- [ ] Submitted to relevant directories

## Troubleshooting Checklist

If something isn't working:

- [ ] Checked browser console for errors (F12 → Console tab)
- [ ] Verified GitHub URLs are correct in index.html
- [ ] Confirmed files are on main branch
- [ ] Waited 2-3 minutes after GitHub Pages enable
- [ ] Tried hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Tested in incognito/private browsing mode
- [ ] Verified GitHub Pages is enabled in settings
- [ ] Checked that data files are in data/ folder

## Success Indicators

Your deployment is successful when:

✅ GitHub Pages shows your site as "deployed"
✅ Visiting URL loads the map without errors
✅ Console shows "Loaded data for 3446 tracts"
✅ Search returns results and displays tracts
✅ Sidebar shows tract information
✅ Map is interactive (zoom, pan)
✅ Works on mobile devices
✅ No CORS or 404 errors in console

## Common Issues and Solutions

### Issue: "Failed to load census data"
**Solution**: 
- Check GITHUB_BASE_URL in index.html
- Ensure data folder is uploaded to GitHub
- Verify GitHub Pages is enabled

### Issue: CORS errors in console
**Solution**:
- Make sure using raw.githubusercontent.com URLs
- Not regular github.com URLs

### Issue: Search not working
**Solution**:
- Check console for JavaScript errors
- Verify tract_data.json loaded successfully
- Try different browser

### Issue: Map not displaying
**Solution**:
- Check Leaflet CSS and JS URLs
- Verify no ad blocker is interfering
- Try different browser

### Issue: Slow performance
**Solution**:
- Don't load all counties at once
- Implement caching
- Simplify geometries further

## Get Help

If you've checked all boxes and still have issues:

1. Check browser console for specific errors
2. Review DEPLOYMENT.md for detailed instructions
3. Search for similar issues on Stack Overflow
4. Check Leaflet documentation: https://leafletjs.com/
5. Review GitHub Pages troubleshooting: https://docs.github.com/en/pages

---

**Remember**: Most issues are configuration-related. Double-check your GitHub URLs and ensure all files are uploaded correctly.

**Pro Tip**: Keep your local version working as a reference. If deployment fails, you can always compare configurations.

**Next Steps After Deployment**:
1. Add your custom data sources
2. Implement demographic visualizations
3. Enhance search with geocoding
4. Add social sharing features
5. Create documentation for your users
