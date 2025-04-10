# PowerShell script to run simulation tests and analyze results

# Compile TypeScript files
Write-Host "Compiling TypeScript files..."
npx tsc

# Check if compilation was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript compilation failed. Please fix the errors and try again."
    exit 1
}

# Run the tests
Write-Host "Running simulation tests..."
node scripts/run-tests.js

# Check if tests were successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Tests completed successfully."
