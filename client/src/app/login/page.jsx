"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from "next/navigation"

const Page = () => {
    const { login, signup, loading, authLoading, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (authLoading) return
        if (user) router.replace("/")
    }, [user, authLoading])

    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ userName: "", email: "", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        let res
        if (isLogin) {
            res = await login({ email: formData.email, password: formData.password })
        } else {
            res = await signup(formData)
        }
        if (res.success) {
            toast.success(res.message)
            router.push("/")
        } else {
            toast.error(res.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 font-poppins">

            <div className="relative w-full max-w-sm">


                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-zinc-900/60 px-8 py-10">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isLogin ? (
                                <>Welcome <span className="text-purple-600 dark:text-purple-400">back</span></>
                            ) : (
                                <>Create <span className="text-purple-600 dark:text-purple-400">account</span></>
                            )}
                        </h2>
                        <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1.5">
                            {isLogin ? 'Sign in to continue to your account' : 'Join LamaEstate today'}
                        </p>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-zinc-800 mb-8" />

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 dark:focus:border-purple-500 transition-all text-sm"
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 dark:focus:border-purple-500 transition-all text-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 py-3 px-4 pr-11 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 dark:focus:border-purple-500 transition-all text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
                        <p className="text-sm text-gray-400 dark:text-zinc-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-colors cursor-pointer"
                            >
                                {isLogin ? 'Create one' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>

                
            </div>
        </div>
    )
}

export default Page