[Setup]
AppName=Economic Simulation
AppVersion=1.0
DefaultDirName={pf}\CataclysmStudios\EconomicSimulation
DefaultGroupName=Cataclysm Studios
OutputDir=installer
OutputBaseFilename=EconomicSimulation_Setup

[Files]
Source: "dist\Economic_Simulation.exe"; DestDir: "{app}"
Source: "README.txt"; DestDir: "{app}"; Flags: isreadme
Source: "LICENSE.txt"; DestDir: "{app}"

[Icons]
Name: "{group}\Economic Simulation"; Filename: "{app}\Economic_Simulation.exe"
Name: "{commondesktop}\Economic Simulation"; Filename: "{app}\Economic_Simulation.exe"