import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import useLaporan from '@/hooks/laporan'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function index() {
    const { user } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const { laporan } = useLaporan({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    File Manager
                </h2>
            }>
            <Head>
                <title>{user?.setting.nama} - File Manager</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Buat Laporan
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Sesuaikan dan buat laporan Anda.
                                    </p>
                                </header>
                            </section>
                            <div className="flex flex-col gap-y-2 mt-6">
                                {laporan?.datas?.data?.map((item, i) => {
                                    return (
                                        <Link
                                            href={`/file-manager/${item.id}`}
                                            key={i}
                                            className="flex justify-between p-4 rounded-md bg-sky-50 hover:bg-sky-100 transition-colors">
                                            <div className="flex gap-x-4 items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6 stroke-sky-500">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                                                    />
                                                </svg>
                                                <h1 className="tracking-tight">
                                                    {item.judul}
                                                </h1>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
