"use client"
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const Navbar = ({ userRole }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileUrl, setProfileUrl] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const router = useRouter()
  const modalRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/status', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.loggedIn) {
            setIsLoggedIn(true);
            const profileRes = await fetch('/api/users/me', { credentials: 'include' });
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setProfileUrl(profileData.user.imageUrl);
            }
          } else {
            setIsLoggedIn(false);
            setProfileUrl(null);
          }
        } else {
          setIsLoggedIn(false);
          setProfileUrl(null);
        }
      } catch {
        setIsLoggedIn(false);
        setProfileUrl(null);
      }
    };
    checkAuth();
  }, []);

  // Close popover/modal when clicking outside or on Escape
  useEffect(() => {
    if (!showProfileModal) return;
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowProfileModal(false);
      }
    }
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowProfileModal(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    }
  }, [showProfileModal]);

  const handleLogin = () => {
    router.push('/login');
  }
  const handleSignUp = () => {
    router.push('/signup');
  }
  const handleProfile = () => {
    setShowProfileModal((s) => !s);
  }
  const handleManageAccount = () => {
    setShowProfileModal(false);
    router.push('/profile');
  }
  const handleLogout = async () => {
    setShowProfileModal(false);
    try {
      await fetch('/api/users/logout', { method: 'GET', credentials: 'include' });
    } catch (e) {}
    setIsLoggedIn(false);
    setProfileUrl(null);
    router.refresh?.();
    router.push('/');
  }

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/logo.svg"} alt="TreeBio" width={42} height={42} />
            <span className="font-bold text-2xl tracking-widest text-amber-300">
              LeetCode
            </span>
          </Link>

          <div className="flex flex-row items-center justify-center gap-x-4">
            <Link
              href="/problems"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400  hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              Problems
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400  hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              About
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400  hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              Profile
            </Link>
          </div>

          <div className="flex items-center gap-4 relative">
            <ModeToggle />
            {isLoggedIn ? (
              <>
                {userRole && userRole === "ADMIN" && (
                  <Link href={"/create-problem"}>
                    <Button variant={"outline"} size={"default"}>
                      Create Problem
                    </Button>
                  </Link>
                )}
                <button
                  onClick={handleProfile}
                  className="ml-2 rounded-full overflow-hidden border-2 border-amber-300 hover:border-amber-400 focus:outline-none transition-shadow shadow hover:shadow-lg w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 relative"
                  title="Profile"
                  tabIndex={0}
                >
                  {profileUrl ? (
                    <Image
                      src={profileUrl}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-amber-400 font-bold text-lg">👤</span>
                  )}
                </button>
                {/* Popover menu */}
                {showProfileModal && (
                  <div
                    ref={modalRef}
                    className="absolute right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-xl w-56 z-50 flex flex-col items-stretch animate-slidein"
                    style={{ top: "calc(100% + 0.5rem)" }}
                  >
                    <div className="flex flex-col items-center px-5 pt-5 pb-2">
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt="Profile"
                          width={46}
                          height={46}
                          className="mb-2 rounded-full border-2 border-amber-300 object-cover"
                        />
                      ) : (
                        <span className="text-amber-400 font-bold text-2xl mb-2">👤</span>
                      )}
                      <span className="font-semibold text-zinc-800 dark:text-white">Account</span>
                    </div>
                    <div className="flex flex-col px-3 pb-3 gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleManageAccount}
                      >
                        Manage Account
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
                <style jsx global>{`
                  @keyframes slidein {
                    0% {
                      opacity: 0;
                      transform: translateX(32px) translateY(10px) scale(0.95);
                    }
                    100% {
                      opacity: 1;
                      transform: translateX(0) translateY(0) scale(1);
                    }
                  }
                  .animate-slidein {
                    animation: slidein 0.16s cubic-bezier(0.46,0.03,0.52,0.96);
                  }
                `}</style>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm font-medium border-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800/60 text-amber-600"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="text-sm font-medium bg-amber-400 hover:bg-amber-500 text-white"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar