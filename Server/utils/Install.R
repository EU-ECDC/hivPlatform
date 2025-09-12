# Create folder for R packages library and set it as the default library
rootPath <- "D:/_DEPLOYMENT/Test"

# Define the GitHub repository reference
githubRepoRef <- "nextpagesoft/hivPlatform/Server@updates"

# Define the path to the R packages library
libPath <- file.path(rootPath, "library")

# Create the folder for the R packages library (if it does not exist).
# REQUIRED TO RUN ONLY ONCE FOR A GIVEN `libPath`.
dir.create(libPath, recursive = TRUE, showWarnings = FALSE)

# Set the R packages library as the default library
.libPaths(libPath)

# Install the pak package.
# REQUIRED TO RUN ONLY ONCE FOR A GIVEN `libPath`.
install.packages("pak")

# Install the hivPlatform package
pak::pkg_install("nextpagesoft/hivEstInfTime", dependencies = "hard", upgrade = TRUE, ask = FALSE)
pak::pkg_install("nextpagesoft/hivModelling", dependencies = "hard", upgrade = TRUE, ask = FALSE)
pak::pkg_install(
  "nextpagesoft/hivPlatform/Server@updates",
  dependencies = "hard",
  upgrade = TRUE,
  ask = FALSE
)

# Run the hivPlatform package
hivPlatform::RunApp(launchBrowser = TRUE, stopOnSessionEnded = TRUE)
