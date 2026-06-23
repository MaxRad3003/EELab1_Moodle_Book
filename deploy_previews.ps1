# PowerShell script to deploy previews to GitHub Pages
$ErrorActionPreference = 'Stop'

# 1. Build and clean package
Write-Host "🔨 Rebuilding and packaging project..." -ForegroundColor Cyan
python scripts/rebuild_and_clean_dist.py

# 2. Add previews folder and all files to git (force add since it is ignored by .gitignore)
Write-Host "📦 Staging previews folder and all modified/untracked files..." -ForegroundColor Cyan
git add .
git add -f dist/previews

# 3. Get current branch name
$branch = (git branch --show-current).Trim()
Write-Host "🌿 Current branch is: $branch" -ForegroundColor Yellow

# 4. Commit changes
$commitMsg = "Deploy previews to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "💾 Committing changes: '$commitMsg'..." -ForegroundColor Cyan
git commit -m $commitMsg

# 5. Push to GitHub
Write-Host "🚀 Pushing changes to GitHub ($branch)..." -ForegroundColor Cyan
git push origin $branch

Write-Host "✅ Deployment complete! If your GitHub Pages is configured to serve from this branch, your previews are now live." -ForegroundColor Green
