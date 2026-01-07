export function generateWhatsAppUrl(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    // Remove any non-numeric characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function formatCartForWhatsApp(cartItems, user) {
    let message = `🛒 *New Order from ${user.shopName}*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${user.name}\n`;
    message += `Phone: ${user.phone}\n`;
    message += `Shop: ${user.shopName}\n`;
    message += `Address: ${user.address}\n`;
    message += `Pincode: ${user.pincode}\n`;
    if (user.gstNumber) {
        message += `GST: ${user.gstNumber}\n`;
    }
    message += `\n📦 *Order Items:*\n`;
    message += `─────────────────\n`;

    cartItems.forEach((item, index) => {
        message += `${index + 1}. ${item.design.product?.name || 'Product'}\n`;
        message += `   Design: ${item.design.name}\n`;
        if (item.color) {
            message += `   Color: ${item.color.colorName}\n`;
        }
        message += `   Qty: ${item.quantity}\n`;
        message += `\n`;
    });

    message += `─────────────────\n`;
    message += `Total Items: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}\n`;
    message += `\n🙏 Thank you for your order!`;

    return message;
}
