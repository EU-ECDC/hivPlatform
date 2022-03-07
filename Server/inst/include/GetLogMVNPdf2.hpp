#ifndef _hivPlatform_GetLogMVNPdf2_
#define _hivPlatform_GetLogMVNPdf2_

#include "GetMahalanobisDistance.hpp";

namespace hivPlatform {

static double const log2pi = std::log(2.0 * M_PI);

double GetLogMVNPdf2(
  const arma::dvec& x,
  const arma::dvec& mu,
  const arma::dmat& sigma
) {
  const arma::dmat cholDec = arma::chol(sigma);

  const double out =
    - 0.5 * GetMahalanobisDistance(x, mu, cholDec) -
      ((x.n_elem / 2.0) * log2pi +
      arma::sum(arma::log(cholDec.diag())));

  return out;
}

} // namespace

#endif // _hivPlatform_GetLogMVNPdf2_
