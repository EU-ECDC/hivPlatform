#ifndef _hivPlatform_header_
#define _hivPlatform_header_

// [[Rcpp::depends(RcppArmadillo)]]
// [[Rcpp::depends(RcppEigen)]]
// [[Rcpp::depends(RcppNumerical)]]

#define ARMA_NO_DEBUG true
#define BOOST_DISABLE_ASSERTS true

#include <RcppArmadillo.h>
#include <Rcpp.h>
#include <RcppEigen.h>
#include <RcppNumerical.h>

#include "Lspline.hpp"
#include "GetLogMVNPdf.hpp"
#include "PostW.hpp"

#ifdef _OPENMP
#include <omp.h>
#endif

#endif // _hivPlatform_header_
