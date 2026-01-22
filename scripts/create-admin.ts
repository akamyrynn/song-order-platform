/**
 * Script to create a test admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@test.com'
    const password = 'admin123'
    const name = 'Test Admin'
    
    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    })
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', email)
      return
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create admin user
    const admin = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'admin'
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('👤 Name:', name)
    console.log('🆔 ID:', admin.id)
    
  } catch (error) {
    console.error('❌ Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
