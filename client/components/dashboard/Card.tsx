import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface DashboardCardProps {
    title: string;
    icon?: React.ReactNode;
    data: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, data }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data}</div>
                {/* <p className="text-xs text-muted-foreground">-2 from last month</p> */}
            </CardContent>
        </Card>
    )
}

export default DashboardCard