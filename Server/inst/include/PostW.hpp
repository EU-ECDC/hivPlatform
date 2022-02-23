#ifndef _hivPlatform_PostW_
#define _hivPlatform_PostW_

namespace hivPlatform {

class PostW: public Numer::Func
{
private:
  const Rcpp::DataFrame& y;
  const Rcpp::DataFrame& z;
  const Eigen::MatrixXd& xAIDS;
  const Rcpp::NumericVector& maxDTime;
  const Eigen::MatrixXd& betaAIDS;
  const Rcpp::NumericVector& kappa;
  const Rcpp::NumericVector& bFE;
  const Rcpp::NumericVector& sigma2;
  const Rcpp::NumericVector& varCovRE;
  const Rcpp::NumericVector& fxCD4Data;
  const Rcpp::NumericVector& fxVRData;
  const Rcpp::NumericVector& fzData;
  const Rcpp::NumericVector& consc;
  const Rcpp::NumericVector& consr;
public:
  PostW(
    const Rcpp::DataFrame& y_,
    const Rcpp::DataFrame& z_,
    const Eigen::MatrixXd& xAIDS_,
    const Rcpp::NumericVector& maxDTime_,
    const Eigen::MatrixXd& betaAIDS_,
    const Rcpp::NumericVector& kappa_,
    const Rcpp::NumericVector& bFE_,
    const Rcpp::NumericVector& sigma2_,
    const Rcpp::NumericVector& varCovRE_,
    const Rcpp::NumericVector& fxCD4Data_,
    const Rcpp::NumericVector& fxVRData_,
    const Rcpp::NumericVector& fzData_,
    const Rcpp::NumericVector& consc_,
    const Rcpp::NumericVector& consr_
  ) :
    y(y_),
    z(z_),
    xAIDS(xAIDS_),
    maxDTime(maxDTime_),
    betaAIDS(betaAIDS_),
    kappa(kappa_),
    bFE(bFE_),
    sigma2(sigma2_),
    varCovRE(varCovRE_),
    fxCD4Data(fxCD4Data_),
    fxVRData(fxVRData_),
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

      return lambda;
    } catch(...) {
      Rcpp::Rcout << 'Error' << std::endl;
    }

    return 0.0;
  }
};

} // namespace

#endif // _hivPlatform_PostW_
