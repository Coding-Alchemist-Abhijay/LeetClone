'use client';

import React, { useState } from 'react';

const leetcodeFontStack = "'Lato', 'PingFang SC', 'Microsoft YaHei', 'Arial', 'sans-serif'";

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Dummy signup logic
    setTimeout(() => {
      setLoading(false);
      if (!form.username || !form.email || !form.password) {
        setError('Please fill in all fields.');
      } else if (!form.email.includes('@')) {
        setError('Please enter a valid email address.');
      } else if (form.password.length < 6) {
        setError('Password should be at least 6 characters.');
      } else {
        setSuccess(true);
        setForm({ username: '', email: '', password: '' });
      }
    }, 1100);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ fontFamily: leetcodeFontStack, background: "#fff8f3" }}
    >
      <div className="w-full flex-1" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
      />
      <div
        className="w-full max-w-sm rounded-[10px] bg-white shadow-[0_2px_12px_rgba(76,85,99,0.15)] px-8 py-8 mt-12"
        style={{
          fontFamily: leetcodeFontStack,
        }}
      >
        <div className="flex flex-col items-center">
          <img
            src="https://leetcode.com/static/images/LeetCode_logo.png"
            alt="LeetCode"
            className="w-16 h-16 mb-2"
            draggable={false}
          />
          <h1 className="text-xl font-bold mb-2 tracking-tight" style={{ fontFamily: leetcodeFontStack }}>Sign Up</h1>
          <p className="text-xs text-[#4b587c] mb-4" style={{ fontFamily: leetcodeFontStack, fontWeight: 400 }}>
            Create your LeetClone account
          </p>
        </div>

        <div className="mb-4">
          <button
            className="flex items-center w-full border border-[#d5d8df] rounded px-3 py-2 mb-3 bg-white hover:bg-[#f5f6fa] transition-colors"
            type="button"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" className="mr-2">
              <g>
                <path fill="#4285F4" d="M19.6 10.23c0-.7-.06-1.4-.18-2.06H10v3.91h5.48a4.68 4.68 0 0 1-2.03 3.06v2.55h3.28c1.92-1.77 3.03-4.38 3.03-7.46z"></path>
                <path fill="#34A853" d="M10 20c2.7 0 4.97-.9 6.62-2.45l-3.16-2.44c-.88.59-2.01.94-3.46.94-2.66 0-4.91-1.8-5.72-4.21l-.16.01-3.09 2.41-.04.15C2.81 17.73 6.13 20 10 20"></path>
                <path fill="#FBBC05" d="M4.28 12.84A5.997 5.997 0 0 1 4 10c0-.98.23-1.91.64-2.84v-.18l-3.13-2.44-.1.15A9.982 9.982 0 0 0 0 10c0 1.64.39 3.19 1.08 4.55l3.2-1.71"></path>
                <path fill="#EA4335" d="M10 4.06c1.85 0 3.11.8 3.82 1.48l2.8-2.73C14.95 1.21 12.68 0 10 0 6.13 0 2.81 2.27 1.08 5.45l3.2 2.7C5.09 6.89 7.34 5.09 10 5.09"></path>
              </g>
            </svg>
            <span className="flex-grow text-center text-[14px] font-medium text-[#4b587c] tracking-tight"
              style={{ fontFamily: leetcodeFontStack }}>Sign up with Google</span>
          </button>
          <button
            className="flex items-center w-full border border-[#d5d8df] rounded px-3 py-2 mb-3 bg-white hover:bg-[#f5f6fa] transition-colors"
            type="button"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            <svg height="20" width="20" fill="none" viewBox="0 0 20 20" className="mr-2">
              <circle cx="10" cy="10" r="10" fill="#181717" />
              <path
                d="M15.052 7.207a2.962 2.962 0 0 0-.274-2.162c-.085-.173-.309-.18-.324-.18-.137-.013-.54.021-.993.383a4.23 4.23 0 0 0-.54.493 7.374 7.374 0 0 0-.724 1.112 7.293 7.293 0 0 0-.6 1.18c-.176.41-.354.82-.527 1.231-.08.189-.207.263-.337.3-.1.029-.196.022-.343-.055a5.536 5.536 0 0 1-1.075-.661c-.399-.291-.786-.59-1.175-.895-.416-.326-.826-.66-1.233-1.004-.193-.168-.203-.315-.18-.448.018-.095.056-.187.154-.286.1-.101.162-.155.249-.247.095-.102.188-.211.278-.327a.193.193 0 0 0 .036-.116c-.003-.036-.182-.327-.51-.291l-.035.005c-.11.012-.436.093-.615.261-.273.255-.516.743-.512 1.415.004.7.23 1.247.453 1.74.367.781.804 1.534 1.287 2.167.481.63 1.056 1.242 1.695 1.647.43.267.997.493 1.67.411.327-.038.608-.196.786-.276.225-.098.454-.247.591-.393a6.52 6.52 0 0 0 1.221-1.624 6.49 6.49 0 0 0 .831-2.037c.04-.153.11-.389.155-.612zm-3.057 8.174h.004c1.027 0 1.938-.393 2.59-1.061-.064-.118-.177-.174-.286-.174-.065 0-.13.011-.189.022-.059.011-.119.027-.178.029-.349.013-.724-.007-1.108-.232-.208-.126-.393-.297-.533-.505-.136-.202-.221-.442-.31-.688-.059-.165-.12-.334-.182-.508-.144-.399-.356-.541-.555-.656-.137-.078-.244-.08-.343-.078-.152.003-.35.056-.513.129-.113.048-.215.1-.329.163-.093.05-.186.097-.276.157-.221.152-.271.37-.136.594A5.487 5.487 0 0 0 8.978 16.03c.315.071.617.08.915.08z"
                fill="#fff"
              />
            </svg>
            <span className="flex-grow text-center text-[14px] font-medium text-[#4b587c] tracking-tight"
              style={{ fontFamily: leetcodeFontStack }}>
              Sign up with GitHub
            </span>
          </button>
          <div className="flex items-center w-full mb-4">
            <div className="flex-grow border-t border-[#edf0f5]" />
            <span className="mx-3 text-[#838181] text-xs" style={{ fontFamily: leetcodeFontStack }}>OR</span>
            <div className="flex-grow border-t border-[#edf0f5]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: leetcodeFontStack }}>
          <div>
            <label htmlFor="username" className="block text-xs text-[#1A1A1A] mb-1 font-bold"
              style={{ fontFamily: leetcodeFontStack }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
              className="w-full bg-[#fafbfc] border border-[#d9d9e3] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FFA116] transition"
              style={{
                fontFamily: leetcodeFontStack,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs text-[#1A1A1A] mb-1 font-bold"
              style={{ fontFamily: leetcodeFontStack }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full bg-[#fafbfc] border border-[#d9d9e3] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FFA116] transition"
              style={{
                fontFamily: leetcodeFontStack,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-[#1A1A1A] mb-1 font-bold"
              style={{ fontFamily: leetcodeFontStack }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full bg-[#fafbfc] border border-[#d9d9e3] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FFA116] transition"
              style={{
                fontFamily: leetcodeFontStack,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            />
          </div>
          {error && (
            <div className="text-red-600 text-xs text-center" style={{ fontFamily: leetcodeFontStack }}>{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-xs text-center" style={{ fontFamily: leetcodeFontStack }}>
              Signup successful! You can now log in.
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFA116] hover:bg-[#ffb94f] text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div
          className="text-xs text-[#454545] text-center mt-6"
          style={{ fontFamily: leetcodeFontStack, fontWeight: 400 }}
        >
          Already have an account?{' '}
          <a
            href="/login"
            className="text-[#626ee3] hover:underline font-medium"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            Sign in
          </a>
        </div>
      </div>
      <div className="text-[11px] text-gray-400 mt-6 font-mono" style={{ fontFamily: leetcodeFontStack, fontWeight: 400 }}>
        &copy; {new Date().getFullYear()} LeetClone. All rights reserved.
      </div>
      <div className="w-full flex-1" />
    </div>
  );
}


