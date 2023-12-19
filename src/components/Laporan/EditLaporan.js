import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import Label from '../Label'
import Input from '../Input'
import InputError from '../InputError'
import AuthSessionStatus from '../AuthSessionStatus'
import SecondaryButton from '../SecodaryButton'
import Button from '../Button'
import useLaporan from '@/hooks/laporan'
import moment from 'moment/moment'

function EditLaporan(props) {
    const [lokasi, setLokasi] = useState('')
    const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [processing, setProcessing] = useState(false)

    const { laporan, updateLaporan } = useLaporan({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
        cursorPaginate: null,
    })

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        updateLaporan({
            lokasi,
            tanggal_pelaksanaan: tanggalPelaksanaan,
            id: props.id.id,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setLokasi(props?.id?.text?.lokasi)
        setTanggalPelaksanaan(
            moment(props?.id?.text?.tanggal_pelaksanaan).format('yyyy-MM-DD'),
        )

        return () => {
            setStatus('')
            setProcessing(false)
            props.setOpenModalEdit(false)
        }
    }, [props?.id?.text?.lokasi, laporan])

    return (
        <Modal
            show={props.openModalEdit}
            onClose={() => props.setOpenModalEdit(false)}>
            <form onSubmit={handleSubmit} className="p-6">
                <div>
                    <Label htmlFor="judul_edit">Lokasi</Label>

                    <Input
                        id="judul_edit"
                        type="text"
                        value={lokasi}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setLokasi(e.target.value)}
                        autoFocus
                    />

                    <InputError messages={errors.judul} className="mt-2" />
                </div>
                <div className="mt-4">
                    <Label htmlFor="tanggal_pelaksanaan">
                        Tanggal Pelaksanaan
                    </Label>

                    <Input
                        id="tanggal_pelaksanaan"
                        type="date"
                        value={tanggalPelaksanaan}
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setTanggalPelaksanaan(e.target.value)}
                        autoFocus
                    />

                    <InputError
                        messages={errors.tanggal_pelaksanaan}
                        className="mt-2"
                    />
                </div>
                <AuthSessionStatus className="mt-4" status={status} />
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
