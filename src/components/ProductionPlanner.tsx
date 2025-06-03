
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Play, Settings, Clock, DollarSign } from 'lucide-react';

const ProductionPlanner = () => {
  const [optimizationMode, setOptimizationMode] = useState('cost');
  const [lotSizeStrategy, setLotSizeStrategy] = useState('variable');
  const [planningHorizon, setPlanningHorizon] = useState('4');

  // Sample production data
  const items = [
    {
      itemNumber: 'ATL-2043',
      demand: 1380,
      currentStock: 450,
      requiredProduction: 930,
      turningTime: 12.5, // minutes per piece
      setupTime: 45, // minutes
      toolsRequired: ['T-001', 'T-003', 'T-007'],
      preferredMachine: 'M-001',
      priority: 'High'
    },
    {
      itemNumber: 'ATL-1875',
      demand: 920,
      currentStock: 280,
      requiredProduction: 640,
      turningTime: 8.2,
      setupTime: 30,
      toolsRequired: ['T-002', 'T-004', 'T-008'],
      preferredMachine: 'M-002',
      priority: 'Medium'
    },
    {
      itemNumber: 'ATL-3021',
      demand: 650,
      currentStock: 120,
      requiredProduction: 530,
      turningTime: 15.8,
      setupTime: 60,
      toolsRequired: ['T-001', 'T-005', 'T-009'],
      preferredMachine: 'M-001',
      priority: 'Low'
    }
  ];

  const machines = [
    {
      id: 'M-001',
      name: 'CNC Lathe 1',
      costPerHour: 85,
      magazineCapacity: 12,
      availableTools: ['T-001', 'T-003', 'T-005', 'T-007', 'T-009'],
      efficiency: 0.92
    },
    {
      id: 'M-002',
      name: 'CNC Lathe 2',
      costPerHour: 78,
      magazineCapacity: 8,
      availableTools: ['T-002', 'T-004', 'T-006', 'T-008'],
      efficiency: 0.88
    },
    {
      id: 'M-003',
      name: 'CNC Lathe 3',
      costPerHour: 92,
      magazineCapacity: 16,
      availableTools: ['T-001', 'T-002', 'T-003', 'T-004', 'T-005', 'T-006'],
      efficiency: 0.95
    }
  ];

  // Production optimization algorithm
  const optimizedPlan = useMemo(() => {
    const plan = items.map(item => {
      const availableMachines = machines.filter(machine => 
        item.toolsRequired.every(tool => machine.availableTools.includes(tool))
      );

      let selectedMachine = availableMachines[0];
      if (optimizationMode === 'cost') {
        selectedMachine = availableMachines.reduce((best, current) => 
          current.costPerHour < best.costPerHour ? current : best
        );
      } else if (optimizationMode === 'time') {
        selectedMachine = availableMachines.reduce((best, current) => 
          current.efficiency > best.efficiency ? current : best
        );
      }

      const lotSize = lotSizeStrategy === 'variable' 
        ? Math.ceil(item.requiredProduction / 3) // Dynamic lot sizing
        : 100; // Fixed lot size

      const totalTime = (item.requiredProduction / lotSize) * item.setupTime + 
                       item.requiredProduction * item.turningTime;
      const totalCost = (totalTime / 60) * selectedMachine.costPerHour;
      const numberOfBatches = Math.ceil(item.requiredProduction / lotSize);

      return {
        ...item,
        selectedMachine: selectedMachine.id,
        machineName: selectedMachine.name,
        lotSize,
        numberOfBatches,
        totalTime: Math.round(totalTime),
        totalCost: Math.round(totalCost),
        costPerUnit: Math.round((totalCost / item.requiredProduction) * 100) / 100
      };
    });

    return plan.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [optimizationMode, lotSizeStrategy]);

  const totalPlanCost = optimizedPlan.reduce((sum, item) => sum + item.totalCost, 0);
  const totalPlanTime = optimizedPlan.reduce((sum, item) => sum + item.totalTime, 0);

  const machineUtilization = machines.map(machine => {
    const assignedItems = optimizedPlan.filter(item => item.selectedMachine === machine.id);
    const utilization = assignedItems.reduce((sum, item) => sum + item.totalTime, 0);
    return {
      name: machine.name,
      utilization: Math.round((utilization / (8 * 60 * parseInt(planningHorizon) * 7)) * 100), // 8 hours/day, planning horizon in weeks
      cost: assignedItems.reduce((sum, item) => sum + item.totalCost, 0)
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Production Planning & Optimization</CardTitle>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Execute Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="optimization">Optimization Mode</Label>
              <Select value={optimizationMode} onValueChange={setOptimizationMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost">Minimize Cost</SelectItem>
                  <SelectItem value="time">Minimize Time</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lotsize">Lot Size Strategy</Label>
              <Select value={lotSizeStrategy} onValueChange={setLotSizeStrategy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="variable">Variable Lot Size</SelectItem>
                  <SelectItem value="fixed">Fixed Lot Size (100)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="horizon">Planning Horizon</Label>
              <Select value={planningHorizon} onValueChange={setPlanningHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Weeks</SelectItem>
                  <SelectItem value="4">4 Weeks</SelectItem>
                  <SelectItem value="8">8 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>

          <Tabs defaultValue="plan" className="space-y-4">
            <TabsList>
              <TabsTrigger value="plan">Production Plan</TabsTrigger>
              <TabsTrigger value="machines">Machine Utilization</TabsTrigger>
              <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Total Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">${totalPlanCost.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Total Time</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{Math.round(totalPlanTime / 60)} hours</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-900">Avg Cost/Unit</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      ${(totalPlanCost / optimizedPlan.reduce((sum, item) => sum + item.requiredProduction, 0)).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Item Number</th>
                      <th className="text-left p-4 font-semibold">Priority</th>
                      <th className="text-left p-4 font-semibold">Required Qty</th>
                      <th className="text-left p-4 font-semibold">Machine</th>
                      <th className="text-left p-4 font-semibold">Lot Size</th>
                      <th className="text-left p-4 font-semibold">Batches</th>
                      <th className="text-left p-4 font-semibold">Time (min)</th>
                      <th className="text-left p-4 font-semibold">Cost</th>
                      <th className="text-left p-4 font-semibold">Tools Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizedPlan.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4 font-medium">{item.itemNumber}</td>
                        <td className="p-4">
                          <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}>
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="p-4">{item.requiredProduction}</td>
                        <td className="p-4">{item.machineName}</td>
                        <td className="p-4">{item.lotSize}</td>
                        <td className="p-4">{item.numberOfBatches}</td>
                        <td className="p-4">{item.totalTime}</td>
                        <td className="p-4">${item.totalCost}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {item.toolsRequired.map(tool => (
                              <Badge key={tool} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="machines">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Machine Utilization</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={machineUtilization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Cost Distribution by Machine</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={machineUtilization}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cost"
                        label={({ name, value }) => `${name}: $${value}`}
                      >
                        {machineUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Strategy Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Variable Lot Size (Current)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Total Cost:</span> ${totalPlanCost.toLocaleString()}</p>
                        <p><span className="font-semibold">Total Time:</span> {Math.round(totalPlanTime / 60)} hours</p>
                        <p><span className="font-semibold">Setup Changes:</span> {optimizedPlan.reduce((sum, item) => sum + item.numberOfBatches, 0)}</p>
                        <p><span className="font-semibold">Efficiency:</span> 92.4%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Fixed Lot Size (100 units)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Total Cost:</span> ${(totalPlanCost * 1.15).toLocaleString()}</p>
                        <p><span className="font-semibold">Total Time:</span> {Math.round(totalPlanTime * 1.2 / 60)} hours</p>
                        <p><span className="font-semibold">Setup Changes:</span> {Math.ceil(optimizedPlan.reduce((sum, item) => sum + item.requiredProduction, 0) / 100)}</p>
                        <p><span className="font-semibold">Efficiency:</span> 87.1%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-green-900 mb-2">Optimization Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-800">
                      <div>
                        <p className="text-2xl font-bold">${Math.round(totalPlanCost * 0.15).toLocaleString()}</p>
                        <p className="text-sm">Cost Savings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{Math.round(totalPlanTime * 0.2 / 60)} hours</p>
                        <p className="text-sm">Time Savings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">15%</p>
                        <p className="text-sm">Efficiency Gain</p>
                      </div>
                    </div>
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

export default ProductionPlanner;
