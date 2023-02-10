import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
const { VITE_STATE_COIN_MARKET_DATA, VITE_STATE_COIN_CONTRACT_ADDRESS } = import.meta.env;

const WalletChart = (props: any) => {
    const [chartData, setChartData] = useState<any>({})

    useEffect(() => {
        fetchChartData()
    }, [])

    const fetchChartData = () => {
        fetch(`${VITE_STATE_COIN_MARKET_DATA}${VITE_STATE_COIN_CONTRACT_ADDRESS}`, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }).then((result) => {
            result
                .json()
                .then((response) => {
                    setChartData(response?.market_data)
                })
                .finally(() => console.log("error"));
        })
            .catch(() => {
                // console.log("error");
            });
    }
    const data = [
        { title: '0', value: 0 },
        { title: '1h', value: chartData?.price_change_percentage_1h_in_currency?.usd },
        { title: '24h', value: chartData?.price_change_percentage_24h_in_currency?.usd },
        { title: '7d', value: chartData?.price_change_percentage_7d_in_currency?.usd },
        { title: '14d', value: chartData?.price_change_percentage_14d_in_currency?.usd },
        { title: '30d', value: chartData?.price_change_percentage_30d_in_currency?.usd },
        { title: '60d', value: chartData?.price_change_percentage_60d_in_currency?.usd },
    ];
    return (
        <div className='w-[60%] h-fit p-5 flex justify-center flex-col items-center ' >
            <ResponsiveContainer
                height={500}
                minWidth={200}
            >
                <LineChart data={data}>
                    <Tooltip />
                    <CartesianGrid horizontal={false} stroke="#d7d7d7" />
                    <XAxis dataKey="title" interval={"preserveStartEnd"} />
                    <YAxis dataKey="value" />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="black"
                    />
                    <Line
                        dataKey="title"
                        type="monotone"
                        stroke="black"
                    />
                </LineChart>
            </ResponsiveContainer>
            <span className='text-xl pt-4 font-bold ' >STATE Coin Market Data(in Percentage)</span>
        </div>
    );
}
export default WalletChart