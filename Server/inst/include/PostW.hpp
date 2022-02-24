#ifndef _hivPlatform_PostW_
#define _hivPlatform_PostW_

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
      Eigen::MatrixXd xAIDSnew(xAIDS);
      xAIDSnew(0, 2) = xAIDSnew(0, 2) - w;

      const double lambda = (xAIDSnew * betaAIDS).array().exp()(0, 0);

      // Update CD4 design matrix
      Eigen::Map<Eigen::MatrixXd> dm(Rcpp::as<Eigen::Map<Eigen::MatrixXd>>(baseCD4DM["dm"]));

      // b$dm[, b$colsAge] <- lspline::lspline(data$Age - w, knots = c(25, 35, 45))
      // b$dm[, b$colsCalendar] <- lspline::lspline(data$Calendar - w, knots = c(16, 22))
      // b$dm[, b$colsDTimeGender] <- b$dm[, b$colsDTime] * b$dm[, b$colsGender]
      // b$dm[, b$colsDTimeRegion] <- b$dm[, b$colsDTime] * b$dm[, b$colsRegion]
      // b$dm[, b$colsDTimeTrans] <- b$dm[, b$colsDTime] * b$dm[, b$colsTrans]
      // b$dm[, b$colsDTimeAge] <- b$dm[, b$colsDTime] * b$dm[, b$colsAge]

      return lambda;
    } catch(...) {
      Rcpp::Rcout << 'Error' << std::endl;
    }

    return 0.0;
  }
};

} // namespace

#endif // _hivPlatform_PostW_
