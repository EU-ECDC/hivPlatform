pkgName <- 'hivPlatform'
pkgDescr <- as.data.frame(read.dcf('DESCRIPTION'))
pkgVersion <- pkgDescr$Version
rVersion <- '4.2'
deployDate <- format(Sys.Date(), '%Y%m%d')
rootPath <- file.path('d:/_DEPLOYMENT', pkgName)
repoPath <- file.path(rootPath, sprintf('repository_%s_%s', pkgVersion, deployDate))
repoCRAN <- 'https://cloud.r-project.org'
args <- c('--preclean')

# 1. REPOSITORY ------------------------------------------------------------------------------------
depPkgVersions <- strsplit(gsub('\n', '', pkgDescr$Imports), ',')[[1]]
depPkgs <- unname(sapply(
  depPkgVersions, function(v) {
    gsub("(\\w+) .*", "\\1", v)
  }
))
depPkgs <- setdiff(
  depPkgs,
  c('R', 'hivModelling', 'grid', 'graphics', 'parallel', 'stats', 'tools', 'utils')
)
depPkgList <- miniCRAN::pkgDep(depPkgs, repos = repoCRAN, type = 'source', suggests = FALSE)

if (dir.exists(repoPath)) {
  unlink(repoPath, recursive = TRUE)
}
dir.create(repoPath, showWarnings = FALSE, recursive = TRUE)

miniCRAN::makeRepo(depPkgList, path = repoPath, repos = repoCRAN, type = c('source', 'win.binary'))
miniCRAN::oldPackages(path = repoPath)
miniCRAN::updatePackages(path = repoPath, repos = repoCRAN, type = 'win.binary', ask = FALSE)
miniCRAN::updatePackages(path = repoPath, repos = repoCRAN, type = 'source', ask = FALSE)

# 2. BULID -----------------------------------------------------------------------------------------

# Build source and binary versions
buildPath <- file.path(rootPath, 'build')
dir.create(buildPath, showWarnings = FALSE, recursive = TRUE)

# HIV Modelling
hivModelPkgPath <- 'D:/_REPOSITORIES/hivModelling'
pkgbuild::build(path = hivModelPkgPath, dest_path = buildPath, binary = FALSE)
pkgbuild::build(path = hivModelPkgPath, dest_path = buildPath, binary = TRUE, args = args)

# HIV Platform
pkgbuild::build(dest_path = buildPath, binary = FALSE)
pkgbuild::build(dest_path = buildPath, binary = TRUE, args = args)

# Add to repository
miniCRAN::addLocalPackage('hivModelling', buildPath, repoPath, type = 'source')
miniCRAN::addLocalPackage('hivModelling', buildPath, repoPath, type = 'win.binary', Rversion = rVersion) # nolint
miniCRAN::addLocalPackage(pkgName, buildPath, repoPath, type = 'source')
miniCRAN::addLocalPackage(pkgName, buildPath, repoPath, type = 'win.binary', Rversion = rVersion)

# 3. WINDOWS BINARY DEPLOYMENT ---------------------------------------------------------------------

winDeployPath <- file.path(rootPath, 'deployment/windowsBinary/app/')
dir.create(winDeployPath, showWarnings = FALSE, recursive = TRUE)

