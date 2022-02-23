#ifndef _hivPlatform_BetaPDF_
#define _hivPlatform_BetaPDF_

namespace hivPlatform {

// P(0.3 < X < 0.8), X ~ Beta(a, b)
class BetaPDF: public Numer::Func
{
private:
    double a;
    double b;
public:
    BetaPDF(double a_, double b_) : a(a_), b(b_) {}

    double operator()(const double& x) const
    {
      return R::dbeta(x, a, b, 0);
    }
};

} // namespace

#endif // _hivPlatform_BetaPDF_
