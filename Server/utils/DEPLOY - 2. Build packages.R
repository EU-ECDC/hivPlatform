rVersion <- '4.0'
renv::restore()

# Documentation, testing, check
devtools::document()

# Build source and binary versions

repoPath <- 'd:/_DEPLOYMENT/hivEstimatesAccuracy2/pkgBuilds'
deployPath <- 'd:/_DEPLOYMENT/hivEstimatesAccuracy2'
dir.create(repoPath, showWarnings = FALSE, recursive = TRUE)
devtools::build(path = repoPath, binary = FALSE)
devtools::build(path = repoPath, binary = TRUE, args = c('--preclean'))

# Read new version string
descr <- as.data.frame(read.dcf(file = 'DESCRIPTION'))
version <- as.character(descr$Version)

tarFileName <- paste0('hivEstimatesAccuracy2_', version, '.tar.gz')
zipFileName <- paste0('hivEstimatesAccuracy2_', version, '.zip')

# Copy package files to appropriate subfolders
file.copy(
  file.path(repoPath, tarFileName),
  file.path(deployPath, 'repo', 'src', 'contrib', tarFileName),
  overwrite = TRUE
)
file.copy(
  file.path(repoPath, zipFileName),
  file.path(repoPath, '..', 'repo', 'bin', 'windows', 'contrib', rVersion, zipFileName),
  overwrite = TRUE
)

# Update repo metafiles
tools::write_PACKAGES(
  dir = file.path(deployPath, 'repo', 'src', 'contrib'),
  type = 'source'
)
tools::write_PACKAGES(
  dir = file.path(deployPath, 'repo', 'bin', 'windows', 'contrib', rVersion),
  type = 'win.binary'
)
