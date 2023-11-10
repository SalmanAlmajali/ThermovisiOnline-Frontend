import AuthSessionStatus from '@/components/AuthSessionStatus'
import Button from '@/components/Button'
import DangerButton from '@/components/DangerButton'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import DeleteLaporan from '@/components/Laporan/DeleteLaporan'
import EditLaporan from '@/components/Laporan/EditLaporan'
import UploadLaporan from '@/components/Laporan/UploadLaporan'
import AppLayout from '@/components/Layouts/AppLayout'
import SecondaryButton from '@/components/SecodaryButton'
import { useAuth } from '@/hooks/auth'
import useLaporan from '@/hooks/laporan'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function index() {
    const { user } = useAuth()
    const { laporan, storeLaporan } = useLaporan()

    const [judul, setJudul] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [processing, setProcessing] = useState(false)

    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalUpload, setOpenModalUpload] = useState(false)
    const [id, setId] = useState({
        id: '',
        text: '',
    })

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        storeLaporan({
            judul,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setJudul('')
        setStatus('')
        setProcessing(false)
        setOpenModalUpload(false)
    }, [laporan])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Laporan
                </h2>
            }>
            <Head>
                <title>{user?.setting.nama} - Buat Laporan</title>
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
                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-6 space-y-6">
                                        <div>
                                            <Label htmlFor="judul">
                                                Judul Laporan
                                            </Label>

                                            <Input
                                                id="judul"
                                                type="text"
                                                value={judul}
                                                className="block mt-1 w-full px-3 py-2 border border-gray-300"
                                                required
                                                onChange={e =>
                                                    setJudul(e.target.value)
                                                }
                                                autoFocus
                                            />

                                            <InputError
                                                messages={errors.judul}
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
                                </header>
                            </section>
                            <div className="mt-6 border rounded-md border-gray-200 shadow-md overflow-x-scroll">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-100 hover:bg-gray-200 transition-all duration-700">
                                            <th className="text-left p-4">
                                                No
                                            </th>
                                            <th className="text-left p-4">
                                                Judul
                                            </th>
                                            <th className="text-left p-4">
                                                Tanggal dibuat
                                            </th>
                                            <th className="text-left p-4" />
                                            <th className="text-left p-4" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {laporan?.datas &&
                                        laporan?.datas?.data?.length > 0 ? (
                                            laporan?.datas?.data?.map(
                                                (item, index) => (
                                                    <tr
                                                        className="border-b hover:bg-gray-200 transition-all duration-700"
                                                        key={index}>
                                                        <td className="p-4 ">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            {item.judul}
                                                        </td>
                                                        <td className="p-4">
                                                            {new Date(
                                                                item.created_at,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4 space-y-2 md:space-x-2">
                                                            <SecondaryButton
                                                                onClick={() => {
                                                                    setOpenModalEdit(
                                                                        true,
                                                                    )
                                                                    setId({
                                                                        id:
                                                                            item.id,
                                                                        text:
                                                                            item.judul,
                                                                    })
                                                                }}>
                                                                Edit
                                                            </SecondaryButton>
                                                            {item.thermovisis
                                                                .length != 0 ? (
                                                                <SecondaryButton>
                                                                    <Link
                                                                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laporan/${item.id}`}>
                                                                        Download
                                                                        Laporan
                                                                    </Link>
                                                                </SecondaryButton>
                                                            ) : (
                                                                <SecondaryButton
                                                                    onClick={() => {
                                                                        setOpenModalUpload(
                                                                            true,
                                                                        )
                                                                        setId({
                                                                            id:
                                                                                item.id,
                                                                        })
                                                                    }}>
                                                                    Input Data
                                                                    Thermovisi
                                                                </SecondaryButton>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <DangerButton
                                                                onClick={() => {
                                                                    setOpenModalDelete(
                                                                        true,
                                                                    )
                                                                    setId({
                                                                        id:
                                                                            item.id,
                                                                    })
                                                                }}>
                                                                Hapus
                                                            </DangerButton>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="p-4 text-center">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditLaporan
                openModalEdit={openModalEdit}
                setOpenModalEdit={setOpenModalEdit}
                id={id}
            />
            <DeleteLaporan
                openModalDelete={openModalDelete}
                setOpenModalDelete={setOpenModalDelete}
                id={id}
            />
            <UploadLaporan
                openModalUpload={openModalUpload}
                setOpenModalUpload={setOpenModalUpload}
                id={id}
            />
        </AppLayout>
    )
}

export default index
