import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import { useAuth } from './auth'

const useProfile = ({ middleware, redirectIfAuthenticated } = {}) => {
    const { logout } = useAuth()
    const router = useRouter()

    const { data: profil, error, mutate, isLoading: loading } = useSWR(
        '/api/profile',
        () =>
            axios
                .get('/api/profile')
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/verify-email')
                }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const updateProfile = async ({ setStatus, setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .put('/api/profile/update', props)
            .then(res => {
                setStatus(res.data.message)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const updatePassword = async ({ setStatus, setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .put('/api/profile/update/password', props)
            .then(res => {
                setStatus(res.data.message)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const deleteUser = async ({ setStatus, setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/api/profile/destroy', props)
            .then(res => {
                setStatus(res.data.message)
                router.push('/login')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && profil)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            profil?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [profil, error])

    return {
        profil,
        loading,
        updateProfile,
        updatePassword,
        deleteUser,
    }
}

export default useProfile
