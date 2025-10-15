import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hook/hook";
import { loginUser, selectAuth } from "../../store/slices/UserAuthSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BlobButton } from "../../components/common/Button";


function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useAppSelector(selectAuth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const { user } = useAppSelector((state) => state.auth);

    const from = location.state?.from || "/";
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsFormValid(emailRegex.test(email) && password.trim().length >= 1);
    }, [email, password]);
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true }); 
        }
    }, [user, navigate, from]);


    const validateForm = () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!password.trim()) {
            toast.error("Password is required");
            return false;
        }
        return true;
    };



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            await dispatch(loginUser({ email, password })).unwrap();
            navigate("/");
        } catch (err: any) {
            if (error?.message === "Invalid email or password") {
                navigate('/signup')
                toast.warning("Account Don't Exist!")
            }
            else toast.error(err?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">

            <div className="w-full max-w-md mx-auto lg:max-w-lg">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10">
                    <div className="text-center space-y-2 mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-600">Log In to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">


                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                placeholder="you@example.com"
                            />
                        </div>


                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                Forgot password?
                            </Link>
                        </div>


                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-red-700">{error.message}</span>
                                </div>
                            </div>
                        )}


                        <BlobButton
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={`w-full py-3 px-4 font-semibold transition-all duration-200 ${loading || !isFormValid
                                ? "bg-slate-300 cursor-not-allowed text-black"
                                : "bg-blue-500 hover:bg-blue-600 "
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M4 12H0" />
                                    </svg>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </BlobButton>


                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/80 text-slate-500">or continue with</span>
                            </div>
                        </div>

                    </form>


                    <div className="mt-8 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>


                <div className="lg:hidden mt-6 space-y-4">
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-700">Secure & trusted login</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
