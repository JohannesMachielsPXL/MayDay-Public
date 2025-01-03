# Function to start the local server
function Start-Server {
    Write-Output "Starting development server..."
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"
    Start-Sleep -Seconds 5 # Give the server time to initialize
    Write-Output "Development server is running."
}

# Function to open Word with the sideloaded add-in
function Open-Word {
    $addinPath = "$env:LOCALAPPDATA\Microsoft\Office\16.0\WEF\manifest.xml"
    if (!(Test-Path -Path $addinPath)) {
        Write-Output "Add-in manifest not found. Ensure you have run the install.ps1 script first."
        return
    }

    Write-Output "Opening Word with the sideloaded add-in..."
    Start-Process "winword.exe"
}

# Main function
function Main {
    Start-Server
    Open-Word
    Write-Output "Word is now open with the add-in. Test the add-in functionality."
}

Main
