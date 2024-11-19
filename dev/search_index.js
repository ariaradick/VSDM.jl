var documenterSearchIndex = {"docs":
[{"location":"ref/reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"ref/reference/#Index","page":"Reference","title":"Index","text":"","category":"section"},{"location":"ref/reference/","page":"Reference","title":"Reference","text":"Pages = [\"reference.md\"]","category":"page"},{"location":"ref/reference/#Docstrings","page":"Reference","title":"Docstrings","text":"","category":"section"},{"location":"ref/reference/","page":"Reference","title":"Reference","text":"Wavelet\nTophat\nf_uSph\nGaussianF\nf2_norm\nProjectF\nProjectedF\nFCoeffs\nupdate!\nwriteFnlm\nreadFnlm\nrate\nModelDMSM","category":"page"},{"location":"ref/reference/#VectorSpaceDarkMatter.Wavelet","page":"Reference","title":"VectorSpaceDarkMatter.Wavelet","text":"Wavelet(umax)\n\nSpherical Haar wavelets. Contains the maximum value of u = vecu that the  basis of will be evaluated over. If umax is omitted, it will be set to 1.0\n\n\n\n\n\n","category":"type"},{"location":"ref/reference/#VectorSpaceDarkMatter.Tophat","page":"Reference","title":"VectorSpaceDarkMatter.Tophat","text":"Tophat(xi[, umax])\n\nTophat basis functions between each point in xi. The range will be scaled by umax, the maximum value of u = vecu. If umax is omitted, it will be set to 1.0\n\n\n\n\n\n","category":"type"},{"location":"ref/reference/#VectorSpaceDarkMatter.f_uSph","page":"Reference","title":"VectorSpaceDarkMatter.f_uSph","text":"f_uSph(f::Function; z_even=false, phi_even=false, \n    phi_cyclic=1, phi_symmetric=false)\n\nStruct that adds decorations to a function f(u theta phi) that tell ProjectF various properties about the function that speed up integration.\n\nz_even : (boolean) if f_uSph(x,y,z) = f_uSph(x,y,-z). Implies             langle ell m  f rangle = 0 if (ell+m) is odd\n\nphi_even : (boolean) if f_uSph(u,theta,phi) = f_uSph(u,theta,-phi)              Implies langle ell m  f rangle = 0 if m is odd\n\nphi_cyclic : (integer) if f_uSph(u,theta,phi) = f_uSph(u,theta,phi + 2*pi/n)\n\nphi_symmetric : (boolean) if f_uSph(u,theta) is independent of phi\n\n\n\n\n\n","category":"type"},{"location":"ref/reference/#VectorSpaceDarkMatter.GaussianF","page":"Reference","title":"VectorSpaceDarkMatter.GaussianF","text":"GaussianF(c::Float64, uSph::Vector{Float64}, sigma::Float64)\n\nContains parameters for a gaussian function where uSph is the spherical vector indicating the center of the gaussian, uSph = (u, theta, phi). sigma is the dispersion (equal to sqrt2 sigma in a \"normal\" gaussian).  c is the overall amplitude. u and sigma should have the same units.\n\nAn instance g of GaussianF is callable by g(uvec), which will evaluate the gaussian at uvec = [u, theta, phi].\n\n\n\n\n\n","category":"type"},{"location":"ref/reference/#VectorSpaceDarkMatter.f2_norm","page":"Reference","title":"VectorSpaceDarkMatter.f2_norm","text":"f2_norm(g::GaussianF)\n\nL2 norm of a single Gaussian int d^3 u  g^2(u)\n\n\n\n\n\nf2_norm(g::Vector{GaussianF})\n\nL2 norm of a set of Gaussians int d^3 u  (sum_i g_i(u))^2\n\n\n\n\n\nf2_norm(f::Function, a, b)\n\nIntegral int d^3 u  f^2(u) over the range a = [u_min, theta_min, phi_min] to b = [u_max, theta_max, phi_max].\n\n\n\n\n\nf2_norm(pf::T) where T<:Union{ProjectedF, FCoeffs}\n\nint d^3 u  f^2(u) for a ProjectedF or FCoeffs is equal to  u_textrmmax^3 sum_n ell m f_n ell m^2\n\n\n\n\n\n","category":"function"},{"location":"ref/reference/#VectorSpaceDarkMatter.ProjectF","page":"Reference","title":"VectorSpaceDarkMatter.ProjectF","text":"ProjectF(f, nl_max::Tuple{Int,Int}, radial_basis::RadialBasis; \n         dict=false, use_measurements=false, integ_method=:cubature,\n         integ_params=(;))\n\nEvaluates langle f  n ell m rangle at each (nellm) up to  nl_max = (n_max, l_max) and returns the result as a ProjectedF.\n\nf : Can be a Function, f_uSph, GaussianF, or Vector{GaussianF}.        f_uSph is preferred if your function has any symmetries, and is not        gaussian, as specifying those will greatly speed up evaluation.\n\nradial_basis : Either a Wavelet or Tophat\n\ndict : If true, returns an FCoeffs instead of a ProjectedF, which stores     the coefficients as a dictionary instead.\n\nuse_measurements : If true, will give the results as a measurement with     uncertainty given by the integration error.\n\ninteg_method : Either :cubature, :vegas, or :vegasmc\n\ninteg_params : keyword arguments to pass to the integrator. If :cubature,      these are kwargs for hcubature. If :vegas or :vegasmc, these are     kwargs for MCIntegration's integrate method.\n\n\n\n\n\n","category":"function"},{"location":"ref/reference/#VectorSpaceDarkMatter.ProjectedF","page":"Reference","title":"VectorSpaceDarkMatter.ProjectedF","text":"ProjectedF{A, B}(fnlm::Matrix{A}, radial_basis::B)\n\nStores the langle f  n ell m rangle coefficients and the radial basis that was used to calculate them. It is assumed that spherical harmonics were  used for the angular parts. A is the element type of the matrix that stores  fnlm coefficients (should be either Float64 or Measurement). B is the  type of radial basis. lm stores a vector of (ell,m) for the fnlm matrix: fnlm is indexed as [n+1,i] corresponding to (ell,m) = lm[i]\n\n\n\n\n\n","category":"type"},{"location":"ref/reference/#VectorSpaceDarkMatter.FCoeffs","page":"Reference","title":"VectorSpaceDarkMatter.FCoeffs","text":"FCoeffs{A, B}(fnlm::Dict{Tuple{Int64,Int64,Int64}, A},\n    radial_basis::B)\n\nStores the langle f  n ell m rangle coefficients as a dictionary with (n,ell,m) => f_nlm and the radial basis that was used to calculate them. It is assumed that spherical harmonics were used for the angular parts. A is  the element type of the dict that stores fnlm coefficients (should  be either Float64 or Measurement). B is the type of radial basis.\n\n\n\n\n\n","category":"type"},{"location":"ref/reference/#VectorSpaceDarkMatter.update!","page":"Reference","title":"VectorSpaceDarkMatter.update!","text":"update!(fc::FCoeffs, f, nlm::Tuple{Int,Int,Int}; kwargs...)\n\nEvaluates a particular (nellm) coefficient for the function f and the  radial basis fc.radial_basis and stores the result in fc.fnlm[(n,ell,m)].  Will overwrite existing data. kwargs correspond to the kwargs for getFnlm\n\n\n\n\n\nIf called with a vector of nlm tuples, runs update! for each (n,ell,m)\n\n\n\n\n\n","category":"function"},{"location":"ref/reference/#VectorSpaceDarkMatter.writeFnlm","page":"Reference","title":"VectorSpaceDarkMatter.writeFnlm","text":"writeFnlm(outfile, pf)\n\nWrites the coefficients from pf (either a ProjectedF or an FCoeffs) to file outfile.\n\n\n\n\n\n","category":"function"},{"location":"ref/reference/#VectorSpaceDarkMatter.readFnlm","page":"Reference","title":"VectorSpaceDarkMatter.readFnlm","text":"readFnlm(infile[, radial_basis::RadialBasis]; dict=false, use_err=true)\n\nReads coefficients from infile. Can optionally manually define the basis via radial_basis argument. Optional arguments:\n\ndict : If true, will return an FCoeffs. If false, returns ProjectedF.\n\nuse_err : Whether or not to load the uncertainties on the fnlm values.\n\n\n\n\n\n","category":"function"},{"location":"ref/reference/#VectorSpaceDarkMatter.rate","page":"Reference","title":"VectorSpaceDarkMatter.rate","text":"rate(R, model::ModelDMSM, pfv::ProjectedF, pfq::ProjectedF; \n    ell_max=nothing, use_measurements=false)\n\nCalculates the rate for a given model, projected g_chi (pfv), projected  f_s^2 (pfq), and rotation R given as a quaternion or rotor (if you want  other rotations, see Quaternionic.jl's conversion methods). R can also be a vector of quaternions or rotors.\n\nThe maximum ell that is used is the minimum of the specified ell_max and the maximum ell for each of pfv and pfq.\n\nUsing measurements here is currently slow.\n\n\n\n\n\n","category":"function"},{"location":"ref/reference/#VectorSpaceDarkMatter.ModelDMSM","page":"Reference","title":"VectorSpaceDarkMatter.ModelDMSM","text":"ModelDMSM(fdm_n, mX, mSM, deltaE)\n\nStores the relevant model parameters.\n\nfdm_n : The power of the dark matter form factor (alpha m_e  q)^textttfdm_n\n\nmX : dark matter mass in eV\n\nmSM : mass of target particle in eV\n\ndeltaE : discrete final state energy in eV\n\n\n\n\n\n","category":"type"},{"location":"#VectorSpaceDarkMatter.jl","page":"Home","title":"VectorSpaceDarkMatter.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Vector Spaces for Dark Matter. This is the Julia implementation  of the wavelet-harmonic integration method, designed for the efficient calculation of dark matter direct detection scattering rates in anisotropic detectors, and for arbitrary dark matter velocity distributions. See the associated papers [arXiv:2310.01483] and [arXiv:2310.01480] for an in-depth discussion of the methods used in this package.","category":"page"},{"location":"","page":"Home","title":"Home","text":"See the example notebook for a walkthrough using this package on some simple functions.","category":"page"},{"location":"#Direct-Detection-Rates","page":"Home","title":"Direct Detection Rates","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"For discrete final state energies Delta E the dark matter (DM) – standard model (SM) scattering rate R is given by","category":"page"},{"location":"","page":"Home","title":"Home","text":"R = N_T fracrho_chim_chi int d^3 q  d^3 v  g_chi(textbfv)  f_s^2(textbfq)  deltaleft( Delta E + fracq^22 m_chi - textbfq cdot textbfv right) fracbarsigma_0 F_textrmDM^2(textbfq)4 pi mu_chi^2","category":"page"},{"location":"","page":"Home","title":"Home","text":"Our package factorizes this calculation by projecting g_chi(textbfv) and f_s^2(textbfq) onto vector spaces such that","category":"page"},{"location":"","page":"Home","title":"Home","text":"f(textbfu) equiv frangle = sum_n ell m langle phi_n ell m  f rangle  phi_n ell m rangle","category":"page"},{"location":"","page":"Home","title":"Home","text":"where the basis function phi_n ell m is given by","category":"page"},{"location":"","page":"Home","title":"Home","text":"phi_n ell m(textbfu) = r_n(u) Y_ell m(hatu)","category":"page"},{"location":"","page":"Home","title":"Home","text":"with r_n(u) either a spherical tophat function or a spherical Haar wavelet and Y_ell m(hatu) the real spherical harmonics. We define the coefficients by","category":"page"},{"location":"","page":"Home","title":"Home","text":"langle phi_n ell m  f rangle equiv f_n ell m = int fracd^3 uu_textrmmax^3  f(textbfu)  r_n(u)  Y_ell m(hatu)","category":"page"},{"location":"","page":"Home","title":"Home","text":"where u_textrmmax is the maximum value of textbfu supported by the radial basis functions. The rate can then be calculated by","category":"page"},{"location":"","page":"Home","title":"Home","text":"R = frack_0T_textrmexp sum_ell=0^infty sum_mm=-ell^ell sum_nn=0^infty langle v_textrmmax^3 g_chi  n ell m rangle mathcalI_nn^ell langle n ell m  f_s^2 rangle","category":"page"},{"location":"","page":"Home","title":"Home","text":"where k_0 is a collection of constants, T_textrmexp is the exposure time, and mathcalI is referred to as the kinematic scattering matrix,","category":"page"},{"location":"","page":"Home","title":"Home","text":"mathcalI_nn^ell = fracq_textrmmax^3  v_textrmmax^32 m_chi mu_chi^2 int_0^infty fracq dqq_textrmmax^2 r^(q)_n(q) F_textrmDM^2(q) int_v_textrmmin(q)^infty fracv dvv_textrmmax^2 P_ell left( fracv_textrmmin(q)v right) r^(v)_n(v)","category":"page"},{"location":"","page":"Home","title":"Home","text":"and is analytically calculable for the tophat and Haar wavelet bases. Finally, we can also implement rotations of the detector (given generically by mathcalR),","category":"page"},{"location":"","page":"Home","title":"Home","text":"R = frack_0T_textrmexp sum_ell=0^infty sum_mm=-ell^ell sum_nn=0^infty langle v_textrmmax^3 g_chi  n ell m rangle mathcalI_nn^ell G^ell_mm(mathcalR) langle n ell m  f_s^2 rangle","category":"page"},{"location":"","page":"Home","title":"Home","text":"where G is analogous to the Wigner D-matrix, but for real spherical harmonics","category":"page"},{"location":"","page":"Home","title":"Home","text":"G_mm^ell(mathcalR) equiv langle ell m  mathcalR  ell m rangle","category":"page"},{"location":"#Projecting-g_\\chi-and-f_s2","page":"Home","title":"Projecting g_chi and f_s^2","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The first step in using this package to do a calculation is to project your velocity distribution g_chi(textbfv) and momentum form factor f_s^2(textbfq) onto the vector space. First, decide your maximum v and q values. Make sure your v and q are in natural units. Then we can use the function ProjectF","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = VectorSpaceDarkMatter\nusing Quaternionic","category":"page"},{"location":"","page":"Home","title":"Home","text":"gx_nlm = ProjectF(gx, (n_max, ell_max), Wavelet(vmax))\nfs2_nlm = ProjectF(fs2, (n_max, ell_max), Wavelet(qmax))","category":"page"},{"location":"","page":"Home","title":"Home","text":"This will store your coefficients in a ProjectedF object, which has fields fnlm which stores the coefficient values, lm which stores the (ellm) pairs for each column of fnlm, and radial_basis which stores the radial basis and with it, the maximum v or q value. You can save the coefficients with writeFnlm","category":"page"},{"location":"","page":"Home","title":"Home","text":"writeFnlm(\"filename.csv\", projected_f)","category":"page"},{"location":"","page":"Home","title":"Home","text":"If you already have stored coefficients, you can load them with","category":"page"},{"location":"","page":"Home","title":"Home","text":"readFnlm(\"filename.csv\")","category":"page"},{"location":"","page":"Home","title":"Home","text":"or","category":"page"},{"location":"","page":"Home","title":"Home","text":"readFnlm(\"filename.csv\", Wavelet(umax))","category":"page"},{"location":"","page":"Home","title":"Home","text":"if you want to define the radial basis by hand. This is helpful because it can often take a while to calculate these coefficients, particularly for large n_max and ell_max.","category":"page"},{"location":"#Calculating-the-Rate","page":"Home","title":"Calculating the Rate","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"To deal with rotations, we'll want to import the Quaternionic.jl package","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Quaternionic","category":"page"},{"location":"","page":"Home","title":"Home","text":"you can see their documentation to see how to convert from other rotation types to quaternions. We can define a quaternion by","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Quaternionic","category":"page"},{"location":"","page":"Home","title":"Home","text":"q = quaternion(1.0, 2.0, 3.0, 4.0)","category":"page"},{"location":"","page":"Home","title":"Home","text":"We also need to define the model, including the dark matter mass m_chi, the dark matter form factor F_textrmDM, and the transition energy Delta E. To compactly store these values, we use a ModelDMSM object","category":"page"},{"location":"","page":"Home","title":"Home","text":"dmsm_model = ModelDMSM(fdm_n, mX, mSM, deltaE)","category":"page"},{"location":"","page":"Home","title":"Home","text":"Once you have a quaternion or rotor defining your desired rotation and have defined your model you can easily calculate the rate by","category":"page"},{"location":"","page":"Home","title":"Home","text":"R = rate(q, dmsm_model, gx_nlm, fs2_nlm)","category":"page"},{"location":"","page":"Home","title":"Home","text":"It's very quick to implement more rotations, so you can also pass a vector of quaternions (or rotors) to rate","category":"page"},{"location":"","page":"Home","title":"Home","text":"R = rate(Q, dmsm_model, gx_nlm, fs2_nlm)","category":"page"}]
}
