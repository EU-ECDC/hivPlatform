source('renv/activate.R')

options(repos = c(RSPM = 'https://packagemanager.rstudio.com/all/latest'))
options(renv.config.repos.override = getOption('repos'))
options(renv.config.rspm.enabled = TRUE)

source(file.path(
  Sys.getenv(if (.Platform$OS.type == 'windows') 'USERPROFILE' else 'HOME'),
  '.vscode-R',
  'init.R'
))
