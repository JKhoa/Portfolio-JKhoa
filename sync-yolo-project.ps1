# Script để tự động di chuyển/cập nhật files từ DoAnCuoiKi sang Portfolio-JKhoa
# PowerShell Script for moving YOLO project files

$sourceDir = "d:\Study\Web_Nang_Cao\DoAnCuoiKi"
$targetDir = "d:\Study\Web_Nang_Cao\Portfolio-JKhoa\blog\webyolo"

Write-Host "=== YOLO Project File Sync Script ===" -ForegroundColor Green
Write-Host "Source: $sourceDir" -ForegroundColor Yellow
Write-Host "Target: $targetDir" -ForegroundColor Yellow
Write-Host ""

# Check if source directory exists
if (-not (Test-Path $sourceDir)) {
    Write-Error "Source directory not found: $sourceDir"
    exit 1
}

# Create target directory if it doesn't exist
if (-not (Test-Path $targetDir)) {
    Write-Host "Creating target directory..." -ForegroundColor Blue
    New-Item -ItemType Directory -Path $targetDir -Force
    New-Item -ItemType Directory -Path "$targetDir\css" -Force
    New-Item -ItemType Directory -Path "$targetDir\js" -Force
}

# Function to copy and update files
function Copy-YoloFiles {
    Write-Host "Syncing files..." -ForegroundColor Blue
    
    # Copy HTML file
    if (Test-Path "$sourceDir\index.html") {
        $htmlContent = Get-Content "$sourceDir\index.html" -Raw
        # Add navigation link back to portfolio
        $htmlContent = $htmlContent -replace '<li><a href="#contact">Liên Hệ</a></li>', '<li><a href="#contact">Liên Hệ</a></li><li><a href="../../index.html">← Về Portfolio</a></li>'
        # Update contact information
        $htmlContent = $htmlContent -replace 'contact@yolo-ai-project.com', 'nhakhoa1004@gmail.com'
        $htmlContent = $htmlContent -replace '\+84 123 456 789', '0395123864'
        $htmlContent = $htmlContent -replace 'YOLO AI Project', 'YOLO AI Project by Nguyễn Hoàng Anh Khoa'
        
        Set-Content "$targetDir\index.html" -Value $htmlContent -Encoding UTF8
        Write-Host "✓ Updated index.html" -ForegroundColor Green
    }
    
    # Copy CSS file
    if (Test-Path "$sourceDir\css\style.css") {
        Copy-Item "$sourceDir\css\style.css" "$targetDir\css\style.css" -Force
        Write-Host "✓ Copied style.css" -ForegroundColor Green
    }
    
    # Copy JS file with enhancements
    if (Test-Path "$sourceDir\js\script.js") {
        $jsContent = Get-Content "$sourceDir\js\script.js" -Raw
        # Add additional chatbot responses
        $additionalResponses = @"
    'khoa': 'Tôi là Nguyễn Hoàng Anh Khoa, sinh viên năm cuối ngành Công nghệ thông tin tại Đại học Đà Lạt. Đây là dự án nghiên cứu về YOLO của tôi.',
    'portfolio': 'Bạn có thể xem thêm các dự án khác của tôi tại trang Portfolio chính.',
    'liên hệ': 'Bạn có thể liên hệ với tôi qua email: nhakhoa1004@gmail.com hoặc số điện thoại: 0395123864'
"@
        
        # Insert additional responses into the chatbot responses object
        $jsContent = $jsContent -replace "'recall': 'Recall.*?'", "'recall': 'Recall (Độ bao phủ) đo lường tỷ lệ dự đoán đúng trong tổng số trường hợp thực tế dương tính.',`n    $additionalResponses"
        
        Set-Content "$targetDir\js\script.js" -Value $jsContent -Encoding UTF8
        Write-Host "✓ Updated script.js with enhancements" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "File sync completed successfully!" -ForegroundColor Green
    Write-Host "YOLO website is now accessible at: https://jkhoa.dev/blog/webyolo" -ForegroundColor Cyan
}

# Function to backup existing files
function Backup-ExistingFiles {
    $backupDir = "$targetDir\backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    if (Test-Path "$targetDir\index.html") {
        Write-Host "Creating backup..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $backupDir -Force
        Copy-Item "$targetDir\*" $backupDir -Recurse -Force
        Write-Host "✓ Backup created at: $backupDir" -ForegroundColor Green
    }
}

# Function to validate files
function Test-YoloFiles {
    Write-Host "Validating files..." -ForegroundColor Blue
    
    $errors = @()
    
    if (-not (Test-Path "$targetDir\index.html")) {
        $errors += "Missing index.html"
    }
    
    if (-not (Test-Path "$targetDir\css\style.css")) {
        $errors += "Missing style.css"
    }
    
    if (-not (Test-Path "$targetDir\js\script.js")) {
        $errors += "Missing script.js"
    }
    
    if ($errors.Count -eq 0) {
        Write-Host "✓ All files validated successfully" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Validation errors:" -ForegroundColor Red
        $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        return $false
    }
}

# Main execution
try {
    # Show menu
    Write-Host "Choose an option:" -ForegroundColor Cyan
    Write-Host "1. Sync files from DoAnCuoiKi to Portfolio" -ForegroundColor White
    Write-Host "2. Create backup of existing files" -ForegroundColor White  
    Write-Host "3. Validate YOLO files" -ForegroundColor White
    Write-Host "4. Full sync with backup" -ForegroundColor White
    Write-Host "5. Exit" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1-5)"
    
    switch ($choice) {
        "1" { 
            Copy-YoloFiles 
        }
        "2" { 
            Backup-ExistingFiles 
        }
        "3" { 
            Test-YoloFiles 
        }
        "4" { 
            Backup-ExistingFiles
            Copy-YoloFiles
            Test-YoloFiles
        }
        "5" { 
            Write-Host "Exiting..." -ForegroundColor Yellow
            exit 0 
        }
        default { 
            Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
            exit 1 
        }
    }
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Script execution completed." -ForegroundColor Green
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
