#include "header.h"

// [[Rcpp::export]]
double PostWCpp(
  const double& w,
  const arma::dvec& y,
  const arma::dmat& xAIDS,
  const double& maxDTime,
  const arma::dmat& betaAIDS,
  const double& kappa,
  const arma::dmat& bFE,
  const arma::dmat& varCovRE,
  const Rcpp::List& baseCD4DM,
  const Rcpp::DataFrame& fxCD4Data,
  const Rcpp::List& baseVLDM,
  const Rcpp::DataFrame& fxVLData,
  const Rcpp::List& baseRandEffDM,
  const Rcpp::DataFrame& fzData,
  const arma::dmat& err
) {
  hivPlatform::PostW f(
    y, xAIDS, maxDTime, betaAIDS, kappa, bFE, varCovRE, baseCD4DM, fxCD4Data, baseVLDM, fxVLData,
    baseRandEffDM, fzData, err
  );

  return f(w);
};

// [[Rcpp::export]]
Rcpp::List IntegratePostWCpp(
  const double& lower,
  const double& upper,
  const arma::dvec& y,
  const arma::dmat& xAIDS,
  const double& maxDTime,
  const arma::dmat& betaAIDS,
  const double& kappa,
  const arma::dmat& bFE,
  const arma::dmat& varCovRE,
  const Rcpp::List& baseCD4DM,
  const Rcpp::DataFrame& fxCD4Data,
  const Rcpp::List& baseVLDM,
  const Rcpp::DataFrame& fxVLData,
  const Rcpp::List& baseRandEffDM,
  const Rcpp::DataFrame& fzData,
  const arma::dmat& err
) {
  hivPlatform::PostW f(
    y, xAIDS, maxDTime, betaAIDS, kappa, bFE, varCovRE, baseCD4DM, fxCD4Data, baseVLDM, fxVLData,
    baseRandEffDM, fzData, err
  );

  double errEst;
  int errCode;
  const double res = Numer::integrate(
    f,
    lower,
    upper,
    errEst,
    errCode,
    100,
    0.0001220703,
    0.0001220703,
    Numer::Integrator<double>::GaussKronrod15
  );
  return Rcpp::List::create(
    Rcpp::Named("value") = res,
    Rcpp::Named("errorEstimate") = errEst,
    Rcpp::Named("errorCode") = errCode
  );
};

// [[Rcpp::export]]
Rcpp::NumericMatrix Lspline(
  const Rcpp::NumericMatrix& x,
  const Rcpp::NumericMatrix& knots
) {
  return hivPlatform::Lspline(x, knots);
};


// [[Rcpp::export]]
double GetLogMVNPdf(
  const arma::dvec& x,
  const arma::dvec& mu,
  const arma::dmat& sigma
) {
  return hivPlatform::GetLogMVNPdf(x, mu, sigma);
};

// [[Rcpp::export]]
double GetLogMVNPdf2(
  const Rcpp::NumericVector& x,
  const Rcpp::NumericVector& mu,
  const Rcpp::NumericMatrix& sigma
) {
  const double out = hivPlatform::GetLogMVNPdf2(
    Rcpp::as<arma::dvec>(x),
    Rcpp::as<arma::dvec>(mu),
    Rcpp::as<arma::dmat>(sigma)
  );

  return out;
};
