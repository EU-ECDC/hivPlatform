#ifndef _hivPlatform_GetMahalanobisDistance_
#define _hivPlatform_GetMahalanobisDistance_

namespace hivPlatform {

double GetMahalanobisDistance(
  const arma::dvec& x,
  const arma::dvec& mu,
  const arma::dmat& cholDec
) {
  const arma::dmat cholDecTrg = arma::trimatl(cholDec.t());
  if (any(cholDecTrg.diag() <= 0.0)) {
    Rcpp::stop("The supplied Cholesky decomposition has values <= 0.0 on the main diagonal.");
  }

  const arma::dvec d = cholDecTrg.diag();
  arma::dvec tmp(x.n_elem);

  double acc;

  // For each of the "n" random vectors, forwardsolve the corresponding linear system.
  for (size_t i = 0; i < x.n_elem; ++i) {
    acc = 0.0;
    for (size_t j = 0; j < i; ++j) {
      acc += tmp.at(j) * cholDecTrg.at(i, j);
    }
    tmp.at(i) = (x.at(i) - mu.at(i) - acc) / d.at(i);
  }
  const double out = arma::sum(arma::square(tmp));

  return out;
}

} // namespace

#endif // _hivPlatform_GetMahalanobisDistance_
