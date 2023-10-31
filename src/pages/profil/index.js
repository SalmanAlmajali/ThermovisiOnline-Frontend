import AppLayout from '@/components/Layouts/AppLayout'
import Loading from '@/components/Loading'
import DeleteUser from '@/components/Profile/DeleteUser'
import { UpdatePassword } from '@/components/Profile/UpdatePassword'
import UpdatePersonalInformation from '@/components/Profile/UpdatePersonalInformation'
import { useAuth } from '@/hooks/auth'
import Head from 'next/head'
import React from 'react'

export default function index() {
    const { user, loading } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    if (loading) return <Loading />
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profil
                </h2>
            }>
            <Head>
                <title>{user?.setting.nama} - Profil</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePersonalInformation />
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePassword />
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUser />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
