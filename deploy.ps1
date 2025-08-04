# Deploy Script cho JKhoa Website
# Chạy script này để triển khai website lên GitHub Pages

Write-Host "🚀 Bắt đầu triển khai website jkhoa.site..." -ForegroundColor Green

# Kiểm tra xem có đang ở đúng thư mục không
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Lỗi: Không tìm thấy file index.html. Hãy chạy script này từ thư mục LowLife-Website" -ForegroundColor Red
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
    git commit -m "Update website content - $timestamp"
    
    Write-Host "✅ Đã commit thay đổi" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Không có thay đổi nào cần commit" -ForegroundColor Cyan
}

# Push lên GitHub
Write-Host "📤 Đang push lên GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Đã push thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Website sẽ được deploy trong vài phút tại: https://jkhoa.site" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Các bước tiếp theo:" -ForegroundColor Yellow
    Write-Host "1. Vào GitHub repository"
    Write-Host "2. Kiểm tra Settings > Pages"
    Write-Host "3. Đảm bảo Source được set là 'Deploy from a branch'"
    Write-Host "4. Branch: main, Folder: / (root)"
    Write-Host ""
    Write-Host "⏳ Chờ 2-5 phút để website được deploy hoàn toàn" -ForegroundColor Magenta
} else {
    Write-Host "❌ Lỗi khi push lên GitHub" -ForegroundColor Red
    Write-Host "Hãy kiểm tra kết nối internet và quyền truy cập repository" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Hoàn thành!" -ForegroundColor Green 