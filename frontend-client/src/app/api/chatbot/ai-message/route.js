import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Call backend API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chatbot/ai-message`,
      body
    );
    
    // Return result from backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error forwarding chatbot request:', error);
    
    // Return error
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing chatbot request',
        error: error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 