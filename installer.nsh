!macro customInstall
  ; Set environment variables for current user
  SetRegView 64
  
  ; Refresh environment variables
  SendMessage ${HWND_BROADCAST} ${WM_SETTINGCHANGE} 0 "STR:Environment" /TIMEOUT=5000
!macroend