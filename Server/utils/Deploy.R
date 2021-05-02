library(miniCRAN)

pkgName <- 'hivPlatform'
rVersion <- '4.0'
rootPath <- file.path('d:/_DEPLOYMENT', pkgName)

# 1. REPOSITORY ------------------------------------------------------------------------------------
repoCRAN <- 'https://cran.r-project.org/'
repoPath <- file.path(rootPath, 'repository')

descr <- as.data.frame(read.dcf('DESCRIPTION'))
packageVersions <- strsplit(gsub('\n', '', descr$Imports), ',')[[1]]
pkgs <- unname(sapply(
  packageVersions, function(packageVersion) {
    gsub("(\\w+) .*", "\\1", packageVersion)
  }
))
pkgs <- setdiff(
  pkgs,
  c('R', 'hivModelling', 'grid', 'graphics', 'parallel', 'stats', 'tools', 'utils')
)
pkgList <- pkgDep(pkgs, repos = repoCRAN, type = 'source', suggests = FALSE)

if (dir.exists(repoPath)) {
  unlink(repoPath, recursive = TRUE)
}
dir.create(repoPath, showWarnings = FALSE, recursive = TRUE)

makeRepo(pkgList, path = repoPath, repos = repoCRAN, type = c('source', 'win.binary'))
oldPackages(path = repoPath)
updatePackages(path = repoPath, repos = repoCRAN, type = 'win.binary', ask = FALSE)
updatePackages(path = repoPath, repos = repoCRAN, type = 'source', ask = FALSE)

# 2. BULID -----------------------------------------------------------------------------------------

# Build source and binary versions
buildPath <- file.path(rootPath, 'build')
dir.create(buildPath, showWarnings = FALSE, recursive = TRUE)

# HIV Modelling
hivModelPkgPath <- 'D:/_REPOSITORIES/hivModelling'
pkgbuild::build(
  path = hivModelPkgPath,
  dest_path = buildPath,
  binary = FALSE
)
pkgbuild::build(
  path = hivModelPkgPath,
  dest_path = buildPath,
  binary = TRUE,
  args = c('--preclean')
)

# HIV Platform
devtools::build(path = buildPath, binary = FALSE)
devtools::build(path = buildPath, binary = TRUE, args = c('--preclean'))

# Add to repository
miniCRAN::addLocalPackage(
  'hivModelling',
  buildPath,
  repoPath,
  type = 'source'
)
miniCRAN::addLocalPackage(
  'hivModelling',
  buildPath,
  repoPath,
  type = 'win.binary',
  Rversion = rVersion
)
miniCRAN::addLocalPackage(pkgName, buildPath, repoPath, type = 'source')
miniCRAN::addLocalPackage(pkgName, buildPath, repoPath, type = 'win.binary', Rversion = rVersion)

# 3. DEPLOYMENT ------------------------------------------------------------------------------------

# Shiny server
serverDeployPath <- 'D:/_DEPLOYMENT/hivPlatform/deployment/ecdcServer/'

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
fs::dir_copy('data/', file.path(serverDeployPath, 'data/'), overwrite = TRUE)
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
  library = file.path(serverDeployPath, 'renv', 'library', 'R-4.0', 'x86_64-w64-mingw32'),
  prompt = FALSE
)

# Windows binary
winDeployPath <- 'D:/_DEPLOYMENT/hivPlatform/deployment/windowsBinary/app/'
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
fs::dir_copy('data/', file.path(winDeployPath, 'data/'), overwrite = TRUE)
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

file.copy(
  'd:/_REPOSITORIES/hivPlatform/renv/library',
  file.path(winDeployPath, 'renv'),
  overwrite = TRUE,
  recursive = TRUE
)
