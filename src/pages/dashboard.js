import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import useDashboard from '@/hooks/dashboard'
import Head from 'next/head'

const Dashboard = () => {
    const { user } = useAuth({
        middleware: 'auth',
    })

    const { dashboard } = useDashboard({
        middleware: 'auth',
    })

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dasbor
                </h2>
            }>
            <Head>
                <title>{user?.setting?.nama} - Dasbor</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            Anda berhasil masuk!
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex-grow">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h1 className="font-bold">Laporan</h1>
                                <div className="flex items-baseline gap-x-2 mt-2">
                                    <h2 className="font-medium text-3xl">
                                        {dashboard?.laporan?.count}
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Total laporan
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-between">
                                    <p className="text-slate-600 text-sm">
                                        Laporan
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Thermovisi
                                    </p>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div className="relative w-full">
                                        {dashboard?.laporan?.data?.map(
                                            (item, i) => {
                                                return (
                                                    <div
                                                        className="flex items-center rounded-md h-9 mb-2 bg-blue-500/40"
                                                        key={i}
                                                        style={{
                                                            width:
                                                                item.thermovisis
                                                                    .length /
                                                                dashboard
                                                                    ?.laporan
                                                                    ?.count,
                                                        }}>
                                                        <div className="absolute max-w-full flex left-2">
                                                            <p className="text-sm text-slate-600">
                                                                {item.judul}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </div>
                                    <div className="text-right min-w-min">
                                        {dashboard?.laporan?.data?.map(
                                            (item, i) => {
                                                return (
                                                    <div
                                                        className="flex justify-end items-center h-9 mb-2"
                                                        key={i}>
                                                        <p className="whitespace-nowrap truncate text-sm text-slate-600">
                                                            {
                                                                item.thermovisis
                                                                    .length
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex-grow">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h1 className="font-bold">File</h1>
                                <div className="flex items-baseline gap-x-2 mt-2">
                                    <h2 className="font-medium text-3xl">
                                        {dashboard?.file?.count}
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Total file
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-between">
                                    <p className="text-slate-600 text-sm">
                                        File
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Temuan
                                    </p>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div className="relative w-full">
                                        {dashboard?.file?.data?.map(
                                            (item, i) => {
                                                return (
                                                    <div
                                                        className="flex items-center rounded-md h-9 mb-2 bg-blue-500/40"
                                                        key={i}
                                                        style={{
                                                            width:
                                                                item.files
                                                                    .length /
                                                                dashboard
                                                                    ?.laporan
                                                                    ?.count,
                                                        }}>
                                                        <div className="absolute max-w-full flex left-2">
                                                            <p className="text-sm text-slate-600">
                                                                {item.judul}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </div>
                                    <div className="text-right min-w-min">
                                        {dashboard?.laporan?.data?.map(
                                            (item, i) => {
                                                return (
                                                    <div
                                                        className="flex justify-end items-center h-9 mb-2"
                                                        key={i}>
                                                        <p className="whitespace-nowrap truncate text-sm text-slate-600">
                                                            {item.files.length}
                                                        </p>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Dashboard
