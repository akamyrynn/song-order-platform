/**
 * Database Connection Test Endpoint
 * GET /api/test-db - Test database connectivity
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Try a simple query
    const { data, error, count } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      details: {
        orderCount: count || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
