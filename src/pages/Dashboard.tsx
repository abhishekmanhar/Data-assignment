import React, { useEffect, useState } from 'react';
import { api, mockDb } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import MonthlyComparisonChart from '@/components/dashboard/MonthlyComparisonChart';
import SalesComparisonChart from '@/components/dashboard/SalesComparisonChart';

const LoadingComponent = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

const DataTable = ({ data, columns }: { data: any[]; columns: { key: string; label: string }[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-muted/50">
          {columns.map((column) => (
            <th 
              key={column.key} 
              className="px-4 py-2 text-left text-sm font-medium text-muted-foreground"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr 
            key={index} 
            className="border-b border-border hover:bg-muted/30 transition-colors"
          >
            {columns.map((column) => (
              <td 
                key={`${index}-${column.key}`} 
                className="px-4 py-2 text-sm"
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Component1 = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getComponent1Data();
        setData(response);
      } catch (error) {
        console.error('Error fetching Component 1 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingComponent /> : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">${data?.totalSales?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold">{data?.growth || 0}%</p>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="text-sm text-muted-foreground">Top Product</p>
              <p className="text-xl font-medium">{data?.topProduct || 'N/A'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Component2 = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'name', label: 'Month' },
    { key: 'previousValue', label: 'Last Year' },
    { key: 'value', label: 'This Year' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await mockDb.getComponent2Data();
        setData(response);
      } catch (error) {
        console.error('Error fetching Component 2 data:', error);
        toast.error('Failed to fetch Component 2 data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingComponent /> : (
          <div className="space-y-6">
            <MonthlyComparisonChart />
            <Separator />
            <DataTable data={data} columns={columns} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Component3 = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getComponent3Data();
        setData(response);
      } catch (error) {
        console.error('Error fetching Component 3 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">User Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingComponent /> : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{data?.activeUsers?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold">{data?.newUsers?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="text-sm text-muted-foreground">Retention Rate</p>
              <p className="text-xl font-medium">{data?.retentionRate || 0}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Component4 = () => {
  const [apiData, setApiData] = useState<any>(null);
  const [dbData, setDbData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Date' },
    { key: 'web_sales', label: 'Web Sales' },
    { key: 'offline_sales', label: 'Offline Sales' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apiResponse, dbResponse] = await Promise.all([
          api.getComponent4Data(),
          mockDb.getComponent4DbData(),
        ]);
        
        setApiData(apiResponse);
        setDbData(dbResponse);
      } catch (error) {
        console.error('Error fetching Component 4 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Sales Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingComponent /> : (
          <div className="space-y-6">
            <SalesComparisonChart />
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">API Data:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Sales Data Table:</p>
              <DataTable data={dbData} columns={columns} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Component5 = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getComponent5Data();
        setData(response);
      } catch (error) {
        console.error('Error fetching Component 5 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Inventory Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingComponent /> : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{data?.inventoryItems?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{data?.lowStockItems || 'N/A'}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{data?.outOfStockItems || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Component6 = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'product', label: 'Product' },
    { key: 'sold_amount', label: 'Sold Amount' },
    { key: 'unit_price', label: 'Unit Price' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'rating', label: 'Rating' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await mockDb.getComponent6Data();
        setData(response);
      } catch (error) {
        console.error('Error fetching Component 6 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingComponent /> : (
          <DataTable data={data} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          View data from multiple components
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Component1 />
        <Component2 />
        <Component3 />
        <Component4 />
        <Component5 />
        <Component6 />
      </div>
    </div>
  );
};

export default Dashboard;
