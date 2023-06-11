# 1. Update local packages -------------------------------------------------------------------------
pak::local_install_deps(root = '.', dependencies = 'hard', upgrade = TRUE)

pkgDescr <- as.data.frame(read.dcf('DESCRIPTION'))
pkgName <- pkgDescr$Package
pkgVersion <- pkgDescr$Version
rVersion <- '4.3'
deployDate <- format(Sys.Date(), '%Y%m%d')
rootPath <- file.path('d:/_DEPLOYMENT', pkgName)
repoPath <- file.path(rootPath, sprintf('repository_%s_%s', pkgVersion, deployDate))
repoCRAN <- getOption('repos')[['CRAN']]
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
  c('R', 'hivModelling', 'HivEstInfTime', 'grid', 'graphics', 'parallel', 'stats', 'tools', 'utils')
)
depPkgList <- miniCRAN::pkgDep(depPkgs, repos = repoCRAN, type = 'source', suggests = FALSE)

if (dir.exists(repoPath)) {
  unlink(repoPath, recursive = TRUE)
}
dir.create(repoPath, showWarnings = FALSE, recursive = TRUE)

miniCRAN::makeRepo(depPkgList, path = repoPath, repos = repoCRAN, type = c('source', 'win.binary'))
miniCRAN::oldPackages(path = repoPath, repos = repoCRAN)
miniCRAN::updatePackages(path = repoPath, repos = repoCRAN, type = 'win.binary', ask = FALSE)
miniCRAN::updatePackages(path = repoPath, repos = repoCRAN, type = 'source', ask = FALSE)

# 2. BULID -----------------------------------------------------------------------------------------

# Build source and binary versions
buildPath <- file.path(rootPath, 'build')
dir.create(buildPath, showWarnings = FALSE, recursive = TRUE)

# HIV Estimate Infection Time
hivEstInfTimePkgPath <- 'D:/_REPOSITORIES/HivEstInfTime'
pkgbuild::build(path = hivEstInfTimePkgPath, dest_path = buildPath, binary = FALSE)
pkgbuild::build(path = hivEstInfTimePkgPath, dest_path = buildPath, binary = TRUE, args = args)

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
unlink(winDeployPath, recursive = TRUE)
dir.create(winDeployPath, showWarnings = FALSE, recursive = TRUE)

# Copy files and folders
sapply(
  c('appWindows.R', '.Rprofile'),
  fs::file_copy,
  new_path = winDeployPath,
  overwrite = TRUE
)
fs::dir_create(file.path(winDeployPath, 'library'))
pak::pkg_install(
  'github::nextpagesoft/hivPlatform/Server',
  dependencies = 'hard',
  lib = file.path(winDeployPath, 'library')
)
fs::file_delete(file.path(winDeployPath, 'library', '_cache'))

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
install.packages('pak', repos = 'https://r-lib.github.io/p/pak/devel/')
pak::pkg_install(
  pkg = 'github::nextpagesoft/hivPlatform/Server',
  dependencies = 'hard',
  upgrade = TRUE,
  ask = FALSE
)

# remotes::install_github('nextpagesoft/hivEstimatesAccuracy2', subdir = 'Server', ref = 'migrant')
