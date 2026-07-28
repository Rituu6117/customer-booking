import { Booking } from '../types';

/**
 * Formats a Booking object into the exact WhatsApp message requested by the user.
 */
export function formatBookingWhatsAppMessage(booking: Booking): string {
  const pickupText = booking.pickupRequired ? 'Yes (Pickup Needed)' : 'No (Self Drop-off)';
  const locationText = booking.location 
    ? `${booking.location.latitude.toFixed(6)}, ${booking.location.longitude.toFixed(6)}`
    : 'Not Provided';
  
  const googleMapsUrl = booking.location?.googleMapsUrl 
    ? booking.location.googleMapsUrl 
    : (booking.location ? `https://maps.google.com/?q=${booking.location.latitude},${booking.location.longitude}` : 'N/A');

  const lines = [
    `🚲 *New Service Booking - Prem Auto Service Center*`,
    ``,
    `*Booking ID:* ${booking.id}`,
    `*Customer Name:* ${booking.customerName}`,
    `*Mobile:* ${booking.mobileNumber}`,
    `*Bike Number:* ${booking.bikeNumber}`,
    `*Bike Brand:* ${booking.bikeBrand}`,
    `*Bike Model:* ${booking.bikeModel}`,
    `*Service:* ${booking.serviceType}`,
    `*Pickup:* ${pickupText}`,
    `*Date:* ${booking.preferredDate}`,
    `*Time:* ${booking.preferredTime}`,
    `*Address:* ${booking.address}`,
    `*Problem Description:* ${booking.problemDescription || 'N/A'}`,
    `*Current Location:* ${locationText}`,
    `*Google Maps Link:* ${googleMapsUrl}`,
    `*Status:* ${booking.status}`,
  ];

  return lines.join('\n');
}

/**
 * Generates the direct WhatsApp Click-to-Chat URL for a given target phone number and booking.
 */
export function generateWhatsAppUrl(phone: string, booking: Booking): string {
  // Clean phone number (remove +, spaces, dashes)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = formatBookingWhatsAppMessage(booking);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp URL for sending a status update from owner to customer.
 */
export function generateCustomerStatusWhatsAppUrl(customerPhone: string, booking: Booking): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
  
  let statusMessage = '';
  switch (booking.status) {
    case 'Accepted':
      statusMessage = `Hello ${booking.customerName}! Your service booking (*${booking.id}*) for bike *${booking.bikeBrand} ${booking.bikeModel} (${booking.bikeNumber})* has been *ACCEPTED* by Prem Auto Service Center.${booking.assignedMechanicName ? ` Assigned Mechanic: ${booking.assignedMechanicName}.` : ''}${booking.estimatedCost ? ` Estimated Quote: ₹${booking.estimatedCost}.` : ''}`;
      break;
    case 'In Progress':
      statusMessage = `Hello ${booking.customerName}! Your bike service (*${booking.id}*) is now *IN PROGRESS*. Our lead mechanic is working on your bike.${booking.estimatedCompletionTime ? ` Expected completion: ${booking.estimatedCompletionTime}.` : ''}`;
      break;
    case 'Ready for Delivery':
      statusMessage = `Great news ${booking.customerName}! Your bike (*${booking.bikeNumber}*) service (*${booking.id}*) is *READY FOR DELIVERY / PICKUP*! Total Bill: ₹${booking.estimatedCost || 'As quoted'}. Thank you for choosing Prem Auto Service Center!`;
      break;
    case 'Completed':
      statusMessage = `Hello ${booking.customerName}, your service booking (*${booking.id}*) has been marked *COMPLETED*. We appreciate your business! Please leave us feedback.`;
      break;
    case 'Cancelled':
    case 'Rejected':
      statusMessage = `Hello ${booking.customerName}, your service booking (*${booking.id}*) has been marked as *${booking.status.toUpperCase()}*. ${booking.ownerNotes ? `Reason: ${booking.ownerNotes}` : 'Please contact us for more details.'}`;
      break;
    default:
      statusMessage = `Hello ${booking.customerName}, update regarding your booking (*${booking.id}*): Current Status is *${booking.status}*.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(statusMessage)}`;
}
