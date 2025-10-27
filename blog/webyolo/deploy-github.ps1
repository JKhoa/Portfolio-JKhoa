# Deploy YOLO AI Project to GitHub Pages
# Script tự động deploy project lên GitHub Pages

Write-Host "🚀 Bắt đầu deploy YOLO AI Project lên GitHub Pages..." -ForegroundColor Green

# Kiểm tra Git status
Write-Host "📋 Kiểm tra Git status..." -ForegroundColor Yellow
git status

# Add tất cả files
Write-Host "📁 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = "Deploy YOLO AI Project - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

# Push to GitHub
Write-Host "🌐 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deploy hoàn tất!" -ForegroundColor Green
Write-Host "🌍 Website sẽ có sẵn tại: https://jkhoa.dev/blog/webyolo/" -ForegroundColor Cyan
Write-Host "⏱️ Có thể mất 1-2 phút để GitHub Pages cập nhật" -ForegroundColor Yellow

# Mở website
Write-Host "🔗 Mở website..." -ForegroundColor Yellow
Start-Process "https://jkhoa.dev/blog/webyolo/"

Write-Host "🎉 Deploy thành công! Kiểm tra website tại: https://jkhoa.dev/blog/webyolo/" -ForegroundColor Green
