import { cookies } from 'next/headers'
import Handler from './handler';
import { redirect } from 'next/navigation';

export default function Play({ params }: { params: { game: string } }) {
    const cookieStore = cookies()

    const name = cookieStore.get('name')?.value
    
    if (!name) {
        redirect('/');
    }

    return (
        <Handler game={params.game} name={name} />
    );
}
