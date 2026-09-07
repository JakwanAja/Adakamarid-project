import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <GuestLayout>
            <Head title="Beranda" />
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Adakamar.id</h1>
                    <p className="text-gray-500">Platform iklan kos area Yogyakarta. Coming soon.</p>
                </div>
            </div>
        </GuestLayout>
    );
}
