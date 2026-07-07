import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'JAN',
        TotalUser: 4000,
        TotalSales: 2400,
        amt: 2400,
    },
    {
        name: 'FEB',
        TotalUser: 3000,
        TotalSales: 1398,
        amt: 2210,
    },
    {
        name: 'MARCH',
        TotalUser: 2000,
        TotalSales: 9800,
        amt: 2290,
    },
    {
        name: 'APRIL',
        TotalUser: 2780,
        TotalSales: 3908,
        amt: 2000,
    },
    {
        name: 'MAY',
        TotalUser: 1890,
        TotalSales: 4800,
        amt: 2181,
    },
    {
        name: 'JUNE',
        TotalUser: 2390,
        TotalSales: 3800,
        amt: 2500,
    },
    {
        name: 'JULY',
        TotalUser: 3490,
        TotalSales: 4300,
        amt: 2100,
    },
    {
        name: 'AUG',
        TotalUser: 2490,
        TotalSales: 4900,
        amt: 2100,
    },
    {
        name: 'SEP',
        TotalUser: 5490,
        TotalSales: 3300,
        amt: 2100,
    },
    {
        name: 'OCT',
        TotalUser: 4490,
        TotalSales: 8300,
        amt: 2100,
    },
    {
        name: 'NOV',
        TotalUser: 3520,
        TotalSales: 6300,
        amt: 2100,
    },
    {
        name: 'DEC',
        TotalUser: 7490,
        TotalSales: 9300,
        amt: 2100,
    },
];

const Salechart = () => {
  const blockedRoles = ["shopkeeper", "guest"];
  const userRole = localStorage.getItem("name");

if (!blockedRoles.includes(userRole)) {
    return (
        <div className="m-3 border-2 border-black border-opacity-10 rounded-lg">
            <div className="p-3 block">
                <h3 className='flex items-center justify-start'><p className='bg-green-400 m-1 rounded-full h-2 w-2'></p>Total User</h3>
                <h3 className='flex items-center justify-start'><p className='bg-blue-400 m-1 rounded-full h-2 w-2'></p>Total Sales</h3>
            </div>
            <div className="flex items-center justify-center">
                <LineChart
                    width={1000}
                    height={500}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke='none'/>
                    <XAxis dataKey="name" tick={{fontSize :12}}/>
                    <YAxis tick={{fontSize :12}} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="TotalSales" strokeWidth={3} stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="TotalUser" strokeWidth={3} stroke="#82ca9d" />
                </LineChart>
            </div>
        </div>
    );
}
}

export default Salechart;
