deployPath <- 'D:/_REPOSITORIES/hivPlatform/'

# Copy files and folders
sapply(
  c('app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'README.md', '.Rprofile', 'renv.lock'),
  fs::file_copy,
  new_path = deployPath
)

fs::dir_create(file.path(deployPath, 'renv'))
fs::file_copy('renv/activate.R', file.path(deployPath, 'renv/'), overwrite = TRUE)
fs::file_copy('renv/settings.dcf', file.path(deployPath, 'renv/'), overwrite = TRUE)
fs::dir_copy('man', deployPath)
fs::dir_copy('inst', deployPath)
fs::dir_copy('data', deployPath)
fs::dir_copy('R', deployPath)

rProfileFile <- file(file.path(deployPath, '.Rprofile'))
lines <- readLines(rProfileFile)
writeLines(lines[1], rProfileFile)
close(rProfileFile)

renvSettingsFile <- file(file.path(deployPath, 'renv', 'settings.dcf'))
lines <- readLines(renvSettingsFile)
lines[1] <- 'external.libraries:'
writeLines(lines, renvSettingsFile)
close(renvSettingsFile)
