# PowerShell script to run Jest tests

# Run Jest tests with detailed output
Write-Host "Running Jest tests for simulation..."
npx jest --verbose

# Check if tests were successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Tests completed successfully."
