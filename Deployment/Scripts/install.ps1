# Check Node.js version
function Check-Node {
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = (node -v).TrimStart("v")
        $minVersion = "22.12.0"
        if ([version]$nodeVersion -ge [version]$minVersion) {
            Write-Output "Node.js version $nodeVersion is installed and meets the requirement."
        } else {
            Write-Output "Node.js version $nodeVersion is too old. Installing the latest version..."
            Install-Node
        }
    } else {
        Write-Output "Node.js is not installed. Installing..."
        Install-Node
    }
}

# Install Node.js
function Install-Node {
    Invoke-WebRequest -Uri "https://nodejs.org/dist/latest-v22.x/node-v22.12.0-x64.msi" -OutFile "$env:TEMP\node.msi"
    Start-Process -FilePath "$env:TEMP\node.msi" -ArgumentList "/quiet" -Wait
    Remove-Item "$env:TEMP\node.msi"
}

# Clone repository
function Clone-Repo {
    $repoUrl = "https://github.com/pxldigital-s2it/mayday-v2-2425-team1.git"
    git clone $repoUrl
    Set-Location "mayday-v2-2425-team1"
}

# Install dependencies
function Install-Dependencies {
    npm install
}

# Start server
function Start-Server {
    Start-Process -FilePath "npm" -ArgumentList "start"
}

# Sideload add-in
function Sideload-Addin {
    $addinPath = "$env:LOCALAPPDATA\Microsoft\Office\16.0\WEF"
    if (!(Test-Path -Path $addinPath)) {
        New-Item -ItemType Directory -Path $addinPath
    }
    Copy-Item -Path "./manifest.xml" -Destination $addinPath
}

# Main function
function Main {
    Check-Node
    Clone-Repo
    Install-Dependencies
    Start-Server
    Sideload-Addin
    Write-Output "Installation complete! Open Word to see the add-in."
}

Main
