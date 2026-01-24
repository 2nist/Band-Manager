# PowerShell helper to move markdown files into docs/ structure
Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)\..\

Function MoveIfExists($file, $destDir) {
    if (Test-Path $file) {
        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
        Write-Host "Moving $file -> $destDir\$file"
        Move-Item -Force -LiteralPath $file -Destination (Join-Path $destDir $file)
    } else {
        Write-Host "Not found: $file"
    }
}

# Asset creation docs
$assetFiles = @('ASSET_CREATION_SUMMARY.md','ASSET_CREATION_README.md','ASSET_CREATION_COMPLETE.md','ASSET_CREATION_CHECKLIST.md')
foreach ($f in $assetFiles) { MoveIfExists $f 'docs\\guides\\asset_creation' }

# Avatar docs
$avatarFiles = @('AVATAR_ASSETS_EXPANSION.md','AVATAR_PLACEHOLDER_FIX.md','AVATAR_SYSTEM_TEST_SUMMARY.md','AVATAR_ASSET_CREATION_GUIDE.md')
foreach ($f in $avatarFiles) { MoveIfExists $f 'docs\\guides\\avatar' }

# Gameplay docs
MoveIfExists 'GAMEPLAY_GUIDE.md' 'docs\\guides\\gameplay'
MoveIfExists 'COMPLETE_GAMEPLAY_TEST.md' 'docs\\guides\\gameplay'
MoveIfExists 'GAME_RESTORATION_STATUS.md' 'docs\\guides\\gameplay'

# Phases & planning
Get-ChildItem -Path . -Filter 'PHASE*' -Recurse | ForEach-Object { MoveIfExists $_.Name 'docs\\planning\\phases' }
MoveIfExists 'DEVELOPMENT_PLAN.md' 'docs\\planning'
MoveIfExists 'DELIVERY_SUMMARY.md' 'docs\\planning'

# Tests
MoveIfExists 'TEST_SUMMARY.md' 'docs\\testing'
MoveIfExists 'TEST_REPORT.md' 'docs\\testing'
MoveIfExists 'TEST_RESULTS.md' 'docs\\testing'
MoveIfExists 'TEST_COVERAGE_REPORT.md' 'docs\\testing'
MoveIfExists 'TEST_ENHANCEMENT_SUMMARY.md' 'docs\\testing'
MoveIfExists 'TESTING_COMPLETE.md' 'docs\\testing'

# Music & song
MoveIfExists 'MUSIC_GENERATION_IMPLEMENTATION.md' 'docs\\architecture\\music'
MoveIfExists 'AUTOMATIC_SONG_GENERATION.md' 'docs\\architecture\\music'
MoveIfExists 'MUSIC_GENERATION_INTEGRATION_STATUS.md' 'docs\\architecture\\music'
MoveIfExists 'SONG_SYSTEM_EXECUTIVE_SUMMARY.md' 'docs\\architecture\\music'
MoveIfExists 'SONG_SYSTEM_QUICK_REFERENCE.md' 'docs\\architecture\\music'

# Dialogue
MoveIfExists 'ENHANCED_DIALOGUE_README.md' 'docs\\architecture\\dialogue'
MoveIfExists 'ENHANCED_DIALOGUE_IMPLEMENTATION_COMPLETE.md' 'docs\\architecture\\dialogue'
MoveIfExists 'ENHANCED_DIALOGUE_IMPLEMENTATION_STATUS.md' 'docs\\architecture\\dialogue'
MoveIfExists 'ENHANCED_DIALOGUE_STATUS.md' 'docs\\architecture\\dialogue'
MoveIfExists 'DIALOGUE_APP_INTEGRATION_EXAMPLE.md' 'docs\\architecture\\dialogue'

# Instruments
MoveIfExists 'INSTRUMENT_CUSTOMIZER_IMPLEMENTATION.md' 'docs\\implementation\\instruments'
MoveIfExists 'INSTRUMENT_CUSTOMIZER_TEST_REPORT.md' 'docs\\implementation\\instruments'
MoveIfExists 'INSTRUMENT_COVERAGE_AND_EFFECTS.md' 'docs\\implementation\\instruments'
MoveIfExists 'KEYBOARD_IMPLEMENTATION.md' 'docs\\implementation\\instruments'
MoveIfExists 'KEYBOARD_COVERAGE_SUMMARY.md' 'docs\\implementation\\instruments'
MoveIfExists 'MIDI_PLAYBACK_COMPARISON.md' 'docs\\implementation\\instruments'

# Charts
MoveIfExists 'CHART_SYSTEM_IMPLEMENTATION.md' 'docs\\implementation\\charts'
MoveIfExists 'CHART_SYSTEM_ENHANCEMENT.md' 'docs\\implementation\\charts'
MoveIfExists 'CHART_SYSTEM_DEBUG.md' 'docs\\implementation\\charts'

# Design
MoveIfExists 'ART_BIBLE_IMPLEMENTATION.md' 'docs\\design'
MoveIfExists 'FONT_GALLERY_COMPLETE.md' 'docs\\design'
MoveIfExists 'ASSET_CREATION_GUIDE.md' 'docs\\guides\\asset_creation'
MoveIfExists 'README_ASSET_CREATION.md' 'docs\\guides\\asset_creation'

# Misc and cleanup
MoveIfExists 'ISSUES_REPORT.md' 'docs\\maintenance'
MoveIfExists 'FIXES_APPLIED.md' 'docs\\maintenance'
MoveIfExists 'FEATURE_GAP_ANALYSIS.md' 'docs\\others'
MoveIfExists 'FEATURE_COMPARISON.md' 'docs\\others'
MoveIfExists 'DATASETS.md' 'docs\\datasets'

# Enhanced Dialogue folder
if (Test-Path 'Enhanced Dialogue') { Get-ChildItem -Path 'Enhanced Dialogue' -Recurse -Filter *.md | ForEach-Object { Move-Item -Force -LiteralPath $_.FullName -Destination (Join-Path 'docs\\architecture\\dialogue' $_.Name) } }

# Add and commit
git add -A
if (-not (git diff --cached --quiet)) { git commit -m "docs: move grouped markdown files into docs/" } else { Write-Host 'No changes to commit' }

Write-Host "Done moving grouped files."
