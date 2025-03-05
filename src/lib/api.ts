
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Base URL for all API requests
const BASE_URL = 'http://3.111.196.92:8020';

// Authentication credentials from the assignment
const AUTH = {
  username: 'trial',
  password: 'assignment123',
};

// Create authorization header
const getAuthHeader = () => {
  return `Basic ${btoa(`${AUTH.username}:${AUTH.password}`)}`;
};

// Generic fetch function with improved error handling and data extraction
const fetchWithAuth = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Attempting to fetch data from: ${url}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
      ...options.headers,
    };
    
    // Set a reasonable timeout for fetch requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log(`Successfully fetched data from ${endpoint}:`, responseData);
    
    // Extract the actual data from the response
    // The API returns { status, message, data } structure
    if (responseData && responseData.status === 'success' && responseData.data) {
      console.log(`Extracted data from ${endpoint}:`, responseData.data);
      return responseData.data as T;
    } else if (responseData && typeof responseData === 'object') {
      // If there's no data property but the response is an object, return it
      console.log(`No data property found, returning full response for ${endpoint}:`, responseData);
      return responseData as T;
    }
    
    console.warn(`Unexpected response format from ${endpoint}:`, responseData);
    throw new Error('Invalid response format');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`API request to ${endpoint} failed:`, errorMessage);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      toast.error('Request timed out.');
    } else {
      toast.error(`Failed to fetch from server: ${errorMessage}`);
    }
    
    throw error;
  }
};

// API endpoints based on the correct links provided
const endpoints = {
  component1: '/api/v1/sample_assignment_api_1/',
  component3: '/api/v1/sample_assignment_api_3/',
  component4: '/api/v1/sample_assignment_api_4/',
  component5: '/api/v1/sample_assignment_api_5/',
};

// Type-safe function to fetch data from Supabase
const getDataFromSupabase = async <T extends 'monthly_comparison' | 'product_data' | 'sales_data'>(
  tableName: T
): Promise<Tables[T]['Row'][] | null> => {
  try {
    console.log(`Attempting to fetch data from Supabase table: ${tableName}`);
    const { data, error } = await supabase.from(tableName).select('*');
    
    if (error) {
      console.error(`Error fetching from Supabase table ${tableName}:`, error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Successfully fetched data from Supabase table ${tableName}:`, data);
      return data;
    }
    
    console.log(`No data found in Supabase table ${tableName}, falling back to APIs`);
    return null;
  } catch (error) {
    console.error(`Error fetching data from Supabase table ${tableName}:`, error);
    return null;
  }
};

// API functions for each component
export const api = {
  // Component 1 API
  getComponent1Data: async () => {
    try {
      // Fall back to API directly
      return await fetchWithAuth(endpoints.component1);
    } catch (error) {
      console.error('Failed to fetch Component 1 data:', error);
      toast.error('Failed to fetch sales overview data');
      throw error;
    }
  },
  
  // Component 3 API
  getComponent3Data: async () => {
    try {
      // Fall back to API directly
      return await fetchWithAuth(endpoints.component3);
    } catch (error) {
      console.error('Failed to fetch Component 3 data:', error);
      toast.error('Failed to fetch user metrics data');
      throw error;
    }
  },
  
  // Component 4 API
  getComponent4Data: async () => {
    try {
      // Fall back to API directly
      return await fetchWithAuth(endpoints.component4);
    } catch (error) {
      console.error('Failed to fetch Component 4 data:', error);
      toast.error('Failed to fetch sales comparison data');
      throw error;
    }
  },
  
  // Component 5 API
  getComponent5Data: async () => {
    try {
      // Fall back to API directly
      return await fetchWithAuth(endpoints.component5);
    } catch (error) {
      console.error('Failed to fetch Component 5 data:', error);
      toast.error('Failed to fetch inventory status data');
      throw error;
    }
  },
};

// Mock database functions for components 2, 4, and 6
// These fetch real data from Supabase
export const mockDb = {
  getComponent2Data: async () => {
    try {
      // Fetch from Supabase with proper typing
      const supabaseData = await getDataFromSupabase('monthly_comparison');
      if (supabaseData && supabaseData.length > 0) {
        // Transform the data to match the expected format with proper type checking
        return supabaseData.map((item, index) => ({
          id: index + 1,
          name: item.Month || `Month ${index + 1}`,
          value: item.This_year || 0,
          previousValue: item.Last_year || 0
        }));
      }
      
      // If no data, throw an error
      toast.error('No data available for monthly comparison');
      throw new Error('No data available for monthly comparison');
    } catch (error) {
      console.error('Failed to fetch Component 2 data:', error);
      toast.error('Failed to fetch monthly comparison data');
      throw error;
    }
  },
  
  getComponent4DbData: async () => {
    try {
      // Fetch from Supabase with proper typing
      const supabaseData = await getDataFromSupabase('sales_data');
      if (supabaseData && supabaseData.length > 0) {
        // Transform the data to match the expected format with proper type checking
        return supabaseData.slice(0, 10).map((item, index) => ({
          id: index + 1,
          date: item.date || 'Unknown',
          web_sales: item.web_sales || 0,
          offline_sales: item.offline_sales || 0,
        }));
      }
      
      // If no data, throw an error
      toast.error('No data available for sales data table');
      throw new Error('No data available for sales data table');
    } catch (error) {
      console.error('Failed to fetch Component 4 DB data:', error);
      toast.error('Failed to fetch sales data for table');
      throw error;
    }
  },
  
  getComponent6Data: async () => {
    try {
      // Fetch from Supabase with proper typing
      const supabaseData = await getDataFromSupabase('product_data');
      if (supabaseData && supabaseData.length > 0) {
        // Transform the data to match the expected format with proper type checking
        return supabaseData.map((item, index) => ({
          id: index + 1,
          product: item.Product || `Product ${index + 1}`,
          sold_amount: item.sold_amount || 0,
          unit_price: item.unit_price || 0,
          revenue: item.revenue || 0,
          rating: item.rating || 0
        }));
      }
      
      // If no data, throw an error
      toast.error('No data available for product performance');
      throw new Error('No data available for product performance');
    } catch (error) {
      console.error('Failed to fetch Component 6 data:', error);
      toast.error('Failed to fetch product performance data');
      throw error;
    }
  },
};
