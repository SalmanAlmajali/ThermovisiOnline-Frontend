import DropzoneComponent from '@/components/DropzoneComponent'
import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import useLaporan from '@/hooks/laporan'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Folder = () => {
    const { user } = useAuth()
    const { getDetail } = useLaporan()
    const router = useRouter()

    const [setLaporan] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        getDetail({
            id: router.query.id,
            setLaporan,
            setErrors,
        })
    }, [router.query.id])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Folder {}
                </h2>
            }>
            <Head>
                <title>{user?.setting.nama} - Folder</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {errors?.success == false ? (
                                <div className="text-center">
                                    <h1 className="font-bold tracking-tight text-xl text-slate-600">
                                        404
                                    </h1>
                                    <p className="font-bold tracking-tight text-slate-500">
                                        Data {errors.message}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <section className="max-w-xl">
                                        <header>
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Upload File Temuan
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Upload file temuan anda disi.
                                            </p>
                                        </header>
                                    </section>
                                    <div className="mt-6">
                                        <DropzoneComponent
                                            id={router.query.id}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Folder
