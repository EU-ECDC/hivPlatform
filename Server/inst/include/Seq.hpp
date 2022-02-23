#ifndef _hivPlatform_Seq_
#define _hivPlatform_Seq_

namespace hivPlatform {

inline Rcpp::IntegerVector Seq(
  const int& start,
  const int& end
) {
  Rcpp::IntegerVector seqVec = Rcpp::seq(start, end);

  return seqVec;
}

} // namespace

#endif // _hivPlatform_Seq_
