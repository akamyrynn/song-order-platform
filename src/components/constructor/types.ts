export interface FormData {
  // Step 1: Basic Info
  recipientName: string
  relationship: string
  occasion: string
  
  // Step 2: Music Style
  musicalStyle: string[]
  mood: string
  tempo: string
  
  // Step 3: Details
  specialRequests: string
  
  // Step 4: Contact
  phoneNumber: string
}
