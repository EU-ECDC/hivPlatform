#include "header.h"

// [[Rcpp::export]]
Rcpp::IntegerVector Seq(
  const int& start,
  const int& end
) {
  return hivPlatform::Seq(start, end);
}

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
  const Rcpp::DataFrame& z,
  const Eigen::MatrixXd& xAIDS,
  const Rcpp::NumericVector& maxDTime,
  const Eigen::MatrixXd& betaAIDS,
  const Rcpp::NumericVector& kappa,
  const Rcpp::NumericVector& bFE,
  const Rcpp::NumericVector& sigma2,
  const Rcpp::NumericVector& varCovRE,
  const Rcpp::NumericVector& fxCD4Data,
  const Rcpp::NumericVector& fxVRData,
  const Rcpp::NumericVector& fzData,
  const Rcpp::NumericVector& consc,
  const Rcpp::NumericVector& consr
) {
  hivPlatform::PostW f(
    y, z, xAIDS, maxDTime, betaAIDS, kappa, bFE, sigma2, varCovRE, fxCD4Data, fxVRData, fzData,
    consc, consr
  );

  return f(w);
}
