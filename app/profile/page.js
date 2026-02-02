'use client'
import { SubmissionHistory } from '@/components/ui/submission-history';
import PlaylistsSection from '@/components/ui/playlist-section';
import ProfileStats from '@/components/ui/profile-stats';
import SolvedProblems from '@/components/ui/solved-problems';
import UserInfoCard from '@/components/ui/user-info';
import { useRouter } from 'next/navigation';
import { useState , useEffect} from 'react';

export const dynamic = 'force-dynamic';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    async function getCurrentUserData() {
      try {
        const res = await fetch(`/api/users/me`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store', // ensure always fresh on server components
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) {
          router.push('/');
          return;
        }
        const data = await res.json();
        setProfileData(data.user)
      } catch (e) {
        console.log(e)
        return null;
      }
    }
    getCurrentUserData();
    }, []);

    if (!profileData) {
      return null; // or a loader
    }
    

  return (
    <div className='h-full py-32'>
        <div className='container mx-auto px-4 max-w-7xl'>
            <UserInfoCard userData={profileData}/>
            <ProfileStats
                submissions={profileData.submissions}
                solvedCount={profileData.solvedProblems.length}
                playlistCount={profileData.playlists.length}
            />

            <SubmissionHistory submissions={profileData.submissions} />

            <div className='grid gap-8 mt-10'>
                  <SolvedProblems solvedProblems={profileData.solvedProblems} />
          <PlaylistsSection playlists={profileData.playlists} />
            </div>
        </div>
    </div>
  )
}

export default ProfilePage