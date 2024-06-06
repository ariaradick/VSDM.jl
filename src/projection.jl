using DelimitedFiles

"""
    ProjectedF{A, B}(fnlm::Matrix{A}, radial_basis::B)

Stores the <f | nlm> coefficients and the radial basis that was used to
calculate them. It is assumed that spherical harmonics were used for the
angular parts. `A` is the element type of the matrix that stores `fnlm`
coefficients (should be either `Float64` or `Measurement`). `B` is the type 
of radial basis. `lm` stores a vector of `(l,m)` for the `fnlm` matrix:
`fnlm` is indexed as `[n+1,i]` corresponding to `(l,m) = lm[i]`
"""
struct ProjectedF{A, B<:RadialBasis}
    fnlm::Matrix{A}
    lm::Vector{Tuple{Int64,Int64}}
    radial_basis::B
end

"""
    FCoeffs{A, B}(fnlm::Dict{Tuple{Int64,Int64,Int64}, A},
        radial_basis::B)

Stores the <f | nlm> coefficients as a dictionary with (n,l,m) => f_nlm
and the radial basis that was used to calculate them. It is assumed
that spherical harmonics were used for the angular parts. `A` is 
the element type of the dict that stores `fnlm` coefficients (should 
be either `Float64` or `Measurement`). `B` is the type of radial basis.
"""
struct FCoeffs{A, B<:RadialBasis}
    fnlm::Dict{Tuple{Int64,Int64,Int64}, A}
    radial_basis::B
end

function ProjectedF(fcoeffs::FCoeffs)
    n_max = maximum([k[1] for k in keys(fcoeffs.fnlm)])
    lm_vals = unique([(k[2], k[3]) for k in keys(fcoeffs.fnlm)])
    N_lm = length(lm_vals)

    res = zeros(valtype(fcoeffs.fnlm), (n_max+1, N_lm))

    for (k,v) in fcoeffs.fnlm
        n,l,m = k
        lm_idx = findall(x->x==(l,m), lm_vals)[1]
        res[n+1, lm_idx] = v
    end

    return ProjectedF(res, lm_vals, fcoeffs.radial_basis)
end

function FCoeffs(pf::ProjectedF)
    n_vals = 0:(length(pf.fnlm[:,1])-1)
    nlm = [(n,lm...) for lm in pf.lm for n in n_vals]

    res = Dict( nlm[i] => pf.fnlm[i] for i in eachindex(nlm) )
    return FCoeffs(res, pf.radial_basis)
end

"""
    ProjectedF(f, nl_max, radial_basis::RadialBasis; 
                    use_measurements=false, rtol=1e-6)

Evaluates <f | nlm> at each (n,l,m) up to nl_max = (n_max, l_max) and returns
the result as a `ProjectedF`.

`f` : Can be a `Function`, `f_uSph`, `GaussianF`, or `Vector{GaussianF}`. 
      `f_uSph` is preferred if your function has any symmetries, and is not 
      gaussian, as specifying those will greatly speed up evaluation.

`radial_basis` : Either a `Wavelet` or `Tophat`

`use_measurements` : If `true`, will give the results as a measurement with
    uncertainty given by the integration error.

`integ_method` : Either `:cubature`, `:vegas`, or `:vegasmc`

`integ_params` : keyword arguments to pass to the integrator. If `:cubature`, 
    these are kwargs for `hcubature`. If `:vegas` or `:vegasmc`, these are
    kwargs for `MCIntegration`'s `integrate` method.
"""
function ProjectedF(f, nl_max, radial_basis::RadialBasis; 
                    use_measurements=false, integ_method=:cubature,
                    integ_params=(;))
    fuSph = f_uSph(f)
    ProjectedF(fuSph, nl_max, radial_basis; use_measurements=use_measurements,
    integ_method=integ_method, integ_params=integ_params)
end

function ProjectedF(f::f_uSph, nl_max, radial_basis::RadialBasis; 
    use_measurements=false, integ_method=:cubature, integ_params=(;))

    n_max, l_max = nl_max
    n_vals = 0:n_max
    lm_vals = LM_vals(f, l_max)
    N_lm = length(lm_vals)

    res = zeros(Measurement, (n_max+1, N_lm))

    for i in 1:N_lm
        ell, m = lm_vals[i]
        for n in n_vals
            res[n+1, i] = getFnlm(f, (n, ell, m), radial_basis;
                            integ_method=integ_method,
                            integ_params=integ_params)
        end
    end    
    if use_measurements
        return ProjectedF(res, lm_vals, radial_basis)
    else
        return ProjectedF(Measurements.value.(res), lm_vals, radial_basis)
    end
end

function ProjectedF(g::GaussianF, nl_max, radial_basis::RadialBasis;
                    use_measurements=false, integ_params=(;))

    u_i, θ_i, φ_i = g.uSph
    n_max, l_max = nl_max
    lm_vals = LM_vals(l_max)
    N_lm = length(lm_vals)

    gnl = zeros(Measurement, (n_max+1, l_max+1))
    res = zeros(Measurement, (n_max+1, N_lm))

    for ell in 0:l_max
        for n in 0:n_max
            gnl[n+1, ell+1] = getGnl(g, n, ell, radial_basis, 
                              integ_params=integ_params)
        end
    end

    for i in 1:N_lm
        ell, m = lm_vals[i]
        for n in 0:n_max
            res[n+1,i] = g.c * ylm_real(ell, m, θ_i, φ_i) * gnl[n+1,ell+1] /
                        radial_basis.umax^3
        end
    end

    if use_measurements
        return ProjectedF(res, lm_vals, radial_basis)
    else
        return ProjectedF(Measurements.value.(res), lm_vals, radial_basis)
    end
end

function ProjectedF(g::Vector{GaussianF}, nl_max, radial_basis::RadialBasis;
                    use_measurements=false, integ_params=(;))
    pf = Vector{ProjectedF}()
    lm_vals = LM_vals(nl_max[2])

    for gg in g
        push!(pf, ProjectedF(gg, nl_max, radial_basis; 
              use_measurements=use_measurements, integ_params=integ_params))
    end

    if use_measurements
        fnlm_vals = sum([Measurements.value.(p.fnlm) for p in pf])
        fnlm_errs = sqrt.(sum([Measurements.uncertainty.(p.fnlm).^2 for p in pf]))
        fnlm = (fnlm_vals .± fnlm_errs)
        return ProjectedF(fnlm, lm_vals, radial_basis)

    else
        fnlm = sum([p.fnlm for p in pf])
        return ProjectedF(fnlm, lm_vals, radial_basis)
    end
end

"Evaluates the function f(uvec) by using fnlm coefficients and basis functions."
function (pf::ProjectedF{Float64,T})(uvec) where T<:RadialBasis
    u, θ, φ = uvec
    x = u/pf.radial_basis.umax
    n_vals = 0:(length(pf.fnlm[:,1])-1)
    N_lm = length(pf.lm)

    rad = radRn.(n_vals, 0, x, (pf.radial_basis,))

    basis_vals = zeros(Float64, size(pf.fnlm))
    for i in 1:N_lm
        ell, m = pf.lm[i]
        y = ylm_real(ell, m, θ, φ)
        for n in n_vals
            basis_vals[n+1, i] = rad[n+1]*y
        end
    end

    return sum(basis_vals .* pf.fnlm)
end

function (pf::ProjectedF{A,B})(uvec) where {A<:Measurement, B<:RadialBasis}
    u, θ, φ = uvec
    x = u/pf.radial_basis.umax

    n_vals = 0:(length(pf.fnlm[:,1])-1)
    N_lm = length(pf.lm)

    basis_vals = zeros(Float64, size(pf.fnlm))
    for i in 1:N_lm
        ell, m = pf.lm[i]
        y = ylm_real(ell, m, θ, φ)
        for n in n_vals
            rad = radRn(n, ell, x, pf.radial_basis)
            basis_vals[n+1, i] = rad*y
        end
    end

    res = sum(basis_vals .* Measurements.value.(pf.fnlm))
    err = sqrt(sum( (basis_vals .* Measurements.uncertainty.(pf.fnlm)).^2 ))

    return (res ± err)
end

"Integral of (d^3 u) f^2(u) over the range a = [u_min, theta_min, phi_min]
to b = [u_max, theta_max, phi_max]."
function norm_energy(f::Function, a, b)
    return NIntegrate(x -> dV_sph(x)*f(x)^2, a, b, :cubature)
end

"Integral of (d^3 u) f^(u) for a ProjectedF is equal to 
sum_{nlm} f_{nlm}^2 * umax^3"
function norm_energy(pf::ProjectedF{Float64,T}) where T<:RadialBasis
    sum(pf.fnlm .^ 2) * pf.radial_basis.umax^3
end

"If called with a ProjectedF{Measurement,B} will properly account for the
integration uncertainties."
function norm_energy(pf::ProjectedF{A,B}) where {A<:Measurement, B<:RadialBasis}
    vals = Measurements.value.(pf.fnlm)
    errs = Measurements.uncertainty.(pf.fnlm)

    res = sum(vals .^ 2)
    err_arr = @. abs(2*vals*errs)
    res_err = sqrt(sum(err_arr.^2))

    return (res ± res_err) * pf.radial_basis.umax^3
end

function writeFnlm(outfile, pf::ProjectedF)
    n_vals = 0:(length(pf.fnlm[:,1])-1)
    nlm = [(n,lm...) for lm in pf.lm for n in n_vals]

    rb_type = typeof(pf.radial_basis)
    rb_max = pf.radial_basis.umax

    nmax = Int(maximum(n_vals))
    lmax = Int(maximum([lm[1] for lm in pf.lm]))

    open(outfile, "w") do io
        write(io, "# type = $rb_type, umax = $rb_max, n_max = $nmax, l_max = $lmax\n")
        if eltype(pf.fnlm) == Float64
            res = hcat([[nlm[i]..., pf.fnlm[i]] for i in eachindex(nlm)]...)'
            write(io, "# n, l, m, f\n")
            writedlm(io, res, ',')
        elseif eltype(pf.fnlm) <: Measurement
            res = hcat([[nlm[i]..., pf.fnlm[i].val, pf.fnlm[i].err] for i in eachindex(nlm)]...)'
            write(io, "# n, l, m, f.val, f.err\n")
            writedlm(io, res, ',')
        end
    end

    return
end

function _readFnlm(infile)
    readdlm(infile, ','; comments=true)
end