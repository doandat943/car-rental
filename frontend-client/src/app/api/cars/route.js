import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const params = {};
    
    // Convert searchParams to object
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    // Call backend API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars`,
      { params }
    );
    
    // Return result from backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error forwarding car search request:', error);
    
    // Return error
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error searching for cars',
        error: error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 