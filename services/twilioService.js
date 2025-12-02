const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;

// Only initialize if credentials are present and valid
if (accountSid && accountSid.startsWith('AC') && authToken && twilioPhoneNumber) {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio SMS service initialized');
} else {
    console.warn('⚠️  Twilio credentials not found. SMS notifications disabled.');
}

/**
 * Format phone number to E.164 format
 * @param {string} phoneNumber - Phone number in various formats
 * @returns {string} - Phone number in E.164 format
 */
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Add +1 for US numbers if not present
    if (cleaned.length === 10) {
        return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned}`;
    }

    // Return as-is if already formatted or international
    return phoneNumber.startsWith('+') ? phoneNumber : `+${cleaned}`;
}

/**
 * Send SMS notification when a spot becomes available
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} spotName - Name of the available spot
 */
async function sendSpotAvailableNotification(phoneNumber, spotName) {
    if (!client) {
        console.log(`[SMS DISABLED] Would send to ${phoneNumber}: ${spotName} is available`);
        return { success: false, message: 'Twilio not configured' };
    }

    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const message = await client.messages.create({
            body: `🚗 SpotSaver: ${spotName} is now available! Claim it quickly at http://localhost:2000/spotSaver`,
            from: twilioPhoneNumber,
            to: formattedNumber
        });

        console.log(`✅ Spot available SMS sent to ${formattedNumber} (SID: ${message.sid})`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('❌ Error sending spot available SMS:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send SMS notification warning about parking time limit
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} spotName - Name of the occupied spot
 * @param {number} minutesRemaining - Minutes remaining before timeout
 */
async function sendTimeoutWarningNotification(phoneNumber, spotName, minutesRemaining) {
    if (!client) {
        console.log(`[SMS DISABLED] Would send to ${phoneNumber}: ${minutesRemaining} min left in ${spotName}`);
        return { success: false, message: 'Twilio not configured' };
    }

    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const hours = Math.floor(minutesRemaining / 60);
        const mins = minutesRemaining % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;

        const message = await client.messages.create({
            body: `⏰ SpotSaver: You have ${timeStr} left in ${spotName}. Please move your vehicle soon to avoid overstaying.`,
            from: twilioPhoneNumber,
            to: formattedNumber
        });

        console.log(`✅ Timeout warning SMS sent to ${formattedNumber} (SID: ${message.sid})`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('❌ Error sending timeout warning SMS:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send SMS confirmation when spot is claimed
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} spotName - Name of the claimed spot
 */
async function sendSpotClaimedNotification(phoneNumber, spotName) {
    if (!client) {
        console.log(`[SMS DISABLED] Would send to ${phoneNumber}: Claimed ${spotName}`);
        return { success: false, message: 'Twilio not configured' };
    }

    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const message = await client.messages.create({
            body: `✅ SpotSaver: You've successfully claimed ${spotName}. Happy charging! Remember: 4.5 hour limit.`,
            from: twilioPhoneNumber,
            to: formattedNumber
        });

        console.log(`✅ Spot claimed SMS sent to ${formattedNumber} (SID: ${message.sid})`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('❌ Error sending spot claimed SMS:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send test SMS to verify Twilio setup
 * @param {string} phoneNumber - Test recipient's phone number
 */
async function sendTestNotification(phoneNumber) {
    if (!client) {
        return { success: false, message: 'Twilio not configured. Add credentials to .env file.' };
    }

    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const message = await client.messages.create({
            body: '🧪 SpotSaver Test: Your SMS notifications are working correctly!',
            from: twilioPhoneNumber,
            to: formattedNumber
        });

        console.log(`✅ Test SMS sent to ${formattedNumber} (SID: ${message.sid})`);
        return { success: true, sid: message.sid, message: 'Test SMS sent successfully!' };
    } catch (error) {
        console.error('❌ Error sending test SMS:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendSpotAvailableNotification,
    sendTimeoutWarningNotification,
    sendSpotClaimedNotification,
    sendTestNotification,
    formatPhoneNumber
};
