#include "header.h"

// [[Rcpp::export]]
Rcpp::List integrate_test()
{
  const double a = 3, b = 10;
  const double lower = 0.3, upper = 0.8;
  const double true_val = R::pbeta(upper, a, b, 1, 0) - R::pbeta(lower, a, b, 1, 0);

  hivPlatform::BetaPDF f(a, b);
  double err_est;
  int err_code;
  const double res = Numer::integrate(f, lower, upper, err_est, err_code);
  return Rcpp::List::create(
    Rcpp::Named("true") = true_val,
    Rcpp::Named("approximate") = res,
    Rcpp::Named("error_estimate") = err_est,
    Rcpp::Named("error_code") = err_code
  );
}

// [[Rcpp::export]]
double PostWCpp(
  const double& w,
  const Rcpp::DataFrame& y,
  const Eigen::MatrixXd& xAIDS,
  const double& maxDTime,
  const Eigen::MatrixXd& betaAIDS,
  const double& kappa,
  const Eigen::MatrixXd& bFE,
  const Rcpp::NumericVector& sigma2,
  const Eigen::MatrixXd& varCovRE,
  const Rcpp::List& baseCD4DM,
  const Rcpp::DataFrame& fxCD4Data,
  const Rcpp::List& baseVLDM,
  const Rcpp::DataFrame& fxVLData,
  const Rcpp::List& baseRandEffDM,
  const Rcpp::DataFrame& fzData,
  const Rcpp::NumericVector& consc,
  const Rcpp::NumericVector& consr
) {
  hivPlatform::PostW f(
    y, xAIDS, maxDTime, betaAIDS, kappa, bFE, sigma2, varCovRE, baseCD4DM, fxCD4Data, baseVLDM,
    fxVLData, baseRandEffDM, fzData, consc, consr
  );

  return f(w);
}
