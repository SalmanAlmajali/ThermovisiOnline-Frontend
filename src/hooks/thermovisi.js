import axios from '@/lib/axios'
import useLaporan from './laporan'

const useThermovisi = () => {
    const { getDetail } = useLaporan()

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const storeThermovisi = async ({
        setErrors,
        setProcessing,
        id,
        ...props
    }) => {
        await csrf()

        setErrors([])

        axios
            .post('/api/thermovisi/' + id, props)
            .then(res => {
                if (res.status == 201) setProcessing(true)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const updateThermovisi = async ({
        setErrors,
        laporanId,
        id,
        setProcessing,
        ...props
    }) => {
        await csrf()

        setErrors([])

        axios
            .put(`${'/api/thermovisi'}/${laporanId}/${id}`, props)
            .then(res => {
                if (res.status == 201) setProcessing(true)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const destroyThermovisi = async ({
        laporanId,
        id,
        setProcessing,
        ...props
    }) => {
        await csrf()

        axios
            .delete(`${'/api/thermovisi'}/${laporanId}/${id}`, props)
            .then(res => {
                if (res.status == 200) setProcessing(true)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }

    return {
        storeThermovisi,
        getDetail,
        updateThermovisi,
        destroyThermovisi,
    }
}

export default useThermovisi
