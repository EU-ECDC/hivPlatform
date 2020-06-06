library(miniCRAN)

rVersion <- '4.0'
repoPath <- 'd:/_DEPLOYMENT/hivEstimatesAccuracy2/repo'
repoCRAN <- 'https://cran.r-project.org/'

pkgs <- c(
  'cli', 'data.table', 'ggplot2', 'jomo', 'knitr', 'mice', 'mitools', 'pkgload',
  'plotly', 'quantreg', 'R6', 'readxl', 'rmarkdown', 'rstudioapi', 'shiny', 'SparseM',
  'utils', 'stats'
)
pkgs <- setdiff(pkgs, c('grid', 'graphics', 'parallel', 'stats', 'tools', 'utils'))
pkgList <- pkgDep(pkgs, repos = repoCRAN, type = 'source', suggests = FALSE)

if (dir.exists(repoPath)) {
  unlink(repoPath, recursive = TRUE)
}
dir.create(repoPath, showWarnings = FALSE, recursive = TRUE)

makeRepo(pkgList, path = repoPath, repos = repoCRAN, type = c('source', 'win.binary'))
oldPackages(path = repoPath)
updatePackages(path = repoPath, repos = repoCRAN, type = 'win.binary', ask = FALSE)
updatePackages(path = repoPath, repos = repoCRAN, type = 'source', ask = FALSE)
