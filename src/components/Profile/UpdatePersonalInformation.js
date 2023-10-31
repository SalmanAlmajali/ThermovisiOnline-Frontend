import useProfile from '@/hooks/profil'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Label from '../Label'
import Input from '../Input'
import InputError from '../InputError'
import { useAuth } from '@/hooks/auth'
import AuthSessionStatus from '../AuthSessionStatus'
import Button from '../Button'
import Loading from '../Loading'

const UpdatePersonalInformation = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')

    const { profil, updateProfile, loading } = useProfile({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })
    const { user, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        updateProfile({
            name,
            email,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setName(profil?.data.name)
        setEmail(profil?.data.email)
        setErrors([])
        setProcessing(false)
        setStatus('')
    }, [user, profil])

    if (loading) return <Loading />
    return (
        <section className="max-w-xl">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi Profil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="name">Nama</Label>

                    <Input
                        id="name"
                        type="text"
                        value={name}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setName(e.target.value)}
                        autoFocus
                    />

                    <InputError messages={errors.name} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {profil?.mustVerifyEmail &&
                    user?.user.email_verified_at == null && (
                        <div>
                            <p className="text-sm mt-2 text-gray-800">
                                Alamat email Anda belum diverifikasi.
                                <Button
                                    onClick={() =>
                                        resendEmailVerification({ setStatus })
                                    }>
                                    Klik di sini untuk mengirim ulang email
                                    verifikasi.
                                </Button>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-600">
                                    Tautan verifikasi baru telah dikirimkan ke
                                    alamat email Anda.
                                </div>
                            )}
                        </div>
                    )}
                <div className="flex flex-col items-start gap-y-4">
                    <AuthSessionStatus status={status} />

                    <Button disabled={processing}>
                        {processing ? 'Processing...' : 'Simpan'}
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default UpdatePersonalInformation
