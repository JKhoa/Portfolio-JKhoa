# Deploy Script cho JKhoa Website lên Hostinger
# Chạy script này để triển khai website lên Hostinger hosting

param(
    [Parameter(Mandatory=$true)]
    [string]$FtpServer,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpPassword,
    
    [string]$FtpPath = "/public_html/"
)

Write-Host "🚀 Bắt đầu triển khai website jkhoa.dev lên Hostinger..." -ForegroundColor Green

# Kiểm tra xem có đang ở đúng thư mục không
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Lỗi: Không tìm thấy file index.html. Hãy chạy script này từ thư mục Portfolio-JKhoa" -ForegroundColor Red
    exit 1
}

# Tạo danh sách file cần upload
$filesToUpload = @(
    "index.html",
    "styles.css", 
    "script.js",
    "CNAME"
)

$foldersToUpload = @(
    "html5up-miniport"
)

# Tạo FTP Web Request
function Upload-File {
    param([string]$LocalPath, [string]$RemotePath)
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FtpServer$RemotePath")
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
        $ftpRequest.UsePassive = $true
        $ftpRequest.UseBinary = $true
        $ftpRequest.KeepAlive = $false
        
        $fileContents = [System.IO.File]::ReadAllBytes($LocalPath)
        $ftpStream = $ftpRequest.GetRequestStream()
        $ftpStream.Write($fileContents, 0, $fileContents.Length)
        $ftpStream.Close()
        
        Write-Host "✅ Đã upload: $LocalPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Lỗi upload $LocalPath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Upload-Folder {
    param([string]$LocalFolder, [string]$RemoteFolder)
    
    try {
        # Tạo thư mục trên server
        $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FtpServer$RemoteFolder")
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
        $ftpRequest.UsePassive = $true
        
        try {
            $response = $ftpRequest.GetResponse()
            Write-Host "📁 Đã tạo thư mục: $RemoteFolder" -ForegroundColor Cyan
        }
        catch {
            # Thư mục có thể đã tồn tại
        }
        
        # Upload tất cả file trong thư mục
        $files = Get-ChildItem -Path $LocalFolder -Recurse -File
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
            $remotePath = $RemoteFolder + $relativePath.Replace("\", "/")
            
            # Tạo thư mục con nếu cần
            $remoteDir = Split-Path $remotePath -Parent
            if ($remoteDir -ne $RemoteFolder) {
                $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FtpServer$remoteDir")
                $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
                $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
                $ftpRequest.UsePassive = $true
                
                try {
                    $response = $ftpRequest.GetResponse()
                }
                catch {
                    # Thư mục có thể đã tồn tại
                }
            }
            
            Upload-File $file.FullName $remotePath
        }
    }
    catch {
        Write-Host "❌ Lỗi upload thư mục $LocalFolder : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Upload các file chính
Write-Host "📤 Đang upload các file chính..." -ForegroundColor Yellow
foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Upload-File $file ($FtpPath + $file)
    } else {
        Write-Host "⚠️ Không tìm thấy file: $file" -ForegroundColor Yellow
    }
}

# Upload các thư mục
Write-Host "📤 Đang upload các thư mục..." -ForegroundColor Yellow
foreach ($folder in $foldersToUpload) {
    if (Test-Path $folder) {
        Upload-Folder $folder ($FtpPath + $folder + "/")
    } else {
        Write-Host "⚠️ Không tìm thấy thư mục: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Hoàn thành upload!" -ForegroundColor Green
Write-Host "🌐 Website sẽ có sẵn tại: https://jkhoa.dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Lưu ý:" -ForegroundColor Yellow
Write-Host "- Có thể mất vài phút để DNS cập nhật"
Write-Host "- Kiểm tra website sau 5-10 phút"
Write-Host "- Nếu gặp lỗi, hãy kiểm tra thông tin FTP và kết nối internet" 