# Script upload website lên Hostinger
# Chạy: .\upload-hostinger.ps1

Write-Host "🚀 Bắt đầu upload website lên Hostinger..." -ForegroundColor Green

# Kiểm tra file cấu hình
if (-not (Test-Path "ftp-config.json")) {
    Write-Host "❌ Không tìm thấy file ftp-config.json" -ForegroundColor Red
    Write-Host "Hãy cập nhật thông tin FTP trong file ftp-config.json" -ForegroundColor Yellow
    exit 1
}

# Đọc cấu hình FTP
$config = Get-Content "ftp-config.json" | ConvertFrom-Json

# Kiểm tra thông tin cấu hình
if ($config.ftp_server -eq "your-ftp-server.hostinger.com") {
    Write-Host "❌ Vui lòng cập nhật thông tin FTP trong file ftp-config.json" -ForegroundColor Red
    Write-Host "📋 Cách lấy thông tin FTP từ Hostinger:" -ForegroundColor Yellow
    Write-Host "1. Đăng nhập Hostinger Control Panel"
    Write-Host "2. Vào Hosting > Manage > Files > FTP Accounts"
    Write-Host "3. Tạo hoặc xem thông tin FTP account"
    Write-Host "4. Cập nhật thông tin vào ftp-config.json"
    exit 1
}

# Tạo danh sách file cần upload
$files = @(
    "index.html",
    "styles.css", 
    "script.js",
    "CNAME"
)

$folders = @(
    "html5up-miniport"
)

# Upload function
function Upload-File {
    param([string]$LocalFile, [string]$RemoteFile)
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$($config.ftp_server)$($config.ftp_path)$RemoteFile")
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($config.ftp_username, $config.ftp_password)
        $ftpRequest.UsePassive = $true
        $ftpRequest.UseBinary = $true
        $ftpRequest.KeepAlive = $false
        
        $fileContents = [System.IO.File]::ReadAllBytes($LocalFile)
        $ftpStream = $ftpRequest.GetRequestStream()
        $ftpStream.Write($fileContents, 0, $fileContents.Length)
        $ftpStream.Close()
        
        Write-Host "✅ $LocalFile" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $LocalFile - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Upload files
Write-Host "📤 Đang upload files..." -ForegroundColor Yellow
foreach ($file in $files) {
    if (Test-Path $file) {
        Upload-File $file $file
    } else {
        Write-Host "⚠️ Không tìm thấy: $file" -ForegroundColor Yellow
    }
}

# Upload folders (simplified)
Write-Host "📤 Đang upload folders..." -ForegroundColor Yellow
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "📁 Uploading $folder..." -ForegroundColor Cyan
        # Upload tất cả file trong thư mục
        $allFiles = Get-ChildItem -Path $folder -Recurse -File
        foreach ($file in $allFiles) {
            $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
            $remotePath = $relativePath.Replace("\", "/")
            Upload-File $file.FullName $remotePath
        }
    } else {
        Write-Host "⚠️ Không tìm thấy: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Hoàn thành upload!" -ForegroundColor Green
Write-Host "🌐 Website: https://jkhoa.dev" -ForegroundColor Cyan
Write-Host "⏳ Chờ 5-10 phút để website hoạt động" -ForegroundColor Yellow 