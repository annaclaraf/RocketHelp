import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { auth } from '../services/firebase'
import { User} from "firebase/auth";

import { Loading } from '../components/Loading'
import { SignIn } from '../screens/SignIn'
import { AppRoutes } from './app.routes'

export function Routes() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged((response) => {setUser(response); setLoading(false)})

        return subscriber
    }, [])


    if(loading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            { user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}