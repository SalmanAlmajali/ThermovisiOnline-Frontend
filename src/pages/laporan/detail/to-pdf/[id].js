/* eslint-disable prettier/prettier */
import Button from '@/components/Button'
import useLaporan from '@/hooks/laporan'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import generatePDF, { Margin, Resolution } from 'react-to-pdf'

const toPdf = () => {
	const router = useRouter()

	const [errors, setErrors] = useState([])
	const [laporan, setLaporan] = useState(null)

	const { getDetail } = useLaporan()

	const tindakLanjut1 = data => {
		var hasil = null

		if (Math.floor(data) > 70) {
			hasil = <p className="text-red-500">KONDISI DARURAT</p>
		} else if (Math.floor(data) <= 70 && Math.floor(data) > 40) {
			hasil = <p className="text-red-500">PERBAIKAN SEGERA</p>
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
			hasil = <p className="text-red-500">PERBAIKAN SEGERA</p>
		}

		return hasil
	}

	const tindalLanjut3 = (data) => {
		var hasil = null

		if (Math.floor(data) > 69) {
			hasil = <p className="text-red-500">KONDISI DARURAT</p>
		} else if (Math.floor(data) < 69 && Math.floor(data) > 40) {
			hasil = <p className="text-red-500">PERBAIKAN SEGERA</p>
		} else {
			hasil = 'KONDISI BAIK'
		}

		return hasil
	}

	const pdfRef = useRef()

	const options = {
		// filename: laporan?.data?.lokasi,
		method: 'open',
		// default is Resolution.MEDIUM = 3, which should be enough, higher values
		// increases the image quality but also the size of the PDF, so be careful
		// using values higher than 10 when having multiple pages generated, it
		// might cause the page to crash or hang.
		resolution: Resolution.MEDIUM,
		page: {
		   // margin is in MM, default is Margin.NONE = 0
		   margin: Margin.SMALL,
		   // default is 'A4'
		   format: 'A4',
		   // default is 'portrait'
		   orientation: 'landscape',
		},
		canvas: {
		   // default is 'image/jpeg' for better size performance
		   mimeType: 'image/png',
		   qualityRatio: 1
		},
		// Customize any value passed to the jsPDF instance and html2canvas
		// function. You probably will not need this and things can break, 
		// so use with caution.
		// overrides: {
		//    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
		//    pdf: {
		// 	  compress: true
		//    },
		//    // see https://html2canvas.hertzen.com/configuration for more options
		//    canvas: {
		// 	  useCORS: true
		//    }
		// },
	 }

	useEffect(() => {
		if (typeof router.query.id != 'undefined') {
			getDetail({
				id: router.query.id,
				setErrors,
				setLaporan,
			})
		}
	}, [router.query.id])

	return (
		<main className="p-2">
			<Head>
				<title>Laporan Thermovisi {laporan?.data?.lokasi}</title>
			</Head>

			<section className="print:hidden">
				{
					laporan != null && <Button onClick={() => window.print()}>Save as PDF</Button>
				}
			</section>
			<div ref={pdfRef}>
				<section className="text-center">
					<h1 className="font-bold text-xl uppercase mb-4">Laporan Thermovisi {laporan?.data?.lokasi}</h1>
				</section>
				<section>
					<table>
						<thead>
							<tr>
								<th className="border p-1 border-black" rowSpan="6">
									No.
								</th>
								<th
									className="border p-1 border-black w-[20em]"
									rowSpan="6">
									Instalasi
								</th>
								<th className="border p-1 border-black" rowSpan="6">
									Arus Nominal (A)
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Arus Tertinggi Yang Pernah Tercapai
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Arus Pada Saat Shooting
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Suhu Klem / Terminal Saat Shooting
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Suhu Konduktor / Kabel Saat Shooting
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Selisih Suhu Klem Terhadap Konduktor Delta Tm
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Selisih Antar Fasa (yang digunakan suhu saat shooting)
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Tindak Lanjut Selisih Klem Terhadap Konduktor
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Tindak Lanjut Selisih Antar Fasa &lt; 15&deg;C
								</th>
								<th className="border p-1 border-black" rowSpan="4">
									Tindak Lanjut Suhu Klem / Konduktor Saat Shooting &gt;
									40 &deg;C
								</th>
							</tr>
							<tr />
							<tr />
							<tr />
							<tr>
								<th className="border p-1 border-black">
									Im<sup>2</sup> ( A )
								</th>
								<th className="border p-1 border-black">
									Is<sup>2</sup> ( A )
								</th>
								<th className="border p-1 border-black">
									Tkls ( CO&deg; )
								</th>
								<th className="border p-1 border-black">
									Tkds ( CO&deg; )
								</th>
								<th className="border p-1 border-black">( CO&deg; )</th>
								<th className="border p-1 border-black" />
								<th className="border p-1 border-black">( CO&deg; )</th>
								<th className="border p-1 border-black">( CO&deg; )</th>
								<th className="border p-1 border-black">( CO&deg; )</th>
							</tr>
							<tr>
								<th className="border p-1 border-black">a</th>
								<th className="border p-1 border-black">b</th>
								<th className="border p-1 border-black">c</th>
								<th className="border p-1 border-black">d</th>
								<th className="border p-1 border-black">e=(a2/b2)x(c-d)</th>
								<th className="border p-1 border-black">f</th>
								<th className="border p-1 border-black">g</th>
								<th className="border p-1 border-black">h</th>
								<th className="border p-1 border-black">i</th>
							</tr>
						</thead>
						<tbody>
							{laporan?.thermovisis?.map((item, index) => {
								const lastItem =
									index == laporan?.thermovisis?.length - 1
								return (
									<tr key={index}>
										<td className="border p-1 border-black text-center font-bold">
											{index + 1}
										</td>
										<td className="border p-1 border-black font-bold line-clamp-2">
											{item.instalasi}
										</td>
										<td className="border p-1 border-black font-bold text-center">
											{item.arus_nominal}
										</td>
										<td className="border p-1 border-black font-bold text-center">
											{item.arus_tertinggi}
										</td>
										<td className="border p-1 border-black font-bold text-center">
											{item.arus_shooting}
										</td>
										<td className="border p-1 border-black font-bold text-center">
											{item.suhu_klem}
										</td>
										<td className="border p-1 border-black font-bold text-center">
											{item.suhu_konduktor}
										</td>
										<td className="border p-1 border-black font-bold text-center bg-[#92D050]">
											{item.arus_shooting >= 1
												? Math.floor(
													((item.arus_tertinggi *
														item.arus_tertinggi) /
														(item.arus_shooting *
															item.arus_shooting)) *
													(item.suhu_klem -
														item.suhu_konduktor),
												)
												: 0}
										</td>
										<td className="border p-1 border-black font-bold text-center bg-[#FFC000]">
											{laporan?.thermovisis?.length == 1
												? Math.floor(item.suhu_klem)
												: lastItem
													? Math.floor(
														item.suhu_klem -
														laporan?.thermovisis[
															index - 2
														]?.suhu_klem,
													)
													: Math.floor(
														item.suhu_klem -
														laporan?.thermovisis[
															index + 1
														]?.suhu_klem,
													)}
										</td>
										<td className="border p-1 border-black font-bold text-center bg-[#92D050]">
											{tindakLanjut1(
												item.arus_shooting >= 1
													? ((item.arus_tertinggi *
														item.arus_tertinggi) /
														(item.arus_shooting *
															item.arus_shooting)) *
													(item.suhu_klem -
														item.suhu_konduktor)
													: 0,
											)}
										</td>
										<td className="border p-1 border-black font-bold text-center bg-[#FFC000]">
											{
												laporan?.thermovisis?.length != 1 ? (
													lastItem ? (
														tindalLanjut2(item.suhu_klem - laporan?.thermovisis[index - 2]?.suhu_klem)
													) : (
														tindalLanjut2(item.suhu_klem - laporan?.thermovisis[index + 1]?.suhu_klem)
													)
												) : (
													tindalLanjut2(item.suhu_klem)
												)
											}
										</td>
										<td className="border p-1 border-black font-bold text-center bg-[#B7DEE8]">
											{
												tindalLanjut3(item.suhu_klem)
											}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</section>
			</div>
		</main>
	)
}

export default toPdf
