import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import CreateProblemForm from '@/components/ui/create-problem-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { currentUserRole } from '@/lib/helpers/currentUserRole';
import {redirect} from "next/navigation";

const CreateProblemPage = async() => {
    const role = await currentUserRole();
    if(!role) redirect("/login");
    if(role !== 'ADMIN') redirect("/"); 
    const res = await fetch('http://localhost:3000/api/users/me', {method : "GET" , cache: 'no-store' });
    const user = res.ok ? await res.json() : null;
  return (
    <section className='flex flex-col items-center justify-center  mx-4 my-4'>
        <div className='flex flex-row justify-between items-center w-full'>
            <Link href={"/"}>
            <Button variant={"outline"} size={"icon"}>
                <ArrowLeft className='size-4' />
            </Button>
            </Link>

             <h1 className='text-3xl font-bold text-amber-400'>Welcome {user?.name}! Create a Problem</h1>
        <ModeToggle/>
        </div>
       <CreateProblemForm/>
    </section>
  )
}

export default CreateProblemPage