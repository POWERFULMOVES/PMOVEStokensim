# PowerShell script to run simulation tests and apply recommendations

# Compile TypeScript files
Write-Host "Compiling TypeScript files..."
npx tsc

# Check if compilation was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript compilation failed. Please fix the errors and try again."
    exit 1
}

# Run the tests with apply-recommendations flag
Write-Host "Running simulation tests and applying recommendations..."
node scripts/run-tests.js --apply-recommendations

# Check if tests were successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Recommendations applied successfully."
