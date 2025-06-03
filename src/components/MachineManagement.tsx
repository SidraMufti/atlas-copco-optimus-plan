
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Wrench, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const MachineManagement = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);

  const machines = [
    {
      id: 'M-001',
      name: 'CNC Lathe 1',
      status: 'Running',
      efficiency: 92,
      costPerHour: 85,
      magazineCapacity: 12,
      currentTools: ['T-001', 'T-003', 'T-005', 'T-007', 'T-009'],
      availableSlots: 7,
      currentJob: 'ATL-2043',
      remainingTime: 145,
      totalRuntime: 2340,
      maintenance: {
        lastService: '2024-05-15',
        nextService: '2024-06-15',
        daysUntilService: 12
      }
    },
    {
      id: 'M-002',
      name: 'CNC Lathe 2',
      status: 'Idle',
      efficiency: 88,
      costPerHour: 78,
      magazineCapacity: 8,
      currentTools: ['T-002', 'T-004', 'T-006', 'T-008'],
      availableSlots: 4,
      currentJob: null,
      remainingTime: 0,
      totalRuntime: 1890,
      maintenance: {
        lastService: '2024-05-20',
        nextService: '2024-06-20',
        daysUntilService: 17
      }
    },
    {
      id: 'M-003',
      name: 'CNC Lathe 3',
      status: 'Maintenance',
      efficiency: 95,
      costPerHour: 92,
      magazineCapacity: 16,
      currentTools: ['T-001', 'T-002', 'T-003', 'T-004', 'T-005', 'T-006'],
      availableSlots: 10,
      currentJob: null,
      remainingTime: 0,
      totalRuntime: 2780,
      maintenance: {
        lastService: '2024-06-01',
        nextService: '2024-07-01',
        daysUntilService: 28
      }
    }
  ];

  const tools = [
    { id: 'T-001', name: 'Turning Insert TNMG', type: 'Turning', condition: 85, location: ['M-001', 'M-003'] },
    { id: 'T-002', name: 'Grooving Tool', type: 'Grooving', condition: 72, location: ['M-002', 'M-003'] },
    { id: 'T-003', name: 'Threading Tool', type: 'Threading', condition: 90, location: ['M-001'] },
    { id: 'T-004', name: 'Drilling Insert', type: 'Drilling', condition: 45, location: ['M-002', 'M-003'] },
    { id: 'T-005', name: 'Facing Tool', type: 'Facing', condition: 88, location: ['M-001', 'M-003'] },
    { id: 'T-006', name: 'Boring Bar', type: 'Boring', condition: 65, location: ['M-002', 'M-003'] },
    { id: 'T-007', name: 'Parting Tool', type: 'Parting', condition: 92, location: ['M-001'] },
    { id: 'T-008', name: 'Knurling Tool', type: 'Knurling', condition: 78, location: ['M-002'] },
    { id: 'T-009', name: 'Chamfer Tool', type: 'Chamfer', condition: 82, location: ['M-001'] }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running': return 'bg-green-500';
      case 'Idle': return 'bg-yellow-500';
      case 'Maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition) => {
    if (condition >= 80) return 'text-green-600';
    if (condition >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="machines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="machines">Machine Status</TabsTrigger>
          <TabsTrigger value="tools">Tool Management</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="machines" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <Card key={machine.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <p className="text-sm text-gray-600">{machine.id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`}></div>
                      <Badge variant={machine.status === 'Running' ? 'default' : machine.status === 'Idle' ? 'secondary' : 'destructive'}>
                        {machine.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                      <p className="font-semibold">{machine.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost/Hour</p>
                      <p className="font-semibold">${machine.costPerHour}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tool Magazine</span>
                      <span>{machine.currentTools.length}/{machine.magazineCapacity}</span>
                    </div>
                    <Progress value={(machine.currentTools.length / machine.magazineCapacity) * 100} className="h-2" />
                  </div>

                  {machine.currentJob && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Current Job</p>
                          <p className="text-lg font-bold text-blue-900">{machine.currentJob}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Remaining</p>
                          <p className="text-sm font-semibold">{machine.remainingTime} min</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Machine Configuration - {machine.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="costPerHour">Cost per Hour ($)</Label>
                            <Input id="costPerHour" type="number" defaultValue={machine.costPerHour} />
                          </div>
                          <div>
                            <Label htmlFor="efficiency">Efficiency (%)</Label>
                            <Input id="efficiency" type="number" defaultValue={machine.efficiency} />
                          </div>
                          <Button className="w-full">Save Changes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" className="flex-1">
                      <Wrench className="w-4 h-4 mr-1" />
                      Tools
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Real-time Machine Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-gray-600">Machines Running</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Machines Idle</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">In Maintenance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">91.7%</p>
                  <p className="text-sm text-gray-600">Overall Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Tool Inventory & Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Tool ID</th>
                      <th className="text-left p-4 font-semibold">Name</th>
                      <th className="text-left p-4 font-semibold">Type</th>
                      <th className="text-left p-4 font-semibold">Condition</th>
                      <th className="text-left p-4 font-semibold">Location</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map((tool) => (
                      <tr key={tool.id} className="border-t">
                        <td className="p-4 font-medium">{tool.id}</td>
                        <td className="p-4">{tool.name}</td>
                        <td className="p-4">{tool.type}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Progress value={tool.condition} className="w-16 h-2" />
                            <span className={`text-sm font-semibold ${getConditionColor(tool.condition)}`}>
                              {tool.condition}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {tool.location.map(loc => (
                              <Badge key={loc} variant="outline" className="text-xs">
                                {loc}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          {tool.condition >= 80 ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Good
                            </Badge>
                          ) : tool.condition >= 60 ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Monitor
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Replace
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            {tool.condition < 60 ? 'Replace' : 'Inspect'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">6</p>
                <p className="text-green-700">Tools in Good Condition</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">2</p>
                <p className="text-yellow-700">Tools Need Monitoring</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900">1</p>
                <p className="text-red-700">Tools Need Replacement</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {machines.map((machine) => (
                  <div key={machine.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(machine.status)}`}></div>
                      <div>
                        <p className="font-semibold">{machine.name}</p>
                        <p className="text-sm text-gray-600">Last service: {machine.maintenance.lastService}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Next service: {machine.maintenance.nextService}</p>
                      <p className={`text-sm ${machine.maintenance.daysUntilService <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                        {machine.maintenance.daysUntilService} days remaining
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Schedule
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MachineManagement;
