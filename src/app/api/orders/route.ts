/**
 * Order Management API Routes
 * POST /api/orders - Create new order
 * GET /api/orders - List orders with filtering
 * 
 * Validates: Requirements 2.3, 2.4, 3.1, 5.1, 5.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createOrderSchema, orderFilterSchema } from '@/lib/validation';
import { OrderStatus } from '@/types';

/**
 * Generate unique order number in format ORD-YYYY-NNNN
 * Validates: Requirements 2.3, 3.1
 */
async function generateOrderNumber(): Promise<string> {
  try {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;
    
    // Get the latest order number for this year
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('order_number')
      .like('order_number', `${prefix}%`)
      .order('order_number', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    let nextNumber = 1;
    if (orders && orders.length > 0) {
      const parts = orders[0].order_number.split('-');
      if (parts.length === 3) {
        const currentNumber = parseInt(parts[2]);
        if (!isNaN(currentNumber)) {
          nextNumber = currentNumber + 1;
        }
      }
    }
    
    // Pad with zeros to 4 digits
    const paddedNumber = nextNumber.toString().padStart(4, '0');
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error in generateOrderNumber:', error);
    throw new Error('Failed to generate order number');
  }
}

/**
 * POST /api/orders
 * Create a new order with unique order number
 * Validates: Requirements 2.3, 2.4, 3.1
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Generate unique order number
    let orderNumber: string;
    try {
      orderNumber = await generateOrderNumber();
    } catch (error) {
      console.error('Error generating order number:', error);
      return NextResponse.json(
        { error: 'Failed to generate order number. Please check database connection.' },
        { status: 500 }
      );
    }
    
    // Create order in database
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: OrderStatus.NEW,
        recipient_name: data.recipientName,
        relationship: data.relationship,
        occasion: data.occasion,
        musical_style: data.musicalStyle || [],
        special_requests: data.specialRequests,
        mood: data.mood,
        tempo: data.tempo,
        phone_number: data.phoneNumber
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order in database:', error);
      return NextResponse.json(
        { error: 'Failed to create order. Please check database connection.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        recipientName: order.recipient_name,
        relationship: order.relationship,
        occasion: order.occasion,
        musicalStyle: order.musical_style,
        specialRequests: order.special_requests,
        mood: order.mood,
        tempo: order.tempo,
        phoneNumber: order.phone_number,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * List orders with filtering by status, date, order number
 * Validates: Requirements 5.1, 5.4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const filterParams = {
      status: searchParams.get('status') || undefined,
      orderNumber: searchParams.get('orderNumber') || undefined,
      telegramUserId: searchParams.get('telegramUserId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20'
    };
    
    const validationResult = orderFilterSchema.safeParse(filterParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const filters = validationResult.data;
    
    // Build query
    let query = supabaseAdmin.from('orders').select('*', { count: 'exact' });
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.orderNumber) {
      query = query.ilike('order_number', `%${filters.orderNumber}%`);
    }
    
    if (filters.telegramUserId) {
      query = query.eq('telegram_user_id', filters.telegramUserId);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit;
    
    // Execute query with pagination
    const { data: orders, error, count } = await query
      .order('created_at', { ascending: false })
      .range(skip, skip + filters.limit - 1);
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
    
    // Format response
    const formattedOrders = (orders || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      recipientName: order.recipient_name,
      relationship: order.relationship,
      occasion: order.occasion,
      musicalStyle: order.musical_style,
      specialRequests: order.special_requests,
      mood: order.mood,
      tempo: order.tempo,
      phoneNumber: order.phone_number,
      telegramUserId: order.telegram_user_id,
      telegramUsername: order.telegram_username,
      selectedTier: order.selected_tier,
      songFileUrl: order.song_file_url,
      songFileName: order.song_file_name,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      readyAt: order.ready_at,
      paidAt: order.paid_at,
      completedAt: order.completed_at
    }));
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / filters.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
