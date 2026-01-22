/**
 * Single Order API Routes
 * GET /api/orders/:id - Get single order by ID
 * PATCH /api/orders/:id - Update order
 * 
 * Validates: Requirements 5.1, 5.4, 3.5, 11.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uuidSchema, updateOrderSchema } from '@/lib/validation';
import { OrderStatus } from '@/types';

/**
 * GET /api/orders/:id
 * Retrieve a single order by ID
 * Validates: Requirements 5.1, 5.4
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate UUID format
    const validationResult = uuidSchema.safeParse(params.id);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    // Fetch order from database
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        messages (*),
        payments (*)
      `)
      .eq('id', params.id)
      .single();
    
    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Format response
    return NextResponse.json({
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
      completedAt: order.completed_at,
      messages: (order.messages || []).map((msg: any) => ({
        id: msg.id,
        orderId: msg.order_id,
        sender: msg.sender,
        content: msg.content,
        createdAt: msg.created_at,
        readAt: msg.read_at
      })),
      payments: (order.payments || []).map((payment: any) => ({
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        tier: payment.tier,
        status: payment.status,
        paymentIntentId: payment.payment_intent_id,
        createdAt: payment.created_at,
        paidAt: payment.paid_at
      }))
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/:id
 * Update order status, phone number, and Telegram info
 * Validates: Requirements 3.5, 11.4
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate UUID format
    const idValidation = uuidSchema.safeParse(params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate update data
    const validationResult = updateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Check if order exists
    const { data: existingOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('status')
      .eq('id', params.id)
      .single();
    
    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Validate status transitions
    if (data.status) {
      const validTransitions: Record<string, string[]> = {
        [OrderStatus.NEW]: [OrderStatus.IN_PROGRESS],
        [OrderStatus.IN_PROGRESS]: [OrderStatus.READY, OrderStatus.NEW],
        [OrderStatus.READY]: [OrderStatus.PAID, OrderStatus.IN_PROGRESS],
        [OrderStatus.PAID]: [OrderStatus.COMPLETED],
        [OrderStatus.COMPLETED]: []
      };
      
      const allowedNextStates = validTransitions[existingOrder.status];
      if (!allowedNextStates.includes(data.status)) {
        return NextResponse.json(
          { 
            error: 'Invalid status transition',
            message: `Cannot transition from ${existingOrder.status} to ${data.status}`
          },
          { status: 400 }
        );
      }
    }
    
    // Build update object
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.phoneNumber) updateData.phone_number = data.phoneNumber;
    if (data.telegramUserId) updateData.telegram_user_id = data.telegramUserId;
    if (data.telegramUsername) updateData.telegram_username = data.telegramUsername;
    if (data.selectedTier) updateData.selected_tier = data.selectedTier;
    if (data.songFileUrl) updateData.song_file_url = data.songFileUrl;
    if (data.songFileName) updateData.song_file_name = data.songFileName;
    if (data.readyAt) updateData.ready_at = data.readyAt;
    if (data.paidAt) updateData.paid_at = data.paidAt;
    if (data.completedAt) updateData.completed_at = data.completedAt;
    
    // Update order
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      id: updatedOrder.id,
      orderNumber: updatedOrder.order_number,
      status: updatedOrder.status,
      recipientName: updatedOrder.recipient_name,
      relationship: updatedOrder.relationship,
      occasion: updatedOrder.occasion,
      musicalStyle: updatedOrder.musical_style,
      specialRequests: updatedOrder.special_requests,
      mood: updatedOrder.mood,
      tempo: updatedOrder.tempo,
      phoneNumber: updatedOrder.phone_number,
      telegramUserId: updatedOrder.telegram_user_id,
      telegramUsername: updatedOrder.telegram_username,
      selectedTier: updatedOrder.selected_tier,
      songFileUrl: updatedOrder.song_file_url,
      songFileName: updatedOrder.song_file_name,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at,
      readyAt: updatedOrder.ready_at,
      paidAt: updatedOrder.paid_at,
      completedAt: updatedOrder.completed_at
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
