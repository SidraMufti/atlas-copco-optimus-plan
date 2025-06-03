
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, TrendingUp, DollarSign, Clock, Target } from 'lucide-react';

const CostAnalysis = () => {
  const [analysisType, setAnalysisType] = useState('monthly');
  const [comparisonMode, setComparisonMode] = useState('strategies');

  // Sample cost data
  const monthlyCosts = [
    { month: 'Jan', machineTime: 45000, tooling: 8500, setup: 12000, material: 25000, total: 90500 },
    { month: 'Feb', machineTime: 48000, tooling: 9200, setup: 11500, material: 27000, total: 95700 },
    { month: 'Mar', machineTime: 42000, tooling: 7800, setup: 13000, material: 23500, total: 86300 },
    { month: 'Apr', machineTime: 52000, tooling: 9800, setup: 10500, material: 29000, total: 101300 },
    { month: 'May', machineTime: 46500, tooling: 8900, setup: 11800, material: 26500, total: 93700 },
    { month: 'Jun', machineTime: 49000, tooling: 9100, setup: 10200, material: 28000, total: 96300 }
  ];

  const strategyComparison = [
    {
      strategy: 'Current Optimized',
      setupCost: 25600,
      machineCost: 185000,
      toolingCost: 32000,
      totalCost: 242600,
      efficiency: 92.4,
      savings: 0
    },
    {
      strategy: 'Fixed Lot Size',
      setupCost: 38500,
      machineCost: 198000,
      toolingCost: 35000,
      totalCost: 271500,
      efficiency: 87.1,
      savings: -28900
    },
    {
      strategy: 'Single Machine',
      setupCost: 42000,
      machineCost: 210000,
      toolingCost: 38000,
      totalCost: 290000,
      efficiency: 84.2,
      savings: -47400
    },
    {
      strategy: 'Minimum Setup',
      setupCost: 18500,
      machineCost: 175000,
      toolingCost: 30000,
      totalCost: 223500,
      efficiency: 94.8,
      savings: 19100
    }
  ];

  const costBreakdown = [
    { name: 'Machine Time', value: 185000, color: '#3b82f6' },
    { name: 'Setup', value: 25600, color: '#ef4444' },
    { name: 'Tooling', value: 32000, color: '#10b981' },
    { name: 'Material', value: 156000, color: '#f59e0b' }
  ];

  const kpis = [
    {
      title: 'Cost per Unit',
      current: '$12.85',
      previous: '$14.20',
      change: -9.5,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Setup Cost Ratio',
      current: '10.5%',
      previous: '15.2%',
      change: -4.7,
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Machine Utilization',
      current: '89.2%',
      previous: '84.1%',
      change: 5.1,
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Cost Variance',
      current: '2.1%',
      previous: '8.7%',
      change: -6.6,
      icon: TrendingDown,
      color: 'text-green-600'
    }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Cost Analysis & Optimization</CardTitle>
            <div className="flex space-x-4">
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button>Generate Report</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => (
              <Card key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.current}</p>
                      <div className="flex items-center space-x-1">
                        {kpi.change < 0 ? (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm ${kpi.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(kpi.change)}% vs last period
                        </span>
                      </div>
                    </div>
                    <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList>
              <TabsTrigger value="trends">Cost Trends</TabsTrigger>
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="comparison">Strategy Comparison</TabsTrigger>
              <TabsTrigger value="optimization">Optimization Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Monthly Cost Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyCosts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} name="Total Cost" />
                      <Line type="monotone" dataKey="machineTime" stroke="#10b981" strokeWidth={2} name="Machine Time" />
                      <Line type="monotone" dataKey="setup" stroke="#ef4444" strokeWidth={2} name="Setup Cost" />
                      <Line type="monotone" dataKey="tooling" stroke="#f59e0b" strokeWidth={2} name="Tooling Cost" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Cost Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyCosts.slice(-3)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="machineTime" stackId="a" fill="#3b82f6" name="Machine Time" />
                        <Bar dataKey="setup" stackId="a" fill="#ef4444" name="Setup" />
                        <Bar dataKey="tooling" stackId="a" fill="#10b981" name="Tooling" />
                        <Bar dataKey="material" stackId="a" fill="#f59e0b" name="Material" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Cost Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={costBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {costBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Production Strategy Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-semibold">Strategy</th>
                          <th className="text-left p-4 font-semibold">Setup Cost</th>
                          <th className="text-left p-4 font-semibold">Machine Cost</th>
                          <th className="text-left p-4 font-semibold">Tooling Cost</th>
                          <th className="text-left p-4 font-semibold">Total Cost</th>
                          <th className="text-left p-4 font-semibold">Efficiency</th>
                          <th className="text-left p-4 font-semibold">Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strategyComparison.map((strategy, index) => (
                          <tr key={index} className={`border-t ${index === 0 ? 'bg-blue-50' : ''}`}>
                            <td className="p-4 font-medium">{strategy.strategy}</td>
                            <td className="p-4">${strategy.setupCost.toLocaleString()}</td>
                            <td className="p-4">${strategy.machineCost.toLocaleString()}</td>
                            <td className="p-4">${strategy.toolingCost.toLocaleString()}</td>
                            <td className="p-4 font-semibold">${strategy.totalCost.toLocaleString()}</td>
                            <td className="p-4">{strategy.efficiency}%</td>
                            <td className="p-4">
                              <span className={strategy.savings >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {strategy.savings >= 0 ? '+' : ''}${strategy.savings.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Best Performing Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-green-900 mb-2">Minimum Setup Strategy</h3>
                    <div className="space-y-2 text-green-800">
                      <p><span className="font-semibold">Annual Savings:</span> $229,200</p>
                      <p><span className="font-semibold">Efficiency Gain:</span> +2.4%</p>
                      <p><span className="font-semibold">Setup Reduction:</span> -27.7%</p>
                      <p><span className="font-semibold">ROI:</span> 312%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Implementation Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Cost Reduction:</span>
                        <span className="font-semibold text-green-600">-7.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Savings:</span>
                        <span className="font-semibold text-blue-600">145 hours/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Improvement:</span>
                        <span className="font-semibold text-green-600">+2.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payback Period:</span>
                        <span className="font-semibold">3.2 months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Optimization Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <h4 className="font-semibold text-green-900">High Impact - Low Effort</h4>
                      <p className="text-green-800 text-sm mt-1">Optimize tool change sequences</p>
                      <p className="text-green-600 text-xs">Potential savings: $15,000/month</p>
                    </div>
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-semibold text-blue-900">Medium Impact - Medium Effort</h4>
                      <p className="text-blue-800 text-sm mt-1">Implement dynamic lot sizing</p>
                      <p className="text-blue-600 text-xs">Potential savings: $22,000/month</p>
                    </div>
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <h4 className="font-semibold text-yellow-900">High Impact - High Effort</h4>
                      <p className="text-yellow-800 text-sm mt-1">Invest in additional machine capacity</p>
                      <p className="text-yellow-600 text-xs">Potential savings: $45,000/month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Immediate (This Week)</p>
                        <p className="text-sm text-gray-600">Reduce setup time for ATL-2043 by grouping similar operations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Short Term (This Month)</p>
                        <p className="text-sm text-gray-600">Implement AI-driven demand forecasting for better lot sizing</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Long Term (This Quarter)</p>
                        <p className="text-sm text-gray-600">Evaluate ROI for additional CNC machine investment</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Create Action Plan</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostAnalysis;
