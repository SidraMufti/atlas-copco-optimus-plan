
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

const DemandForecast = () => {
  const [selectedItem, setSelectedItem] = useState('ATL-2043');
  const [forecastPeriod, setForecastPeriod] = useState('6');

  // Sample data for different item numbers
  const itemData = {
    'ATL-2043': {
      historical: [
        { month: 'Jan', actual: 1200, consumption: 1150 },
        { month: 'Feb', actual: 1300, consumption: 1280 },
        { month: 'Mar', actual: 1100, consumption: 1120 },
        { month: 'Apr', actual: 1400, consumption: 1350 },
        { month: 'May', actual: 1250, consumption: 1240 },
        { month: 'Jun', actual: 1350, consumption: 1320 }
      ],
      forecast: [
        { month: 'Jul', predicted: 1380, confidence: 95, stockLevel: 450 },
        { month: 'Aug', predicted: 1420, confidence: 92, stockLevel: 320 },
        { month: 'Sep', predicted: 1360, confidence: 88, stockLevel: 180 },
        { month: 'Oct', predicted: 1450, confidence: 85, stockLevel: 50 },
        { month: 'Nov', predicted: 1480, confidence: 82, stockLevel: -20 },
        { month: 'Dec', predicted: 1520, confidence: 80, stockLevel: -150 }
      ]
    },
    'ATL-1875': {
      historical: [
        { month: 'Jan', actual: 800, consumption: 790 },
        { month: 'Feb', actual: 850, consumption: 840 },
        { month: 'Mar', actual: 920, consumption: 910 },
        { month: 'Apr', actual: 780, consumption: 775 },
        { month: 'May', actual: 860, consumption: 855 },
        { month: 'Jun', actual: 900, consumption: 890 }
      ],
      forecast: [
        { month: 'Jul', predicted: 920, confidence: 94, stockLevel: 280 },
        { month: 'Aug', predicted: 940, confidence: 91, stockLevel: 220 },
        { month: 'Sep', predicted: 890, confidence: 89, stockLevel: 180 },
        { month: 'Oct', predicted: 960, confidence: 86, stockLevel: 140 },
        { month: 'Nov', predicted: 980, confidence: 84, stockLevel: 90 },
        { month: 'Dec', predicted: 1000, confidence: 82, stockLevel: 40 }
      ]
    }
  };

  const combinedData = useMemo(() => {
    const historical = itemData[selectedItem].historical;
    const forecast = itemData[selectedItem].forecast.slice(0, parseInt(forecastPeriod));
    
    return [
      ...historical.map(d => ({ ...d, type: 'historical' })),
      ...forecast.map(d => ({ ...d, type: 'forecast' }))
    ];
  }, [selectedItem, forecastPeriod]);

  const stockOutageRisk = itemData[selectedItem].forecast.find(d => d.stockLevel < 0);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">AI Demand Forecasting</CardTitle>
            <div className="flex space-x-4">
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATL-2043">ATL-2043</SelectItem>
                  <SelectItem value="ATL-1875">ATL-1875</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
              
              <Button>
                <TrendingUp className="w-4 h-4 mr-2" />
                Regenerate Forecast
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Production vs Consumption Forecast</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Historical Production"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Historical Consumption"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Demand"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Next 3 Months</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-2">4,160 units</p>
                  <p className="text-sm text-blue-700">Predicted demand</p>
                </CardContent>
              </Card>

              {stockOutageRisk && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-900">Stock Alert</span>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      Predicted stockout in {stockOutageRisk.month}
                    </p>
                    <p className="text-lg font-bold text-red-900">
                      {Math.abs(stockOutageRisk.stockLevel)} units short
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Accuracy</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">94.2%</p>
                  <p className="text-sm text-green-700">Model confidence</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stock Level Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={itemData[selectedItem].forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stockLevel" name="Projected Stock Level">
                  {itemData[selectedItem].forecast.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stockLevel < 0 ? "#ef4444" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandForecast;
