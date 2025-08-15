# Script kiểm tra trạng thái website jkhoa.dev
# Chạy: .\check-website.ps1

Write-Host "🔍 Kiểm tra trạng thái website jkhoa.dev..." -ForegroundColor Green

$website = "https://jkhoa.dev"
$httpWebsite = "http://jkhoa.dev"

# Kiểm tra HTTPS
try {
    $response = Invoke-WebRequest -Uri $website -Method Head -TimeoutSec 10
    Write-Host "✅ HTTPS hoạt động - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTPS không hoạt động: $($_.Exception.Message)" -ForegroundColor Red
}

# Kiểm tra HTTP
try {
    $response = Invoke-WebRequest -Uri $httpWebsite -Method Head -TimeoutSec 10
    Write-Host "✅ HTTP hoạt động - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTP không hoạt động: $($_.Exception.Message)" -ForegroundColor Red
}

# Kiểm tra DNS
try {
    $dns = Resolve-DnsName -Name "jkhoa.dev" -Type A
    Write-Host "✅ DNS hoạt động - IP: $($dns.IPAddress)" -ForegroundColor Green
} catch {
    Write-Host "❌ DNS không hoạt động: $($_.Exception.Message)" -ForegroundColor Red
}

# Kiểm tra ping
try {
    $ping = Test-Connection -ComputerName "jkhoa.dev" -Count 1 -Quiet
    if ($ping) {
        Write-Host "✅ Ping thành công" -ForegroundColor Green
    } else {
        Write-Host "❌ Ping thất bại" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ping lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Kết quả kiểm tra:" -ForegroundColor Yellow
Write-Host "- Nếu tất cả đều ✅: Website đã hoạt động bình thường" -ForegroundColor Cyan
Write-Host "- Nếu có ❌: Có thể cần chờ thêm thời gian hoặc kiểm tra cấu hình" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Truy cập website: $website" -ForegroundColor Magenta 