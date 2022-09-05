import { useState, useEffect } from 'react'
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base'
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import { Alert } from 'react-native'
import { db } from '../services/firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRoute, useNavigation } from '@react-navigation/native'

import { dateFormat } from '../utils/firestoreDateFormat'

import { Header } from '../components/Header'
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';

type RouteParams = {
    orderId: string
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const navigation = useNavigation();
    const route = useRoute()
    const { orderId } = route.params as RouteParams
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Solicitação', 'Informa a solução para encerrar a solicitação');
        }

        const docRef = doc(db, "orders", orderId);
        const data = {
            status: 'closed',
            solution,
            closed_at: serverTimestamp()
        }
        updateDoc(docRef, data).then(() => {
            Alert.alert('Solicitação', 'Solicitação encerrada.');
            navigation.goBack();
        }).catch((error) => {
            console.log(error);
            Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação');
        });
    }

    useEffect(() => {
        const docRef = doc(db, "orders", orderId);
        getDoc(docRef).then((doc) => {
            const { patrimony, description, status, created_at, closed_at, solution } = doc.data();

            const closed = closed_at ? dateFormat(closed_at) : null;

            setOrder({
                id: doc.id,
                patrimony,
                description,
                status,
                solution,
                when: dateFormat(created_at),
                closed
            });

            setIsLoading(false);
        })
    }, []);

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700" >
            <Box px={6} bg="gray.600">
                <Header title="Solicitação" />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="equipamento"
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}
                />

                <CardDetails
                    title="descrição do problema"
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}
                />

                <CardDetails
                    title="solução"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        order.status === 'open' &&
                        <Input
                            placeholder="Descrição da solução"
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }
                </CardDetails>
            </ScrollView>

            {
                order.status === 'open' &&
                <Button
                    title="Encerrar solicitação"
                    onPress={handleOrderClose}
                    m={5}
                />
            }
        </VStack>
    )
}