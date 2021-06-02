<#
   Powershell script used to upgrade ePointHES web
#>
param(
    [Parameter(Mandatory=$True, Position=0, ValueFromPipeline=$false)]
    [System.String]
    $installPath,

    [Parameter(Mandatory=$False, Position=1, ValueFromPipeline=$false)]
    [System.String]
    $releaseFolderName = "dist\ePointHES",

    [Parameter(Mandatory=$False, Position=2, ValueFromPipeline=$false)]
    [System.Boolean]
    $keepOldConfig = $true
)

# Take ownership of the folder before deleting it
function TakeOwnership([String] $folderPath) {
    $path = [System.IO.DirectoryInfo]$folderPath;
    if (!$path.Exists) {
        Write-Error 'The provided installation folder does not exist';
        exit;
    }
    try {
        takeown /a /r /d Y /f "$path" | Out-Null;
    }
    catch {
        Write-Host "An error occured while trying to take ownership of ePoint folder" -ForegroundColor RED;
        Write-Host $PSItem.Exception.Message -ForegroundColor RED;
        exit;
    }
}

# Remove default configurations
function RemoveConfigiurations([String] $folderPath) {
    $path = [System.IO.DirectoryInfo]$folderPath;
    if (!$path.Exists) {
        Write-Error 'The provided installation folder does not exist';
        exit;
    }
    
    try {
        gci -rec | ? {$_.FullName -like "*assets\config\config.json" } | Remove-Item -Force;
    }
    catch {
        Write-Host "An error occured while trying to remove old version" -ForegroundColor RED;
        Write-Host $PSItem.Exception.Message -ForegroundColor RED;
        exit;
    }
}

# Copy old configurations
function CopyOldConfigurations([String] $releaseFolder, [String] $installationFolder) {
    $release = [System.IO.DirectoryInfo]$releaseFolder;
    if (!$release.Exists) {
        Write-Error 'The provided release folder does not exist';
        exit;
    }

    $install = [System.IO.DirectoryInfo]$installationFolder;
    if (!$install.Exists) {
        New-Item -ItemType "directory" -Path $install;
    }

    $files = gci $installationFolder -rec | ? {$_.FullName -like "*assets\config\config.json" }
    foreach ($file in $files)
    {

        $dest = $release.FullName + $file.FullName.SubString($install.FullName.Length)
        If (!($dest.Contains('.')) -and !(Test-Path $dest))
        {
            mkdir $dest
        }

        $display = $file.FullName;
        Write-Host "Copying old configuration ($display) to new location ($dest)" -ForegroundColor Cyan;
        Copy-Item $file.FullName -Destination $dest -Force
    }
}

# Function will remove all contents of provided folder
function DeleteFolderContent([String] $folderPath) {
    $path = [System.IO.DirectoryInfo]$folderPath;
    if (!$path.Exists) {
        Write-Error 'The provided installation folder does not exist';
        exit;
    }

    try {
        Remove-Item "$path\*" -Recurse -Force;
    }
    catch {
        Write-Host "An error occured while trying to remove old version" -ForegroundColor RED;
        Write-Host $PSItem.Exception.Message -ForegroundColor RED;
        exit;
    }
};

# Function will rename provided folder to foldername.OLD
function RenameFolder([String] $folderPath) {
    $path = [System.IO.DirectoryInfo]$folderPath;
    if (!$path.Exists) {
        Write-Error 'The provided installation folder does not exist';
        exit;
    }

    $old = [System.IO.DirectoryInfo]"$path.OLD";
    if ($old.Exists) {
        Write-Host "Backup folder already exists. Cleaning old backup." -ForegroundColor Yellow;
        Remove-Item "$old" -Recurse -Force;
    }

    try {
        Rename-Item $path "$path.OLD";
        New-item -type directory -path $folderPath -Force;
    }
    catch {
        Write-Host "An error occured while trying to rename ePointHes installation folder" -ForegroundColor RED;
        Write-Host $PSItem.Exception.Message -ForegroundColor RED;
        exit;
    }
}

# Function will copy contents of one folder to another
function CopyFolder([String] $releaseFolder, [String] $installationFolder) {
    $release = [System.IO.DirectoryInfo]$releaseFolder;
    if (!$release.Exists) {
        Write-Error 'The provided release folder does not exist';
        exit;
    }

    $install = [System.IO.DirectoryInfo]$installationFolder;
    if (!$install.Exists) {
        New-Item -ItemType "directory" -Path $install;
    }

    try {
        Copy-Item -Path "$release\*" -Destination $install -Recurse -Force;
    }
    catch {
        Write-Host "An error occured while trying to copy new version" -ForegroundColor RED;
        Write-Host $PSItem.Exception.Message -ForegroundColor RED;
        exit;
    }
}

# Installation
Write-Host "-------------------- ePoint.Hes UI upgrade started --------------------" -ForegroundColor Green;
Write-Host $releaseFolderName
Write-Host $installPath

$release = [System.IO.DirectoryInfo]"$PSScriptRoot\$releaseFolderName";
if (!$release.Exists) {
    Write-Error 'The provided release folder does not exist';
    exit;
} else {
    Write-Host "Release folder $release found!" -ForegroundColor Cyan;
}

$install = [System.IO.DirectoryInfo]$installPath;
if (!$install.Exists) {
    Write-Error 'The provided install folder does not exist';
    exit;
} else {
    Write-Host "Install folder $install found!" -ForegroundColor Cyan;
}

Write-Host "-------------------- Use old configuration files --------------------" -ForegroundColor Green;
#RemoveConfigiurations "$release";
CopyOldConfigurations "$release" "$install";
Write-Host "------------------ Use old configuration files END ------------------" -ForegroundColor Green;

Write-Host "---------- Take Ownership of current ePoint.Hes UI folder -----------" -ForegroundColor Green;
TakeOwnership "$install";
Write-Host "-------- Take Ownership of current ePoint.Hes UI folder END ---------" -ForegroundColor Green;

Write-Host "---------------- Backuping old ePoint.Hes UI version ----------------" -ForegroundColor Green;
RenameFolder "$install";
Write-Host "-------------- Backuping old ePoint.Hes UI version END --------------" -ForegroundColor Green;

Write-Host "--------------- Installing new ePoint.Hes UI version ----------------" -ForegroundColor Green;
CopyFolder "$release" "$install";
Write-Host "-------------- Installing new ePoint.Hes UI version END -------------" -ForegroundColor Green;

Write-Host "---------------- ePoint.Hes UI sucessfully installed ----------------" -ForegroundColor Green;
