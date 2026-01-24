# Chart System Debugging Guide

## Issue
Top 20 charts are showing "No artists/albums/songs on chart yet" even though the chart system should auto-populate with default rivals.

## Fixes Applied

### 1. Default Rivals Generation
- **Fixed**: Filtering logic now always includes defaults when playerFame is 0
- **Fixed**: Ensures at least 19 defaults are generated if no player band exists
- **Fixed**: Fallback logic uses all available defaults if filtering removes too many

### 2. Album Generation
- **Fixed**: `ensureRivalHasAlbum` always returns at least one album (creates placeholder if needed)
- **Fixed**: Fallback logic ensures albums are generated from default rivals if main logic fails

### 3. Song Generation
- **Fixed**: Placeholder songs are generated for all rivals without songs
- **Fixed**: Fallback logic uses placeholder songs if main logic fails

### 4. Debug Logging
- Added console logging (development only) to track:
  - Input data (gameState, rivalBands, rivalSongs)
  - Generated default rivals count
  - Chart results (chartLeaders, albumChart, songChart counts)
  - Warnings when charts are empty

## How to Debug

1. **Open Browser Console** (F12)
2. **Look for `[Chart System]` logs**:
   - `[Chart System] Inputs:` - Shows what data is being passed
   - `[Chart System] Generated X default rivals` - Shows how many defaults were created
   - `[Chart System] chartLeaders generated: X artists` - Shows final chart count
   - `[Chart System] albumChart generated: X albums` - Shows final album count
   - `[Chart System] songChart generated: X songs` - Shows final song count

3. **If charts are empty, check**:
   - Are default rivals being generated? (should see "Generated X default rivals")
   - Are albums being generated? (each default rival should have at least 1 album)
   - Are placeholder songs being generated? (each default rival should have at least 1 song)

## Expected Behavior

- **Top 20 Artists**: Should always show 20 artists (player + defaults, or just defaults)
- **Top 20 Albums**: Should always show 20 albums (player albums + default rival albums)
- **Top 30 Songs**: Should always show 30 songs (player songs + default rival placeholder songs)

## Common Issues

1. **Charts empty on first load**: Default rivals should generate automatically
2. **Charts empty after game start**: Check if playerFame filtering is too strict
3. **Charts show but no data**: Check browser console for warnings

## Next Steps if Still Empty

1. Check browser console for `[Chart System]` logs
2. Verify `gameState.state` has correct structure
3. Verify `rivalBands` and `rivalSongs` are being passed correctly
4. Check if `ensureRivalHasAlbum` is working (should always return array)
5. Check if `generatePlaceholderSongs` is working (should generate songs for all defaults)
