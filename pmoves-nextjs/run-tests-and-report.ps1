# PowerShell script to run tests and generate a report

# Set verbose mode to see all console output
$env:VERBOSE = 1

# Run Jest tests
Write-Host "Running simulation tests..."
node_modules/.bin/jest --verbose

# Check if tests were successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Create timestamp for report
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportDir = "test-reports"

# Create directory if it doesn't exist
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

# Copy the test report to the reports directory with timestamp
Copy-Item "test-report.md" -Destination "$reportDir/test-report_$timestamp.md"

Write-Host "Tests completed successfully."
Write-Host "Report saved to $reportDir/test-report_$timestamp.md"
