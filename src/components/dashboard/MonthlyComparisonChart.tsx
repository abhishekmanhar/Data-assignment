
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockDb } from '@/lib/api';
import { toast } from 'sonner';

const MonthlyComparisonChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching monthly comparison data...');
        const response = await mockDb.getComponent2Data();
        console.log('Monthly comparison data response:', response);
        
        if (response && response.length > 0) {
          // Transform data for chart display
          const processedData = response.map(item => ({
            month: item.name,
            lastYear: item.previousValue,
            thisYear: item.value
          }));
          console.log('Processed chart data:', processedData);
          setChartData(processedData);
        } else {
          console.warn('Empty response from monthly comparison data');
          setError('No data available for monthly comparison chart');
          toast.warning('No data available for monthly comparison chart');
        }
      } catch (error) {
        console.error('Error fetching monthly comparison data:', error);
        setError('Failed to fetch monthly comparison data');
        toast.error('Failed to fetch monthly comparison data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="w-full h-64 md:h-80 flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-80">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number | string) => {
                // Ensure the value is a number before formatting
                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                return isNaN(numValue) ? value : new Intl.NumberFormat('en-US').format(numValue);
              }}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar dataKey="lastYear" name="Last Year" fill="#9b87f5" />
            <Bar dataKey="thisYear" name="This Year" fill="#33C3F0" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyComparisonChart;
