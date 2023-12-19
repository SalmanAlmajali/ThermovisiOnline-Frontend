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
import Modal from '@/components/Modal'
import SecondaryButton from '@/components/SecodaryButton'
import Select from '@/components/Select'
import { useAuth } from '@/hooks/auth'
import useLaporan from '@/hooks/laporan'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function index() {
    const [cursor, setCursor] = useState('')
    const [lokasi, setLokasi] = useState('')
    const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [processing, setProcessing] = useState(false)

    const [attribute, setAttribute] = useState('')
    const [search, setSearch] = useState('')

    const [openModalDownload, setOpenModalDownload] = useState(false)

    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalUpload, setOpenModalUpload] = useState(false)
    const [id, setId] = useState({
        id: '',
        text: '',
    })

    const { user } = useAuth()
    const { laporan, storeLaporan } = useLaporan({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
        cursorPaginate: cursor,
        attribute: attribute,
        search: search,
    })

    const handleSubmit = e => {
        e.preventDefault()

        setProcessing(true)

        storeLaporan({
            lokasi,
            tanggal_pelaksanaan: tanggalPelaksanaan,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setLokasi('')
        setTanggalPelaksanaan('')
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
                                                Lokasi
                                            </Label>

                                            <Input
                                                id="judul"
                                                type="text"
                                                value={lokasi}
                                                className="block mt-1 w-full px-3 py-2 border border-gray-300"
                                                required
                                                onChange={e =>
                                                    setLokasi(e.target.value)
                                                }
                                                autoFocus
                                            />

                                            <InputError
                                                messages={errors.judul}
                                                className="mt-2"
                                            />
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
                                                onChange={e =>
                                                    setTanggalPelaksanaan(
                                                        e.target.value,
                                                    )
                                                }
                                                autoFocus
                                            />

                                            <InputError
                                                messages={
                                                    errors.tanggal_pelaksanaan
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                        <AuthSessionStatus
                                            className="mt-4"
                                            status={status}
                                        />
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
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Search
                                setAttribute={setAttribute}
                                setSearch={setSearch}
                            />
                            <div className="mt-6 border rounded-md border-gray-200 shadow-md overflow-x-scroll scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-100 hover:bg-gray-200 transition-all duration-700">
                                            <th className="text-left p-4">
                                                No
                                            </th>
                                            <th className="text-left p-4">
                                                Lokasi
                                            </th>
                                            <th className="text-left p-4">
                                                Tanggal Pelaksanaan
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
                                        laporan?.datas?.data?.length != 0 ? (
                                            laporan?.datas?.data?.map(
                                                (item, index) => (
                                                    <tr
                                                        className="border-b hover:bg-gray-200 transition-all duration-700"
                                                        key={index}>
                                                        <td className="p-4 ">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            {item.lokasi}
                                                        </td>
                                                        <td className="p-4">
                                                            {new Date(
                                                                item.tanggal_pelaksanaan,
                                                            ).toLocaleDateString()}
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
                                                                        text: {
                                                                            lokasi:
                                                                                item.lokasi,
                                                                            tanggal_pelaksanaan: new Date(
                                                                                item.tanggal_pelaksanaan,
                                                                            ).toLocaleDateString(),
                                                                        },
                                                                    })
                                                                }}>
                                                                Edit
                                                            </SecondaryButton>
                                                            {item.thermovisis_count !=
                                                            0 ? (
                                                                <Button
                                                                    onClick={() => {
                                                                        setOpenModalDownload(
                                                                            true,
                                                                        )
                                                                        setId({
                                                                            id:
                                                                                item.id,
                                                                        })
                                                                    }}>
                                                                    Download
                                                                    Laporan
                                                                </Button>
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
                            <div className="mt-4 flex items-center gap-x-4">
                                <Button
                                    disabled={
                                        laporan?.datas?.prev_cursor == null
                                    }
                                    onClick={() =>
                                        setCursor(laporan?.datas?.prev_cursor)
                                    }
                                    className="gap-x-2 font-bold italic">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                        />
                                    </svg>
                                    Prev
                                </Button>
                                <Button
                                    disabled={
                                        laporan?.datas?.next_cursor == null
                                    }
                                    onClick={() =>
                                        setCursor(laporan?.datas?.next_cursor)
                                    }
                                    className="gap-x-2 font-bold italic">
                                    Next
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </Button>
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
            <DownloadModal
                show={openModalDownload}
                onClose={() => setOpenModalDownload(false)}
                id={id.id}
            />
        </AppLayout>
    )
}

export default index

const Search = ({ setAttribute, setSearch }) => {
    const [tempAttr, setTempAttr] = useState('')

    const debounceSearch = debounce(e => {
        setAttribute(tempAttr)
        setSearch(e.target.value)
    }, 3000)

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900">Pencarian</h2>
            <p className="mt-1 text-sm text-gray-600">
                Cari data anda berdasarkan tanggal pelaksanaan atau lokasi.
            </p>
            <div className="mt-4 flex gap-x-2">
                <div>
                    <Label htmlFor="attribute">Cari Berdasarkan</Label>

                    <Select
                        id="attribute"
                        defaultValue={tempAttr}
                        onChange={e => setTempAttr(e.target.value)}
                        className="mt-2"
                        required>
                        <option value="">-</option>
                        <option value="lokasi">Lokasi</option>
                        <option value="tanggal_pelaksanaan">
                            Tanggal Pelaksanaan
                        </option>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="search">Kata Kunci</Label>

                    <Input
                        id="search"
                        type={
                            tempAttr == 'tanggal_pelaksanaan'
                                ? 'date'
                                : 'search'
                        }
                        className="mt-2 w-96"
                        // value={search}
                        onChange={debounceSearch}
                        required
                    />
                </div>
            </div>
        </div>
    )
}

const DownloadModal = ({ show, onClose, id }) => {
    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="p-6 flex flex-col gap-y-2">
                <Button className="w-full bg-green-600 justify-center py-6 hover:bg-green-500 active:bg-green-900 focus:border-green-900 ring-green-300">
                    <Link
                        href={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            '/api/laporan/' +
                            id
                        }>
                        Download As Excel
                    </Link>
                </Button>
                <Button className="w-full bg-red-600 justify-center py-6 hover:bg-red-500 active:bg-red-900 focus:border-red-900 ring-red-300">
                    <Link
                        href={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            '/api/laporan/pdf/' +
                            id
                        }>
                        Download As PDF
                    </Link>
                </Button>
            </div>
        </Modal>
    )
}
