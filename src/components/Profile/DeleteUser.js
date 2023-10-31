import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import Label from '../Label'
import InputError from '../InputError'
import DangerButton from '../DangerButton'
import SecondaryButton from '../SecodaryButton'
import useProfile from '@/hooks/profil'
import Input from '../Input'

function DeleteUser() {
    const [openModal, setOpenModal] = useState(false)
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [processing, setProcessing] = useState(false)

    const { deleteUser } = useProfile()

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        deleteUser({
            password,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setProcessing(false)
    }, [status, errors])

    return (
        <section className="max-w-xl space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Hapus akun
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya
                    akan dihapus secara permanen. Sebelum menghapus akun Anda,
                    silakan unduh data atau informasi apa pun yang ingin Anda
                    simpan.
                </p>
            </header>

            <DangerButton onClick={() => setOpenModal(true)}>
                Hapus akun
            </DangerButton>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Setelah akun Anda dihapus, semua sumber daya dan datanya
                        akan dihapus secara permanen. Silakan masukkan kata
                        sandi Anda untuk mengonfirmasi bahwa Anda ingin
                        menghapus akun Anda secara permanen.
                    </p>

                    <div className="mt-6">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full px-3 py-2 border border-gray-300"
                            required
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setOpenModal(false)}>
                            Batal
                        </SecondaryButton>

                        <DangerButton className="ml-3" disabled={processing}>
                            {processing ? 'Processing...' : 'Hapus Akun'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    )
}

export default DeleteUser
