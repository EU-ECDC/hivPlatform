deployPath <- 'D:/_REPOSITORIES/hivPlatform/'

# Copy files and folders
sapply(
  c(
    'app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'README.md', '.Rprofile', 'renv.lock',
    '../.gitattributes'
  ),
  fs::file_copy,
  new_path = deployPath,
  overwrite = TRUE
)

fs::dir_create(file.path(deployPath, 'renv'))
fs::file_copy('renv/activate.R', file.path(deployPath, 'renv/'), overwrite = TRUE)
fs::file_copy('renv/settings.dcf', file.path(deployPath, 'renv/'), overwrite = TRUE)
fs::dir_copy('man/', file.path(deployPath, 'man/'), overwrite = TRUE)
fs::dir_copy('inst/', file.path(deployPath, 'inst/'), overwrite = TRUE)
fs::dir_copy('data/', file.path(deployPath, 'data/'), overwrite = TRUE)
fs::dir_copy('R/', file.path(deployPath, 'R/'), overwrite = TRUE)

rProfileFile <- file(file.path(deployPath, '.Rprofile'))
lines <- readLines(rProfileFile)
writeLines(lines[1], rProfileFile)
close(rProfileFile)

renvSettingsFile <- file(file.path(deployPath, 'renv', 'settings.dcf'))
lines <- readLines(renvSettingsFile)
lines[1] <- 'external.libraries:'
writeLines(lines, renvSettingsFile)
close(renvSettingsFile)
