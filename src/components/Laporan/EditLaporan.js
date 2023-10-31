import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import Label from '../Label'
import Input from '../Input'
import InputError from '../InputError'
import AuthSessionStatus from '../AuthSessionStatus'
import SecondaryButton from '../SecodaryButton'
import Button from '../Button'
import useLaporan from '@/hooks/laporan'

function EditLaporan(props) {
    const [judul, setJudul] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [processing, setProcessing] = useState(false)

    const { laporan, updateLaporan } = useLaporan({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        updateLaporan({
            judul,
            id: props.id.id,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setJudul(props.id.text)

        return () => {
            setStatus('')
            setProcessing(false)
            props.setOpenModalEdit(false)
        }
    }, [props.id.text, laporan])

    return (
        <Modal
            show={props.openModalEdit}
            onClose={() => props.setOpenModalEdit(false)}>
            <form onSubmit={handleSubmit} className="p-6">
                <div>
                    <Label htmlFor="judul">Judul Laporan</Label>

                    <Input
                        id="judul"
                        type="text"
                        value={judul}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setJudul(e.target.value)}
                        autoFocus
                    />

                    <InputError messages={errors.judul} className="mt-2" />

                    <AuthSessionStatus className="mt-4" status={status} />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton
                        onClick={() => props.setOpenModalEdit(false)}>
                        Batal
                    </SecondaryButton>

                    <Button className="ml-3" disabled={processing}>
                        {processing ? 'Processing...' : 'Simpan'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default EditLaporan
