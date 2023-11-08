import { useRouter } from 'next/router'
import { useAuth } from './auth'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import useSWR from 'swr'

const useFileManager = ({
    middleware,
    redirectIfAuthenticated,
    id,
    cursorPaginate,
} = {}) => {
    const { logout } = useAuth()
    const router = useRouter()

    const { data: images, error, mutate } = useSWR(
        '/api/file-manager/' + id + '?cursor=' + cursorPaginate,
        () =>
            axios
                .get('/api/file-manager/' + id, {
                    params: {
                        cursor: cursorPaginate,
                    },
                })
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/verify-email')
                }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const storeData = async ({ setStatus, setErrors, ...props }) => {
        await csrf()

        setErrors([])

        const formData = new FormData()
        props.data.map(item => {
            formData.append('file[]', item)
        })

        axios
            .post('/api/file-manager/' + props.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(res => {
                setErrors(res.data.status)
                setStatus(res.data.message)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const destroyData = async ({ id }) => {
        await csrf()

        axios
            .delete('/api/file-manager/' + id)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated)
            router.push(redirectIfAuthenticated)
        if (window.location.pathname === '/verify-email')
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [images, error])

    return {
        images,
        storeData,
        destroyData,
    }
}

export default useFileManager
