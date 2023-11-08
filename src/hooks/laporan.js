import { useRouter } from 'next/router'
import { useAuth } from './auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'

const useLaporan = ({ middleware, redirectIfAuthenticated } = {}) => {
    const { logout } = useAuth()
    const router = useRouter()

    const { data: laporan, error, mutate, isLoading: loading } = useSWR(
        '/api/laporan',
        () =>
            axios
                .get('/api/laporan')
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/verify-email')
                }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const storeLaporan = async ({ setStatus, setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/api/laporan', props)
            .then(res => {
                setStatus(res.data.message)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const getDetail = async ({ setLaporan, setErrors, id }) => {
        await axios
            .get(`/api/laporan/detail/${id}`)
            .then(res => {
                setLaporan(res.data)
                setErrors({})
            })
            .catch(error => {
                if (error.response.status !== 404) throw error

                setErrors(error.response.data)
            })
    }

    const updateLaporan = async ({ setStatus, setErrors, id, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .put(`${'/api/laporan'}/${id}`, props)
            .then(res => {
                setStatus(res.data.message)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const destroyLaporan = async ({ id, ...props }) => {
        await csrf()

        axios
            .delete(`${'/api/laporan'}/${id}`, props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }

    const uploadImport = async ({ setStatus, setErrors, id, ...props }) => {
        await csrf()

        setErrors([])

        const formData = new FormData()
        formData.append('file', props.file)

        axios
            .post(`${'/api/laporan/upload'}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(res => {
                setStatus(res.data.message)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && laporan)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            laporan?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [laporan, error])

    return {
        laporan,
        loading,
        storeLaporan,
        getDetail,
        updateLaporan,
        destroyLaporan,
        uploadImport,
    }
}

export default useLaporan
