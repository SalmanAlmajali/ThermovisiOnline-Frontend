/* eslint-disable prettier/prettier */
import BreadCrumbs from '@/components/BreadCrumbs'
import Button from '@/components/Button'
import DangerButton from '@/components/DangerButton'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import UploadLaporan from '@/components/Laporan/UploadLaporan'
import AppLayout from '@/components/Layouts/AppLayout'
import Modal from '@/components/Modal'
import SecondaryButton from '@/components/SecodaryButton'
import { useAuth } from '@/hooks/auth'
import useLaporan from '@/hooks/laporan'
import useThermovisi from '@/hooks/thermovisi'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const detail = () => {
	const router = useRouter()
	const { user } = useAuth()
	const { getDetail } = useLaporan()

	const [errors, setErrors] = useState([])
	const [laporan, setLaporan] = useState(null)
	const [editData, setEditData] = useState({
		instalasi: '',
		arus_nominal: '',
		arus_tertinggi: '',
		arus_shooting: '',
		suhu_klem: '',
		suhu_konduktor: '',
		id: '',
	})

	const [isOpen, setIsOpen] = useState(0)
	const [processing, setProcessing] = useState(false)

	const tindakLanjut1 = (data) => {
		var hasil = null

		if (Math.floor(data) > 70) {
			hasil = 'KONDISI DARURAT'
		} else if (Math.floor(data) <= 70 && Math.floor(data) > 40) {
			hasil = 'PERBAIKAN SEGERA'
		} else if (Math.floor(data) <= 40 && Math.floor(data) > 10) {
			hasil = 'RENCANAKAN PERBAIKAN'
		} else {
			hasil = 'KONDISI BAIK'
		}

		return hasil
	}

	const tindalLanjut2 = (data) => {
		var hasil = null

		if (Math.floor(data) < 15) {
			hasil = 'KONDISI BAIK'
		} else {
			hasil = 'PERBAIKAN SEGERA'
		}

		return hasil
	}

	const tindalLanjut3 = (data) => {
		var hasil = null

		if (Math.floor(data) > 69) {
			hasil = 'KONDISI DARURAT'
		} else if (Math.floor(data) < 69 && Math.floor(data) > 40) {
			hasil = 'PERBAIKAN SEGERA'
		} else {
			hasil = 'KONDISI BAIK'
		}

		return hasil
	}

	useEffect(() => {
		if (typeof router.query.id != 'undefined') {
			getDetail({
				id: router.query.id,
				setErrors,
				setLaporan,
			})
		}

		setProcessing(false)
	}, [router.query.id, processing])

	console.log(laporan)

	return (
		<AppLayout
			header={
				<h2 className="font-semibold text-xl text-gray-800 leading-tight">
					Detail
				</h2>
			}>
			<Head>
				<title>{user?.setting.nama} - Detail Laporan</title>
			</Head>

			<div className="py-12">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<section>
						<BreadCrumbs items={laporan?.breadcrumbs} className="mb-4 p-2 rounded-md bg-slate-200" />
					</section>
					<div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
						<div className="bg-white border-b border-gray-200">
							<section className="p-6 border-b">
								<h2 className="text-lg font-medium text-gray-900">
									{laporan?.data?.lokasi}
								</h2>
								<p className="mt-1 text-sm text-gray-600">
									{new Date(laporan?.data?.tanggal_pelaksanaan).toLocaleDateString()}
								</p>
							</section>
							<article>
								<section className="border-l col-span-2 p-6">
									<header className="flex gap-x-2">
										<div className="pr-2 space-x-2 border-r-2">
											<SecondaryButton onClick={() => setIsOpen(1)}>
												Tambah Data
											</SecondaryButton>
											<SecondaryButton onClick={() => setIsOpen(4)}>
												Upload Data
											</SecondaryButton>
										</div>
										<Link href={
											process.env.NEXT_PUBLIC_BACKEND_URL +
											'/api/laporan/' +
											router.query.id
										}>
											<Button>Download as Excel</Button>
										</Link>
										<Link href={'/laporan/detail/to-pdf/'+ router.query.id}>
											<Button>Save as PDF</Button>
										</Link>
									</header>
									<article>
										<div className="mt-6 border rounded-md border-gray-200 shadow-md overflow-x-scroll scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100">
											<table className="table-auto w-full">
												<thead>
													<tr className="border-b bg-gray-100 hover:bg-gray-200 transition-all duration-700">
														<th className="text-left p-4">
															No
														</th>
														<th className="text-left p-4">
															Instalasi
														</th>
														<th className="text-left p-4">
															Arus Nominal (A)
														</th>
														<th className="text-left p-4">
															Arus Tertinggi Yang Pernah Tercapai
														</th>
														<th className="text-left p-4">
															Arus Pada Saat Shooting
														</th>
														<th className="text-left p-4">
															Suhu Klem / Terminal Saat Shooting
														</th>
														<th className="text-left p-4">
															Suhu Konduktor / Kabel Saat Shooting
														</th>
														<th className="text-left p-4">
															Selisih Suhu Klem Terhadap Konduktor Delta Tm
														</th>
														<th className="text-left p-4">
															Selisih Antar Fasa (yang digunakan suhu saat shooting)
														</th>
														<th className="text-left p-4">
															Tindak Lanjut Selisih Klem Terhadap Konduktor
														</th>
														<th className="text-left p-4">
															Tindak Lanjut Selisih Antar Fasa &lt; 15&deg;C
														</th>
														<th className="text-left p-4">
															Tindak Lanjut Suhu Klem / Konduktor Saat Shooting &gt; 40 &deg;C
														</th>
														<th className="text-left p-4" />
													</tr>
												</thead>
												<tbody>
													{laporan &&
														laporan?.thermovisis?.length != 0 ? (
														laporan?.thermovisis?.map(
															(item, index) => (
																<tr
																	className="border-b hover:bg-gray-200 transition-all duration-700 text-sm"
																	key={index}>
																	<td className="p-4 ">
																		{index + 1}
																	</td>
																	<td className="p-4 whitespace-nowrap">
																		{item.instalasi}
																	</td>
																	<td className="p-4">
																		{item.arus_nominal}
																	</td>
																	<td className="p-4">
																		{item.arus_tertinggi}
																	</td>
																	<td className="p-4 space-y-2 md:space-x-2">
																		{item.arus_shooting}
																	</td>
																	<td className="p-4">
																		{item.suhu_klem}
																	</td>
																	<td className="p-4">
																		{item.suhu_konduktor}
																	</td>
																	<td className="p-4">
																		{
																			item.arus_shooting >= 1 ? (
																				Math.floor((item.arus_tertinggi * item.arus_tertinggi) / (item.arus_shooting * item.arus_shooting) * (item.suhu_klem - item.suhu_konduktor))
																			) : (
																				0
																			)
																		}
																	</td>
																	<td className="p-4">
																		{
																			laporan?.thermovisis?.length == 1 ? (
																				Math.floor(item.suhu_klem)
																			) : (
																					index == laporan?.thermovisis?.length - 1 ? (
																						Math.floor(item.suhu_klem - laporan?.thermovisis[index - 2]?.suhu_klem)
																					) : (
																						Math.floor(item.suhu_klem - laporan?.thermovisis[index + 1]?.suhu_klem)
																					)
																			)
																		}
																	</td>
																	<td className="p-4 whitespace-nowrap">
																		{tindakLanjut1(item.arus_shooting >= 1 ?
																			(item.arus_tertinggi * item.arus_tertinggi) / (item.arus_shooting * item.arus_shooting) * (item.suhu_klem - item.suhu_konduktor)
																			: 0
																		)}
																	</td>
																	<td className="p-4 whitespace-nowrap">
																		{
																			laporan?.thermovisis?.length != 1 ? (
																				index == laporan?.thermovisis?.length - 1 ? (
																					tindalLanjut2(item.suhu_klem - laporan?.thermovisis[index - 2]?.suhu_klem)
																				) : (
																					tindalLanjut2(item.suhu_klem - laporan?.thermovisis[index + 1]?.suhu_klem)
																				)
																			) : (
																				tindalLanjut2(item.suhu_klem)
																			)
																		}
																	</td>
																	<td className="p-4 whitespace-nowrap">
																		{
																			tindalLanjut3(item.suhu_klem)
																		}
																	</td>
																	<td className="p-4 whitespace-nowrap space-y-2 md:space-x-2">
																		<SecondaryButton onClick={() => {
																			setIsOpen(2)
																			setEditData({
																				instalasi: item.instalasi,
																				arus_nominal: item.arus_nominal,
																				arus_tertinggi: item.arus_tertinggi,
																				arus_shooting: item.arus_shooting,
																				suhu_klem: item.suhu_klem,
																				suhu_konduktor: item.suhu_konduktor,
																				id: item.id
																			})
																		}}>
																			Edit
																		</SecondaryButton>
																		<DangerButton onClick={() => {
																			setIsOpen(3)
																			setEditData({
																				id: item.id,
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
																colSpan="12"
																className="p-4 text-center">
																Tidak ada data
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</article>
								</section>
							</article>
						</div>
					</div>
				</div>
			</div>
			<ModalInput
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				errors={errors}
				setErrors={setErrors}
				id={router.query.id}
				setProcessing={setProcessing}
			/>
			<ModalEdit
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				errors={errors}
				setErrors={setErrors}
				editData={editData}
				laporanId={router.query.id}
				setProcessing={setProcessing}
			/>
			<ModalDelete
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				laporanId={router.query.id}
				id={editData?.id}
				setProcessing={setProcessing}
			/>
			<UploadLaporan
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                id={router.query.id}
				processing={processing}
				setProcessing={setProcessing}
            />
		</AppLayout>
	)
}

export default detail

const ModalInput = ({
	isOpen,
	setIsOpen,
	errors,
	setErrors,
	id,
	setProcessing
}) => {
	const [instalasi, setInstalasi] = useState('')
	const [arusNominal, setArusNominal] = useState('')
	const [arusTertinggi, setArusTertinggi] = useState('')
	const [arusShooting, setArusShooting] = useState('')
	const [suhuKlem, setSuhuKlem] = useState('')
	const [suhuKonduktor, setSuhuKonduktor] = useState('')

	const { storeThermovisi } = useThermovisi()

	const handleSubmit = e => {
		e.preventDefault()

		storeThermovisi({
			setErrors,
			setProcessing,
			id,
			instalasi,
			arus_nominal: arusNominal,
			arus_tertinggi: arusTertinggi,
			arus_shooting: arusShooting,
			suhu_klem: suhuKlem,
			suhu_konduktor: suhuKonduktor,
		})

		setTimeout(() => {
			setIsOpen(0)

			setInstalasi('')
			setArusNominal('')
			setArusTertinggi('')
			setArusShooting('')
			setSuhuKlem('')
			setSuhuKonduktor('')
		}, 3000)
	}

	return (
		<Modal show={isOpen == 1} onClose={() => setIsOpen(0)}>
				<form className="p-6" onSubmit={handleSubmit}>
					<div>
						<Label htmlFor="instalasi">Instalasi</Label>

						<Input
							id="instalasi"
							type="text"
							name="instalasi"
							value={instalasi}
							className="block mt-2 w-full"
							onChange={e => setInstalasi(e.target.value)}
							required
						/>

						<InputError messages={errors?.instalasi} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="arus_nominal">Arus Nominal</Label>

						<Input
							id="arus_nominal"
							type="number"
							name="arus_nominal"
							value={arusNominal}
							className="block mt-2 w-full"
							onChange={e => setArusNominal(e.target.value)}
							required
						/>

						<InputError messages={errors?.arus_nominal} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="arus_tertinggi">Arus Tertinggi</Label>

						<Input
							id="arus_tertinggi"
							type="number"
							name="arus_tertinggi"
							value={arusTertinggi}
							className="block mt-2 w-full"
							onChange={e => setArusTertinggi(e.target.value)}
							required
						/>

						<InputError messages={errors?.arus_tertinggi} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="arus_shooting">Arus Shooting</Label>

						<Input
							id="arus_shooting"
							type="number"
							name="arus_shooting"
							value={arusShooting}
							className="block mt-2 w-full"
							onChange={e => setArusShooting(e.target.value)}
							required
						/>

						<InputError messages={errors?.arus_shooting} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="suhu_klem">Suhu Klem</Label>

						<Input
							id="suhu_klem"
							type="number"
							name="suhu_klem"
							value={suhuKlem}
							className="block mt-2 w-full"
							onChange={e => setSuhuKlem(e.target.value)}
							required
						/>

						<InputError messages={errors?.suhu_klem} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="suhu_konduktor">Suhu Konduktor</Label>

						<Input
							id="suhu_konduktor"
							type="number"
							name="suhu_konduktor"
							value={suhuKonduktor}
							className="block mt-2 w-full"
							onChange={e => setSuhuKonduktor(e.target.value)}
							required
						/>

						<InputError messages={errors?.suhu_konduktor} className="mt-2" />
					</div>
					<div className="mt-4">
						<Button key="submit">
							Submit
						</Button>
					</div>
				</form>
			</Modal>
	)
}

const ModalEdit = ({ isOpen, setIsOpen, errors, setErrors, editData, laporanId, setProcessing }) => {
	const [instalasi, setInstalasi] = useState('')
	const [arusNominal, setArusNominal] = useState('')
	const [arusTertinggi, setArusTertinggi] = useState('')
	const [arusShooting, setArusShooting] = useState('')
	const [suhuKlem, setSuhuKlem] = useState('')
	const [suhuKonduktor, setSuhuKonduktor] = useState('')

	const { updateThermovisi } = useThermovisi()

	const handleSubmit = e => {
		e.preventDefault()

		updateThermovisi({
			id: editData.id,
			laporanId,
			setErrors,
			setProcessing,
			instalasi: instalasi != '' ? instalasi : editData.instalasi,
			arus_nominal: arusNominal != '' ? arusNominal : editData.arus_nominal,
			arus_tertinggi: arusTertinggi != '' ? arusTertinggi : editData.arus_tertinggi,
			arus_shooting: arusShooting != '' ? arusShooting : editData.arus_shooting,
			suhu_klem: suhuKlem != '' ? suhuKlem : editData.suhu_klem,
			suhu_konduktor: suhuKonduktor != '' ? suhuKonduktor : editData.suhu_konduktor,
		})

		setTimeout(() => {
			setIsOpen(0)
		}, 3000)
	}

	return (
		<Modal show={isOpen == 2} onClose={() => setIsOpen(0)}>
			<form className="p-6" onSubmit={handleSubmit}>
					<div>
						<Label htmlFor="instalasi">Instalasi</Label>

						<Input
							id="instalasi"
							type="text"
							name="instalasi"
							defaultValue={editData.instalasi}
							className="block mt-2 w-full"
							onChange={e => setInstalasi(e.target.value)}
							required
						/>

						<InputError messages={errors?.instalasi} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="arus_nominal">Arus Nominal</Label>

						<Input
							id="arus_nominal"
							type="number"
							name="arus_nominal"
							defaultValue={editData?.arus_nominal}
							className="block mt-2 w-full"
							onChange={e => setArusNominal(e.target.value)}
							required
						/>

						<InputError messages={errors?.arus_nominal} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="arus_tertinggi">Arus Tertinggi</Label>

						<Input
							id="arus_tertinggi"
							type="number"
							name="arus_tertinggi"
							defaultValue={editData.arus_tertinggi}
							className="block mt-2 w-full"
							onChange={e => setArusTertinggi(e.target.value)}
							required
						/>

						<InputError messages={errors?.arus_tertinggi} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="arus_shooting">Arus Shooting</Label>

						<Input
							id="arus_shooting"
							type="number"
							name="arus_shooting"
							defaultValue={editData.arus_shooting}
							className="block mt-2 w-full"
							onChange={e => setArusShooting(e.target.value)}
							required
						/>

						<InputError messages={errors?.arus_shooting} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="suhu_klem">Suhu Klem</Label>

						<Input
							id="suhu_klem"
							type="number"
							name="suhu_klem"
							defaultValue={editData.suhu_klem}
							className="block mt-2 w-full"
							onChange={e => setSuhuKlem(e.target.value)}
							required
						/>

						<InputError messages={errors?.suhu_klem} className="mt-2" />
					</div>
					<div className="mt-4">
						<Label htmlFor="suhu_konduktor">Suhu Konduktor</Label>

						<Input
							id="suhu_konduktor"
							type="number"
							name="suhu_konduktor"
							defaultValue={editData.suhu_konduktor}
							className="block mt-2 w-full"
							onChange={e => setSuhuKonduktor(e.target.value)}
							required
						/>

						<InputError messages={errors?.suhu_konduktor} className="mt-2" />
					</div>
					<div className="mt-4">
						<Button key="submit">
							Submit
						</Button>
					</div>
				</form>
		</Modal>
	)
}

const ModalDelete = ({ isOpen, setIsOpen, laporanId, id, setProcessing }) => {
	const { destroyThermovisi } = useThermovisi()

	const handleDelete = e => {
		e.preventDefault()

		destroyThermovisi({
			id,
			laporanId,
			setProcessing
		})

		setTimeout(() => {
			setIsOpen(0)
		}, 3000)
	}

	return (
		<Modal show={isOpen == 3} onClose={() => setIsOpen(0)}>
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
                        onClick={() => setIsOpen(0)}>
                        Batal
                    </SecondaryButton>

                    <DangerButton onClick={handleDelete} className="ml-3">
                        Hapus
                    </DangerButton>
                </div>
            </form>
		</Modal>
	)
}