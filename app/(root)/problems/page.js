'use client'
import ProblemsTable from '@/components/ui/ProblemsTable';
import {useEffect, useState} from 'react' 

const ProblemsPage = () => {
    const [dbUser, setDbUser] = useState(null);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);   
    useEffect(() => {
        async function fetchUser() {
          try {
            const res = await fetch("/api/users/me");
            if (res.ok) {
              const result = await res.json();
              setDbUser(result.user);
            }
          } catch (e) {
            setDbUser(null);
            setError(e);
          }
        }
        fetchUser();
      }, []);
      useEffect(() => {
        async function fetchProblems() {
          try {
            const res = await fetch("/api/get-problem");
            if (res.ok) {
                const result = await res.json();
                setProblems(result.data);
            }
          } catch (e) {
            setProblems([]);
            setError(e.errors);
          }
        }
        fetchProblems();
      },[])
      if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error loading problems: {error}</p>
      </div>
    );
  }


  return (
    <div className='container mx-auto py-32'>
        <ProblemsTable problems={problems} user={dbUser}/>
    </div>
  )
}

export default ProblemsPage