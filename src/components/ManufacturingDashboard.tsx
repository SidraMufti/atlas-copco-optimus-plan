
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import DemandForecast from './DemandForecast';
import ProductionPlanner from './ProductionPlanner';
import MachineManagement from './MachineManagement';
import CostAnalysis from './CostAnalysis';

const ManufacturingDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample KPI data
  const kpis = [
    { title: 'Production Efficiency', value: '92.4%', trend: '+2.1%', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Total Cost per Hour', value: '$485', trend: '-5.2%', icon: DollarSign, color: 'text-blue-600' },
    { title: 'Average Setup Time', value: '18.5 min', trend: '-12%', icon: Clock, color: 'text-orange-600' },
    { title: 'Stock Outage Risk', value: '3 items', trend: '+1', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const recentAlerts = [
    { type: 'warning', message: 'Item ATL-2043 predicted stockout in 5 days' },
    { type: 'info', message: 'Machine M-003 scheduled for tool change' },
    { type: 'success', message: 'Production efficiency target exceeded' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Atlas Copco Manufacturing Intelligence</h1>
          <p className="text-gray-600">AI-Powered Production Planning & Forecasting System</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
            <TabsTrigger value="planning">Production Planning</TabsTrigger>
            <TabsTrigger value="machines">Machine Management</TabsTrigger>
            <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        <p className={`text-sm ${kpi.color}`}>{kpi.trend} from last month</p>
                      </div>
                      <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Alerts and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <Badge variant={alert.type === 'warning' ? 'destructive' : alert.type === 'info' ? 'default' : 'secondary'}>
                        {alert.type}
                      </Badge>
                      <p className="text-sm text-gray-700 flex-1">{alert.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" onClick={() => setActiveTab('planning')}>
                    Generate Production Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('forecast')}>
                    Update Demand Forecast
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('analysis')}>
                    Run Cost Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecast">
            <DemandForecast />
          </TabsContent>

          <TabsContent value="planning">
            <ProductionPlanner />
          </TabsContent>

          <TabsContent value="machines">
            <MachineManagement />
          </TabsContent>

          <TabsContent value="analysis">
            <CostAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManufacturingDashboard;
