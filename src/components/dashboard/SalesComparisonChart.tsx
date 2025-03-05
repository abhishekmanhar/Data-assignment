
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const SalesComparisonChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching sales comparison data...');
        const response = await api.getComponent4Data();
        console.log('Sales comparison data response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          // Use the first 12 data points for the chart, with safer string handling
          const processedData = response.slice(0, 12).map((item) => {
            // Safely process the date string to avoid substring errors
            let formattedDate = 'Unknown';
            if (item.date && typeof item.date === 'string') {
              const dateParts = item.date.split(' ');
              // Make sure we have at least 2 parts and the second part has enough characters
              if (dateParts.length > 1 && dateParts[1].length >= 5) {
                formattedDate = dateParts[1].substring(0, 5);
              } else {
                formattedDate = item.date;
              }
            }
            
            return {
              date: formattedDate,
              web_sales: item.web_sales || 0,
              offline_sales: item.offline_sales || 0
            };
          });
          console.log('Processed sales chart data:', processedData);
          setChartData(processedData);
        } else {
          console.warn('Empty or invalid response from sales comparison data');
          setError('No data available for sales comparison chart');
          toast.warning('No data available for sales comparison chart');
        }
      } catch (error) {
        console.error('Error fetching sales comparison data:', error);
        setError('Failed to fetch sales comparison data');
        toast.error('Failed to fetch sales comparison data');
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
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number | string) => {
                // Ensure the value is a number before formatting
                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                return isNaN(numValue) ? value : new Intl.NumberFormat('en-US').format(numValue);
              }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="web_sales" name="Web Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="offline_sales" name="Offline Sales" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
};

export default SalesComparisonChart;
