; NSIS Script to create an installer for the Economic Simulation application

; Define the name of the installer
Name "Cataclysm Studios Economic Simulation"

; Define the output file
OutFile "Economic_Simulation_Setup.exe"

; Default installation directory
InstallDir "$PROGRAMFILES\Cataclysm Studios\Economic Simulation"

; Request application privileges
RequestExecutionLevel admin

; Pages
Page directory
Page instfiles

; Installation section
Section "Install"
  ; Set output path to the installation directory
  SetOutPath $INSTDIR
  
  ; Copy all files from the dist directory
  File /r "dist\Economic_Simulation\*.*"
  
  ; Create a shortcut in the start menu
  CreateDirectory "$SMPROGRAMS\Cataclysm Studios"
  CreateShortcut "$SMPROGRAMS\Cataclysm Studios\Economic Simulation.lnk" "$INSTDIR\Economic_Simulation.exe"
  
  ; Create a shortcut on the desktop
  CreateShortcut "$DESKTOP\Economic Simulation.lnk" "$INSTDIR\Economic_Simulation.exe"
  
  ; Write the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write registry keys for uninstaller
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CataclysmEconomicSim" "DisplayName" "Cataclysm Studios Economic Simulation"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CataclysmEconomicSim" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CataclysmEconomicSim" "DisplayIcon" "$\"$INSTDIR\Economic_Simulation.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CataclysmEconomicSim" "Publisher" "Cataclysm Studios"
SectionEnd

; Uninstaller section
Section "Uninstall"
  ; Remove installed files
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\Cataclysm Studios\Economic Simulation.lnk"
  RMDir "$SMPROGRAMS\Cataclysm Studios"
  Delete "$DESKTOP\Economic Simulation.lnk"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CataclysmEconomicSim"
SectionEnd