# Copy files and folders
sapply(
  c('appWindows.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'README.md', 'renv.lock'),
  fs::file_copy,
  new_path = winDeployPath,
  overwrite = TRUE
)

fs::dir_create(file.path(winDeployPath, 'renv'))
fs::file_copy('renv/activate.R', file.path(winDeployPath, 'renv/'), overwrite = TRUE)
fs::file_copy('renv/settings.dcf', file.path(winDeployPath, 'renv/'), overwrite = TRUE)
fs::dir_copy('man/', file.path(winDeployPath, 'man/'), overwrite = TRUE)
fs::dir_copy('inst/', file.path(winDeployPath, 'inst/'), overwrite = TRUE)
fs::dir_copy('data-raw/', file.path(winDeployPath, 'data-raw/'), overwrite = TRUE)
fs::dir_copy('R/', file.path(winDeployPath, 'R/'), overwrite = TRUE)

rProfileFile <- file(file.path(winDeployPath, '.Rprofile'))
rProfileContent <- 'source("renv/activate.R")'
writeLines(rProfileContent, rProfileFile)
close(rProfileFile)

renvSettingsFile <- file(file.path(winDeployPath, 'renv', 'settings.dcf'))
renvSettingsContent <- readLines(renvSettingsFile)
extLibLine <- which(grepl('^external.libraries', renvSettingsContent))[1]
renvSettingsContent[extLibLine] <- 'external.libraries:'
writeLines(renvSettingsContent, renvSettingsFile)
close(renvSettingsFile)

appServerFile <- file(file.path(winDeployPath, 'R', 'AppServer.R'))
appServerContent <- readLines(appServerFile)
sessionEndFound <- any(grepl('session\\$onSessionEnded\\(stopApp\\)', appServerContent))
if (!sessionEndFound) {
  returnLine <- which(grepl('return\\(invisible\\(NULL\\)\\)', appServerContent))[1]

  appServerContent <- c(
    appServerContent[1:returnLine - 1],
    '  session$onSessionEnded(stopApp)',
    appServerContent[returnLine:length(appServerContent)]
  )
  writeLines(appServerContent, appServerFile)
  close(appServerFile)
}

unlink(
  file.path(winDeployPath, 'library'),
  recursive = TRUE
)
renv::restore(
  project = winDeployPath,
  library = file.path(winDeployPath, 'library', 'R-4.2', 'x86_64-w64-mingw32'),
  prompt = FALSE,
  clean = TRUE
)


file.copy(
  file.path(serverDeployPath, 'renv/library/'),
  file.path(winDeployPath, 'renv'),
  overwrite = TRUE,
  recursive = TRUE
)

redundantFolders <- fs::dir_ls(
  file.path(winDeployPath, 'library'),
  type = 'directory',
  recurse = TRUE,
  regexp = '(help|html|i386|tests)$'
)
sapply(redundantFolders, unlink, recursive = TRUE)

redundantFolders <- fs::dir_ls(
  file.path(winDeployPath, '../dist/R-Portable/App/R-Portable/library'),
  type = 'directory',
  recurse = TRUE,
  regexp = '(help|html|i386|tests)$'
)
sapply(redundantFolders, unlink, recursive = TRUE)


# 4. ECDC SHINY SERVER DEPLOYMENT ------------------------------------------------------------------

serverDeployPath <- file.path(rootPath, 'deployment/ecdcServer/')

# Copy files and folders
sapply(
  c(
    'app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'README.md', '.Rprofile', 'renv.lock',
    '../.gitattributes'
  ),
  fs::file_copy,
  new_path = serverDeployPath,
  overwrite = TRUE
)

fs::dir_create(file.path(serverDeployPath, 'renv'))
fs::file_copy('renv/activate.R', file.path(serverDeployPath, 'renv/'), overwrite = TRUE)
fs::file_copy('renv/settings.dcf', file.path(serverDeployPath, 'renv/'), overwrite = TRUE)
fs::dir_copy('man/', file.path(serverDeployPath, 'man/'), overwrite = TRUE)
fs::dir_copy('inst/', file.path(serverDeployPath, 'inst/'), overwrite = TRUE)
fs::dir_copy('data-raw/', file.path(serverDeployPath, 'data-raw/'), overwrite = TRUE)
fs::dir_copy('R/', file.path(serverDeployPath, 'R/'), overwrite = TRUE)

rProfileFile <- file(file.path(serverDeployPath, '.Rprofile'))
rProfileContent <- 'source("renv/activate.R")'
writeLines(rProfileContent, rProfileFile)
close(rProfileFile)

renvSettingsFile <- file(file.path(serverDeployPath, 'renv', 'settings.dcf'))
renvSettingsContent <- readLines(renvSettingsFile)
extLibLine <- which(grepl('^external.libraries', renvSettingsContent))[1]
renvSettingsContent[extLibLine] <- 'external.libraries:'
writeLines(renvSettingsContent, renvSettingsFile)
close(renvSettingsFile)

renv::restore(
  project = serverDeployPath,
  library = file.path(serverDeployPath, 'renv', 'library', 'R-4.1', 'x86_64-w64-mingw32'),
  prompt = FALSE
)

# 5. DEPLOYMENT ------------------------------------------------------------------------------------
pak::pak('.', depedendencies = 'hard')
