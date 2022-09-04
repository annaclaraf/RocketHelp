import { useState } from 'react'
import { VStack } from 'native-base'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { db } from '../services/firebase'
import { collection, addDoc, serverTimestamp} from "firebase/firestore";

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function Register() {
    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState(false)
    const [patrimony, setPatrimony] = useState('')
    const [description, setDescription] = useState('')

    async function handleNewOrderRegister() {
        if( !patrimony || !description ) {
            return Alert.alert('Registrar', 'Preencha todos os campos')
        }

        setIsLoading(true)

        await addDoc(collection(db, 'orders'), {
            patrimony, 
            description,
            status: 'open',
            created_at: serverTimestamp()
        }).then(() => {
            Alert.alert('Solicitação', 'Solicitação registrada com sucesso!')
            navigation.goBack()
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
            return Alert.alert('Solicitação', 'Erro ao registrar solicitação')
        })
    }

    return (
        <VStack flex={1} p={6} bg="gray.600" >
            <Header title="Nova Solicitação" />

            <Input 
                placeholder="Número do patrimônio"
                mt={4}
                onChangeText={setPatrimony}
            />

            <Input 
                placeholder="Descrição do problema"
                textAlignVertical="top"
                flex={1}
                mt={5}
                onChangeText={setDescription}
                multiline
            />

            <Button title="Cadastrar" mt={5} isLoading={isLoading} onPress={handleNewOrderRegister} />
        </VStack>
    )
}