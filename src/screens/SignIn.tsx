import { useState } from 'react'
import { Alert } from 'react-native'
import { VStack, Heading, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'

import { auth } from '../services/firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

import Logo from '../assets/logo_primary.svg'

import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { colors } = useTheme()

    async function handleSignIn() {
        if(!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha.')
        }

        setIsLoading(true)

        await signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {

            console.log(error)
            setIsLoading(false)

            if(error.code === "auth/wrong-password" || error.code === "auth/invalid-email") {
                return Alert.alert('Entrar', 'Email ou senha inválida.')
            }
            
            if(error.code === "auth/user-not-found" ) {
                return Alert.alert('Entrar', 'Usuário não encontrado.')
            }

            return Alert.alert('Entrar', 'Erro na autenticação.')
        });
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />
            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input 
                mb={4}
                placeholder="E-mail" 
                InputLeftElement={<Icon as={ <Envelope color={colors.gray[300]} /> }  ml={4} />} 
                onChangeText={setEmail}
            />
            <Input 
                mb={8}
                placeholder="Senha" 
                InputLeftElement={<Icon as={ <Key color={colors.gray[300]} /> }  ml={4} />}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Entrar" w="full" isLoading={isLoading} onPress={handleSignIn} />
        </VStack>
    )
}