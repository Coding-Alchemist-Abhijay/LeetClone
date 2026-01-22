'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const leetcodeFontStack = "'Lato', 'PingFang SC', 'Microsoft YaHei', 'Arial', 'sans-serif'";

function renderErrors(error) {
  if (!error) return null;
  if (typeof error === 'string') {
    return <>{error}</>;
  }
  if (Array.isArray(error)) {
    return (
      <ul className="list-disc ml-4">
        {error.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    );
  }
  if (typeof error === 'object') {
    // single field or possibly combined errors object
    return (
      <ul className="list-disc ml-4">
        {Object.values(error).map((err, idx) =>
          Array.isArray(err) ? (
            err.map((sub, j) => <li key={idx + '-' + j}>{sub}</li>)
          ) : (
            <li key={idx}>{err}</li>
          )
        )}
      </ul>
    );
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: form.username,
          password: form.password,
          remember: form.remember,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.replace('/');
        setLoading(false);
      } else {
        if (data?.errors) {
          setError(data.errors);
        } else if (data?.message) {
          setError(data.message);
        } else if (data?.error) {
          setError(data.error);
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
        setLoading(false);
      }
    } catch (err) {
      setError('Unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-[#f5f6fa] min-h-screen flex flex-col items-center justify-center"
      style={{ fontFamily: leetcodeFontStack }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
      />
      <div
        className="w-full max-w-sm rounded-[10px] bg-white shadow-[0_2px_12px_rgba(76,85,99,0.15)] px-8 py-8"
        style={{
          fontFamily: leetcodeFontStack,
        }}
      >
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="LeetCode"
            width={50}
            height={50}
            className="mb-4"
            draggable="false"
            onError={(e) => {
              console.error('Failed to load logo:', e.target.src);
            }}
          />
          <div
            className="mb-3 text-[24px] font-bold text-[#262626]"
            style={{
              fontFamily: leetcodeFontStack,
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            Sign In
          </div>
          <div
            className="text-xs text-[#828282] mb-6"
            style={{
              fontFamily: leetcodeFontStack,
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            to continue to LeetClone
          </div>
          <button
            className="flex items-center w-full border border-[#d5d8df] rounded px-3 py-2 mb-2 bg-white hover:bg-[#f5f6fa] transition-colors"
            type="button"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            <svg width="20" height="20" fill="none" className="mr-2">
              <g>
                <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.16-2H10v3.79h5.44c-.23 1.24-.95 2.29-2.04 3l-.02.16 2.97 2.3.21.02c1.92-1.77 3.02-4.38 3.02-7.27"></path>
                <path fill="#34A853" d="M10 20c2.7 0 4.97-.9 6.62-2.45l-3.16-2.44c-.88.59-2.01.94-3.46.94-2.66 0-4.91-1.8-5.72-4.21l-.16.01-3.09 2.41-.04.15C2.81 17.73 6.13 20 10 20"></path>
                <path fill="#FBBC05" d="M4.28 12.84A5.997 5.997 0 0 1 4 10c0-.98.23-1.91.64-2.84v-.18l-3.13-2.44-.1.15A9.982 9.982 0 0 0 0 10c0 1.64.39 3.19 1.08 4.55l3.2-1.71"></path>
                <path fill="#EA4335" d="M10 4.06c1.85 0 3.11.8 3.82 1.48l2.8-2.73C14.95 1.21 12.68 0 10 0 6.13 0 2.81 2.27 1.08 5.45l3.2 2.7C5.09 6.89 7.34 5.09 10 5.09"></path>
              </g>
            </svg>
            
            <a href="/google" className="flex-grow text-center text-[14px] font-medium text-[#4b587c] tracking-tight" style={{ fontFamily: leetcodeFontStack }}>
              Sign in with Google
            </a>
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
            <a href="/github" className="flex-grow text-center text-[14px] font-medium text-[#4b587c] tracking-tight" style={{ fontFamily: leetcodeFontStack }}>
              Sign in with GitHub
            </a>
          </button>
          <div className="flex items-center w-full mb-4">
            <div className="flex-grow border-t border-[#edf0f5]" />
            <span className="mx-3 text-[#838181] text-xs" style={{ fontFamily: leetcodeFontStack }}>OR</span>
            <div className="flex-grow border-t border-[#edf0f5]" />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: leetcodeFontStack }}>
          <div>
            <label htmlFor="username" className="block text-xs text-[#1A1A1A] mb-1 font-bold" style={{ fontFamily: leetcodeFontStack }}>
              Username or Email
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
            <label htmlFor="password" className="block text-xs text-[#1A1A1A] mb-1 font-bold" style={{ fontFamily: leetcodeFontStack }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full bg-[#fafbfc] border border-[#d9d9e3] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FFA116] transition"
              style={{
                fontFamily: leetcodeFontStack,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs" style={{ fontFamily: leetcodeFontStack }}>
            <label className="flex items-center" style={{ fontFamily: leetcodeFontStack }}>
              <input
                type="checkbox"
                className="accent-[#ffa116] mr-2"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a
              href="/login/forgot-password"
              className="text-[#626ee3] hover:underline"
              tabIndex={-1}
              style={{ fontFamily: leetcodeFontStack, fontWeight: 400 }}
            >
              Forgot Password?
            </a>
          </div>
          {error && (
            <div className="text-red-600 text-xs text-center" style={{ fontFamily: leetcodeFontStack }}>
              {renderErrors(error)}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFA116] hover:bg-[#ffb94f] text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div
          className="text-xs text-[#454545] text-center mt-6"
          style={{ fontFamily: leetcodeFontStack, fontWeight: 400 }}
        >
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-[#626ee3] hover:underline font-medium"
            style={{ fontFamily: leetcodeFontStack, fontWeight: 700 }}
          >
            Sign up
          </a>
        </div>
      </div>
      <div className="text-[11px] text-gray-400 mt-6 font-mono" style={{ fontFamily: leetcodeFontStack, fontWeight: 400 }}>
        &copy; {new Date().getFullYear()} LeetClone. All rights reserved.
      </div>
    </div>
  );
}

