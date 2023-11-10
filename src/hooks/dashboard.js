import { useRouter } from 'next/router'
import { useAuth } from './auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'

const useDashboard = ({ middleware, redirectIfAuthenticated } = {}) => {
    const { logout } = useAuth()
    const router = useRouter()

    const { data: dashboard, error, mutate } = useSWR('/api/dashboard', () =>
        axios
            .get('/api/dashboard')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && dashboard)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            dashboard?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [dashboard, error])

    return {
        dashboard,
        mutate,
    }
}

export default useDashboard
