#ifndef _hivPlatform_header_
#define _hivPlatform_header_

// [[Rcpp::depends(RcppEigen)]]
// [[Rcpp::depends(RcppNumerical)]]

#include <Rcpp.h>
#include <RcppEigen.h>
#include <RcppNumerical.h>

typedef Eigen::Map<Eigen::MatrixXd> MapMatd;

#include "Seq.hpp"
#include "BetaPDF.hpp"
#include "PostW.hpp"

#endif // _hivPlatform_header_
