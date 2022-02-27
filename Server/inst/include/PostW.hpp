#ifndef _hivPlatform_PostW_
#define _hivPlatform_PostW_

#include "Lspline.hpp"

namespace hivPlatform {

class PostW: public Numer::Func
{
private:
  const Rcpp::DataFrame& y;
  const Eigen::MatrixXd& xAIDS;
  const double& maxDTime;
  const Eigen::MatrixXd& betaAIDS;
  const double& kappa;
  const Eigen::MatrixXd& bFE;
  const Rcpp::NumericVector& sigma2;
  const Eigen::MatrixXd& varCovRE;
  const Rcpp::List& baseCD4DM;
  const Rcpp::DataFrame& fxCD4Data;
  const Rcpp::List& baseVLDM;
  const Rcpp::DataFrame& fxVLData;
  const Rcpp::List& baseRandEffDM;
  const Rcpp::DataFrame& fzData;
  const Rcpp::NumericVector& consc;
  const Rcpp::NumericVector& consr;
public:
  PostW(
    const Rcpp::DataFrame& y_,
    const Eigen::MatrixXd& xAIDS_,
    const double& maxDTime_,
    const Eigen::MatrixXd& betaAIDS_,
    const double& kappa_,
    const Eigen::MatrixXd& bFE_,
    const Rcpp::NumericVector& sigma2_,
    const Eigen::MatrixXd& varCovRE_,
    const Rcpp::List& baseCD4DM_,
    const Rcpp::DataFrame& fxCD4Data_,
    const Rcpp::List& baseVLDM_,
    const Rcpp::DataFrame& fxVLData_,
    const Rcpp::List& baseRandEffDM_,
    const Rcpp::DataFrame& fzData_,
    const Rcpp::NumericVector& consc_,
    const Rcpp::NumericVector& consr_
  ) :
    y(y_),
    xAIDS(xAIDS_),
    maxDTime(maxDTime_),
    betaAIDS(betaAIDS_),
    kappa(kappa_),
    bFE(bFE_),
    sigma2(sigma2_),
    varCovRE(varCovRE_),
    baseCD4DM(baseCD4DM_),
    fxCD4Data(fxCD4Data_),
    baseVLDM(baseVLDM_),
    fxVLData(fxVLData_),
    baseRandEffDM(baseRandEffDM_),
    fzData(fzData_),
    consc(consc_),
    consr(consr_)
    {}

  double operator()(const double& w) const
  {
    try {
      const static Rcpp::NumericVector knotsAge = Rcpp::NumericVector::create(25, 35, 45);
      const static Rcpp::NumericVector knotsCalendar = Rcpp::NumericVector::create(16, 22);

      Eigen::MatrixXd xAIDSnew(xAIDS);
      xAIDSnew(0, 2) = xAIDSnew(0, 2) - w;

      const double lambda = (xAIDSnew * betaAIDS).array().exp()(0, 0);

      // Update CD4 design matrix
      arma::dmat dm = Rcpp::as<arma::dmat>(baseCD4DM["dm"]);
      const arma::uvec& colsDTime = Rcpp::as<arma::uvec>(baseCD4DM["colsDTime"]);
      const arma::uvec& colsAge = Rcpp::as<arma::uvec>(baseCD4DM["colsAge"]);
      const arma::uvec& colsCalendar = Rcpp::as<arma::uvec>(baseCD4DM["colsCalendar"]);
      const arma::uvec& colsDTimeGender = Rcpp::as<arma::uvec>(baseCD4DM["colsDTimeGender"]);
      const arma::uvec& colsDTimeRegion = Rcpp::as<arma::uvec>(baseCD4DM["colsDTimeRegion"]);
      const arma::uvec& colsDTimeTrans = Rcpp::as<arma::uvec>(baseCD4DM["colsDTimeTrans"]);
      const arma::uvec& colsDTimeAge = Rcpp::as<arma::uvec>(baseCD4DM["colsDTimeAge"]);
      const arma::uvec& colsGender = Rcpp::as<arma::uvec>(baseCD4DM["colsGender"]);
      const arma::uvec& colsRegion = Rcpp::as<arma::uvec>(baseCD4DM["colsRegion"]);
      const arma::uvec& colsTrans = Rcpp::as<arma::uvec>(baseCD4DM["colsTrans"]);

      const arma::dvec& DTime = Rcpp::as<arma::dvec>(fxCD4Data["DTime"]);
      const Rcpp::NumericVector& Age = Rcpp::as<Rcpp::NumericVector>(fxCD4Data["Age"]);
      const Rcpp::NumericVector& Calendar = Rcpp::as<Rcpp::NumericVector>(fxCD4Data["Calendar"]);

      dm.cols(colsDTime - 1) = DTime + w;
      dm.cols(colsAge - 1) = Rcpp::as<arma::dmat>(Lspline(Age - w, knotsAge));
      dm.cols(colsCalendar - 1) = Rcpp::as<arma::dmat>(Lspline(Calendar - w, knotsCalendar));
      dm.cols(colsDTimeGender - 1) = dm.cols(colsGender - 1).eval().each_col() % dm.cols(colsDTime - 1);
      dm.cols(colsDTimeRegion - 1) = dm.cols(colsRegion - 1).eval().each_col() % dm.cols(colsDTime - 1);
      dm.cols(colsDTimeTrans - 1) = dm.cols(colsTrans - 1).eval().each_col() % dm.cols(colsDTime - 1);
      dm.cols(colsDTimeAge - 1) = dm.cols(colsAge - 1).eval().each_col() % dm.cols(colsDTime - 1);

      Rcpp::Rcout << dm << std::endl;

      return lambda;
    } catch(...) {
      Rcpp::Rcout << 'Error' << std::endl;
    }

    return 0.0;
  }
};

} // namespace

#endif // _hivPlatform_PostW_
