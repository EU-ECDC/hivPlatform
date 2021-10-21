source(file.path(
  Sys.getenv(if (.Platform$OS.type == 'windows') 'USERPROFILE' else 'HOME'),
  '.vscode-R',
  'init.R'
))

.libPaths(c(
  'Server/renv/library/R-4.1/x86_64-w64-mingw32/',
  .libPaths()
))
