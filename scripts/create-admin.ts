/**
 * Script to create a test admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  try {
    const email = 'admin@test.com'
    const password = 'admin123'
    const name = 'Test Admin'
    
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', email)
      return
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create admin user
    const { data: admin, error } = await supabase
      .from('admin_users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role: 'admin'
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('👤 Name:', name)
    console.log('🆔 ID:', admin.id)
    
  } catch (error) {
    console.error('❌ Error creating admin:', error)
  }
}

createAdmin()
