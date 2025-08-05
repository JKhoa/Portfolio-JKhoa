# Script Deploy Tự Động lên Netlify
# Chạy script này để deploy website lên Netlify và đảm bảo hoạt động liên tục

Write-Host "🚀 Bắt đầu deploy tự động lên Netlify..." -ForegroundColor Green

# Kiểm tra xem có đang ở đúng thư mục không
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Lỗi: Không tìm thấy file index.html" -ForegroundColor Red
    exit 1
}

# Kiểm tra Git status
Write-Host "📋 Kiểm tra trạng thái Git..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "📝 Có thay đổi chưa commit. Đang thêm và commit..." -ForegroundColor Yellow
    
    # Thêm tất cả file
    git add .
    
    # Commit với timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto deploy to Netlify - $timestamp"
    
    Write-Host "✅ Đã commit thay đổi" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Không có thay đổi nào cần commit" -ForegroundColor Cyan
}

# Push lên GitHub (kích hoạt deploy tự động trên Netlify)
Write-Host "📤 Đang push lên GitHub để kích hoạt deploy Netlify..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Đã push thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Netlify sẽ tự động deploy trong vài phút" -ForegroundColor Cyan
    Write-Host "🔗 Website: https://imaginative-daffodil-6a3a60.netlify.app" -ForegroundColor Magenta
    Write-Host "🔗 Custom Domain: https://jkhoa.site" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "📋 Tính năng deploy tự động:" -ForegroundColor Yellow
    Write-Host "✅ Website hoạt động 24/7 ngay cả khi tắt máy" -ForegroundColor Green
    Write-Host "✅ Tự động deploy khi có thay đổi trên GitHub" -ForegroundColor Green
    Write-Host "✅ CDN toàn cầu cho tốc độ tải nhanh" -ForegroundColor Green
    Write-Host "✅ SSL certificate tự động" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Chờ 2-5 phút để deploy hoàn tất" -ForegroundColor Magenta
} else {
    Write-Host "❌ Lỗi khi push lên GitHub" -ForegroundColor Red
    Write-Host "Hãy kiểm tra kết nối internet và quyền truy cập repository" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Hoàn thành! Website sẽ hoạt động liên tục!" -ForegroundColor Green 