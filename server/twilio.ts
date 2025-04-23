import type { Express } from "express";
import { z } from "zod";

interface TwilioService {
  sendSms: (to: string, message: string) => Promise<{ sid: string }>;
  sendBulkSms: (recipients: string[], message: string) => Promise<{ success: number; failed: number; }>;
  processSmsWebhook: (body: any) => Promise<string>;
}

class TwilioServiceImpl implements TwilioService {
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;
  private twilioClient: any;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
    
    // Initialize Twilio client if credentials are available
    if (this.accountSid && this.authToken) {
      try {
        // Import dynamically to avoid requiring Twilio dependency for development
        import('twilio').then(twilio => {
          this.twilioClient = twilio.default(this.accountSid, this.authToken);
          console.log('Twilio client initialized');
        });
      } catch (error) {
        console.error('Failed to initialize Twilio client:', error);
      }
    } else {
      console.warn('Twilio credentials not provided, SMS functionality will be mocked');
    }
  }

  async sendSms(to: string, message: string): Promise<{ sid: string }> {
    // Clean the phone number - remove spaces and other non-numeric characters except the leading +
    const cleanedPhoneNumber = to.replace(/\s+/g, '');
    
    // Validate phone number (basic validation)
    if (!cleanedPhoneNumber.match(/^\+\d{8,15}$/)) {
      throw new Error('Invalid phone number format. Must include country code (e.g., +251...)');
    }
    
    if (!message || message.length === 0) {
      throw new Error('Message cannot be empty');
    }
    
    // If Twilio client is available, send real SMS
    if (this.twilioClient) {
      try {
        const result = await this.twilioClient.messages.create({
          body: message,
          from: this.phoneNumber,
          to: cleanedPhoneNumber
        });
        
        console.log(`SMS sent to ${to}, SID: ${result.sid}`);
        return { sid: result.sid };
      } catch (error: any) {
        console.error('Error sending SMS via Twilio:', error);
        throw new Error(`Failed to send SMS: ${error.message || 'Unknown error'}`);
      }
    } else {
      // Mock successful SMS delivery
      console.log(`[MOCK] SMS to ${to}: ${message}`);
      return { sid: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}` };
    }
  }

  async sendBulkSms(recipients: string[], message: string): Promise<{ success: number; failed: number; }> {
    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided');
    }
    
    if (!message || message.length === 0) {
      throw new Error('Message cannot be empty');
    }
    
    let successCount = 0;
    let failedCount = 0;
    
    // Send SMS to each recipient
    for (const recipient of recipients) {
      try {
        await this.sendSms(recipient, message);
        successCount++;
      } catch (error) {
        console.error(`Failed to send SMS to ${recipient}:`, error);
        failedCount++;
      }
    }
    
    return {
      success: successCount,
      failed: failedCount
    };
  }

  async processSmsWebhook(body: any): Promise<string> {
    // Validate webhook payload
    const schema = z.object({
      From: z.string(),
      Body: z.string()
    });
    
    try {
      const { From, Body } = schema.parse(body);
      const message = Body.trim().toLowerCase();
      
      // Process commands
      let response = '';
      
      if (message === 'price' || message === 'prices') {
        response = 'Current teff prices in Addis Ababa:\n' +
                  'White (Magna): 6,800 ETB/quintal\n' +
                  'Mixed: 5,950 ETB/quintal\n' +
                  'Red (Sergegna): 5,300 ETB/quintal';
      } else if (message === 'stop') {
        response = 'You have been unsubscribed from all Farm2Market alerts. Reply START to resubscribe.';
        // In a real implementation, you would update the database to unsubscribe the user
      } else if (message === 'start') {
        response = 'You have been resubscribed to Farm2Market alerts. Reply STOP to unsubscribe at any time.';
        // In a real implementation, you would update the database to resubscribe the user
      } else if (message === 'help') {
        response = 'Farm2Market SMS commands:\n' +
                  'PRICE - Get current teff prices\n' +
                  'STOP - Unsubscribe from alerts\n' +
                  'START - Resubscribe to alerts\n' +
                  'HELP - See this message';
      } else {
        response = 'Command not recognized. Reply HELP for a list of commands.';
      }
      
      console.log(`SMS received from ${From}: "${Body}", responding with: "${response}"`);
      return response;
    } catch (error) {
      console.error('Error processing SMS webhook:', error);
      throw new Error('Invalid webhook payload');
    }
  }
}

// Register Twilio webhook route
export function registerTwilioWebhook(app: Express) {
  app.post('/api/sms/webhook', async (req, res) => {
    try {
      const response = await twilioService.processSmsWebhook(req.body);
      
      // Return TwiML response
      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`);
    } catch (error) {
      console.error('Error in SMS webhook:', error);
      res.status(400).send('Error processing webhook');
    }
  });
}

export const twilioService = new TwilioServiceImpl();
