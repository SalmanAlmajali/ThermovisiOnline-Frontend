import AuthSessionStatus from '@/components/AuthSessionStatus'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import AppLayout from '@/components/Layouts/AppLayout'
import Loading from '@/components/Loading'
import { useAuth } from '@/hooks/auth'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'

function Index() {
    const inputFile = useRef(null)

    const openFileDialog = () => {
        if (!processing) {
            return inputFile.current.click()
        }
    }

    const { user, loading, updateLogo, updateName } = useAuth({
        middleware: 'auth',
    })

    const [nama, setNama] = useState(`${user?.setting?.nama}`)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [processing, setProcessing] = useState(false)

    const handleUploadFile = e => {
        e.preventDefault()

        setProcessing(true)

        updateLogo({
            logo: e.target.files[0],
            id: user?.logo?.id,
            setErrors,
            setStatus,
        })
    }

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    const [logoUrl, setLogoUrl] = useState(baseURL)

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        updateName({
            nama,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setLogoUrl(`${baseURL}/storage/${user?.logo?.path}`)
        setNama(`${user?.setting?.nama}`)
        setErrors([])
        setStatus('')
        setProcessing(false)
    }, [user])

    if (loading) return <Loading />
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pengaturan
                </h2>
            }>
            <Head>
                <title>{user?.setting.nama} - Pengaturan</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Kustomisasi
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Sesuaikan preferensi dan informasi Anda.
                                </p>
                            </header>

                            <div className="mt-6">
                                <Label htmlFor="email">Logo</Label>

                                <img
                                    src={logoUrl}
                                    alt="Default Application Logo"
                                    className="border aspect-auto w-40 mt-1"
                                    onClick={openFileDialog}
                                />

                                <input
                                    id="logo"
                                    name="logo"
                                    type="file"
                                    className="hidden"
                                    ref={inputFile}
                                    onChange={e => handleUploadFile(e)}
                                />

                                <i className="text-xs mt-2 text-gray-500">
                                    * klik untuk mengubah
                                </i>

                                <InputError
                                    messages={errors.logo}
                                    className="mt-2"
                                />
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-6">
                                <div>
                                    <Label htmlFor="nama">Nama</Label>

                                    <Input
                                        id="nama"
                                        type="text"
                                        value={nama}
                                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                                        required
                                        onChange={e => setNama(e.target.value)}
                                        autoFocus
                                    />

                                    <InputError
                                        messages={errors.nama}
                                        className="mt-2"
                                    />

                                    <AuthSessionStatus
                                        className="mt-4"
                                        status={status}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>
                                        {processing
                                            ? 'Processing...'
                                            : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Index
