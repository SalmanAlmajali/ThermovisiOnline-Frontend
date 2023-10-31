import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import Label from '../Label'
import Input from '../Input'
import InputError from '../InputError'
import SecondaryButton from '../SecodaryButton'
import Button from '../Button'
import useLaporan from '@/hooks/laporan'
import AuthSessionStatus from '../AuthSessionStatus'

function UploadLaporan(props) {
    const [file, setFile] = useState([])
    const [errors, setErrors] = useState([])
    const [processing, setProcessing] = useState(false)
    const [status, setStatus] = useState('')

    const { laporan, uploadImport } = useLaporan()

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        uploadImport({
            file,
            id: props?.id?.id,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setFile([])

        return () => {
            setProcessing(false)
            setErrors([])
            setStatus('')
        }
    }, [laporan])

    return (
        <Modal
            show={props.openModalUpload}
            onClose={() => props.setOpenModalUpload(false)}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Upload laporan thermovisi anda disini
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    File yang diupload harus sesuai dengan format yang telah
                    dicontohkan.
                </p>

                <div className="mt-6">
                    <Label htmlFor="file">Upload File</Label>

                    <Input
                        id="file"
                        type="file"
                        className="block mt-1 w-full px-3 py-2 border border-gray-300"
                        required
                        onChange={e => setFile(e.target.files[0])}
                        autoFocus
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />

                    <InputError messages={errors.file} className="mt-2" />

                    <AuthSessionStatus className="mt-2" status={status} />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton
                        onClick={() => props.setOpenModalUpload(false)}>
                        Batal
                    </SecondaryButton>

                    <Button className="ml-3" disabled={processing}>
                        {processing ? 'Processing...' : 'Upload'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default UploadLaporan
