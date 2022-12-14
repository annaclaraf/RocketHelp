import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { VStack, HStack, Heading, IconButton, Text, useTheme, FlatList, Center } from 'native-base'
import { SignOut, ChatTeardropText } from 'phosphor-react-native'
import { auth, db } from '../services/firebase'
import { collection, where, query, onSnapshot } from 'firebase/firestore'
import { Alert } from 'react-native'

import { dateFormat } from '../utils/firestoreDateFormat'

import Logo from '../assets/logo_secondary.svg'
import { Loading } from '../components/Loading'
import { Filter } from '../components/Filter'
import { Order, OrderProps } from '../components/Order'
import { Button } from '../components/Button'

export function Home() {
    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState(true)
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [orders, setOrders] = useState<OrderProps[]>([])

    const { colors } = useTheme()

    function handleNewOrder() {
        navigation.navigate('register')
    }

    function handleOpenDetails( orderId: string ) {
        navigation.navigate('details', {orderId})
    }

    function handleLogout() {
        auth.signOut().catch((error) => {
            console.log(error)
            return Alert.alert('Sair', 'Erro ao sair')
        })
    }

    useEffect(() => {
        setIsLoading(true)
     
        const q = query(collection(db, "orders"), where("status", "==", statusSelected));
        const subscriber = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const { patrimony, description, status, created_at } = doc.data()
                data.push({
                    id: doc.id,
                    patrimony, 
                    description, 
                    status, 
                    when: dateFormat(created_at)
                })
            });
            setOrders(data)
            setIsLoading(false)
        });

        return subscriber
    }, [statusSelected])

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />

                <IconButton icon={ <SignOut size={26} color={colors.gray[300]} /> } onPress={handleLogout} />

            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">Solicita????es</Heading>
                    <Text color="gray.200">{orders.length}</Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter type="open" title="em andamento" onPress={() => setStatusSelected('open')} isActive={statusSelected === "open"} />
                    <Filter type="closed" title="finalizados" onPress={() => setStatusSelected('closed')} isActive={statusSelected === "closed"} />
                </HStack>

                { isLoading ? <Loading /> :
                    <FlatList 
                        data={orders} 
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={40} />

                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Voc?? ainda n??o possui {"\n"}
                                    solicita????es {statusSelected === 'open' ? "em andamento" : "finalizadas"} 
                                </Text>
                            </Center>
                        )}
                    />                   
                }

                <Button title="Nova Solicita????o" onPress={handleNewOrder} />
            </VStack>
        </VStack>
    )
}