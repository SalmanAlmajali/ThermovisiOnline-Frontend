import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import SecondaryButton from '../SecodaryButton'
import DangerButton from '../DangerButton'
import useLaporan from '@/hooks/laporan'

function DeleteLaporan(props) {
    const [processing, setProcessing] = useState(false)

    const { laporan, destroyLaporan } = useLaporan()

    const handleDelete = e => {
        e.preventDefault()

        setProcessing(true)

        destroyLaporan({
            id: props.id.id,
        })
    }

    useEffect(() => {
        setProcessing(false)
        props.setOpenModalDelete(false)
    }, [laporan])

    return (
        <Modal
            show={props.openModalDelete}
            onClose={() => props.setOpenModalDelete(false)}>
            <form className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Apakah Anda yakin ingin menghapus laporan ini?
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Setelah laporan ini dihapus, semua sumber daya dan datanya
                    akan dihapus secara permanen.
                </p>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton
                        onClick={() => props.setOpenModalDelete(false)}>
                        Batal
                    </SecondaryButton>

                    <DangerButton
                        onClick={handleDelete}
                        className="ml-3"
                        disabled={processing}>
                        {processing ? 'Processing...' : 'Hapus'}
                    </DangerButton>
                </div>
            </form>
        </Modal>
    )
}

export default DeleteLaporan
