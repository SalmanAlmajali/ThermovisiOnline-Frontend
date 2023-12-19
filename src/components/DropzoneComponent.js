import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from './Button'
import useFileManager from '@/hooks/file-manager'
import AuthSessionStatus from './AuthSessionStatus'
import DangerButton from './DangerButton'

const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'rgb(107 114 128)',
    borderStyle: 'dashed',
    backgroundColor: 'rgb(229 231 235)',
    color: 'rgb(107 114 128)',
    transition: 'border .3s ease-in-out',
}

const activeStyle = {
    borderColor: '#2196f3',
}

const acceptStyle = {
    borderColor: '#00e676',
}

const rejectStyle = {
    borderColor: '#ff1744',
}

function DropzoneComponent({ id }) {
    const [files, setFiles] = useState([])

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.map(file =>
            files.push(
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                }),
            ),
        )
    }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
    })

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept],
    )

    const thumbs = files.map((file, i) => (
        <div
            className="flex flex-col items-center max-w-24 gap-y-2 bg-white p-2 rounded-md shadow-md"
            key={i}>
            <div
                className="aspect-square w-24 h-24 rounded-md overflow-hidden bg-cover bg-center shadow-md"
                style={{
                    backgroundImage: `url("${file.preview}")`,
                }}
            />
            <p className="text-sm text-slate-800 font-bold">
                {file?.name?.length > 10
                    ? file?.name?.substring(9, 10 - file?.name?.length) + '...'
                    : file?.name}
            </p>
            <button
                className="py-1 block text-sm bg-red-500 w-full text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={() => removeItem(files, i)}>
                Batal
            </button>
        </div>
    ))

    const removeItem = (arr, key) => {
        if (arr.length != 0) {
            arr.splice(key, 1)
        }
    }

    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('')
    const [cursorPaginate, setCursorPaginate] = useState('')
    const [processing, setProcessing] = useState(false)

    const { images, storeData, destroyData } = useFileManager({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
        id: id,
        cursorPaginate: cursorPaginate,
    })

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    const uploadImage = e => {
        e.preventDefault()

        setProcessing(true)

        storeData({
            setErrors,
            setStatus,
            id: id,
            data: files,
        })
    }

    const deleteImage = (e, id) => {
        e.preventDefault()

        setProcessing(true)

        destroyData({
            id: id,
        })
    }

    // clean up
    useEffect(() => {
        files.splice(0, files.length)
        setStatus('')
        setProcessing(false)
    }, [images])

    return (
        <section>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <div>Drag and drop your images here.</div>
                <div className="flex gap-4 flex-wrap mt-2">{thumbs}</div>
            </div>
            <div className="mt-6">
                <Button onClick={uploadImage} disabled={processing}>
                    {processing ? 'Processing...' : 'Upload'}
                </Button>
                <div className="mt-6">
                    <AuthSessionStatus status={status} />
                </div>
            </div>
            <div className="mt-6 border rounded-md border-gray-200 shadow-md overflow-x-scroll scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="border-b bg-gray-100 hover:bg-gray-200 transition-all duration-700">
                            <th className="text-left p-4">No</th>
                            <th className="text-left p-4" />
                            <th className="text-left p-4">Nama File</th>
                            <th className="text-left p-4">Tanggal diunggah</th>
                            <th className="text-left p-4" />
                        </tr>
                    </thead>
                    <tbody>
                        {images?.datas?.data?.length > 0 ? (
                            images?.datas?.data?.map((item, i) => (
                                <tr
                                    key={i}
                                    className="border-b hover:bg-gray-200 transition-all duration-700">
                                    <td className="p-4 ">{i + 1}</td>
                                    <td className="p-4 ">
                                        <div
                                            style={{
                                                backgroundImage: `url(${baseURL}/storage/${item?.path})`,
                                            }}
                                            className="aspect-square w-20 h-20 rounded-md overflow-hidden bg-cover bg-center shadow-md"
                                            onClick={() => {
                                                window.open(
                                                    `${baseURL}/storage/${item?.path}`,
                                                    '_blank',
                                                )
                                            }}
                                        />
                                    </td>
                                    <td className="p-4 ">{item.file_name}</td>
                                    <td className="p-4 ">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString('id')}
                                        &nbsp;
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleTimeString('id')}
                                    </td>
                                    <td>
                                        <DangerButton
                                            onClick={e =>
                                                deleteImage(e, item.id)
                                            }
                                            disabled={processing}>
                                            {processing
                                                ? 'Processing...'
                                                : 'Hapus'}
                                        </DangerButton>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center gap-x-4">
                <Button
                    onClick={() => {
                        images?.datas.prev_cursor == null
                            ? setCursorPaginate('#')
                            : setCursorPaginate(`${images?.datas?.prev_cursor}`)
                        // mutate()
                    }}
                    disabled={images?.datas.prev_cursor == null}
                    className="gap-x-2  font-bold italic">
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
                    onClick={() => {
                        images?.datas.next_cursor == null
                            ? setCursorPaginate('#')
                            : setCursorPaginate(`${images?.datas?.next_cursor}`)
                        // mutate()
                    }}
                    disabled={images?.datas.next_cursor == null}
                    className="gap-x-2  font-bold italic">
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
        </section>
    )
}

export default DropzoneComponent
