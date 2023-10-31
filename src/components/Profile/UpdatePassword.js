import useProfile from '@/hooks/profil'
import React, { useState } from 'react'
import Loading from '../Loading'
import Label from '../Label'
import Input from '../Input'
import InputError from '../InputError'
import AuthSessionStatus from '../AuthSessionStatus'
import Button from '../Button'

export const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')

    const { updatePassword, loading } = useProfile({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const handleResetPassword = e => {
        e.preventDefault()

        setProcessing(true)

        updatePassword({
            current_password: currentPassword,
            password: password,
            password_confirmation: passwordConfirmation,
            setErrors,
            setStatus,
        })
    }
    if (loading) return <Loading />
    return (
        <section className="max-w-xl">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Perbarui Kata Sandi
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan
                    acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={handleResetPassword} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="current_password">Password Saat Ini</Label>

                    <Input
                        id="current_password"
                        type="password"
                        value={currentPassword}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setCurrentPassword(e.target.value)}
                        autoFocus
                    />

                    <InputError
                        messages={errors.current_password}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password Baru</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setPassword(e.target.value)}
                        autoFocus
                    />

                    <InputError messages={errors.password} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="password_confirmation">
                        Konfirmasi Password Baru
                    </Label>

                    <Input
                        id="password_confirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setPasswordConfirmation(e.target.value)}
                        autoFocus
                    />

                    <InputError
                        messages={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
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
