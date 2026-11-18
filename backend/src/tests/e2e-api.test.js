const assert = require('node:assert/strict');

async function runEndToEndVerification() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🧪 Starting HAVEN End-to-End API Verification...\n');

  // 1. Health Check
  const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
  assert.equal(healthRes.status, 'ok', 'Health check failed');
  console.log('✅ 1. Backend Health Check OK: ', healthRes.service);

  // 2. Demo User Logins (Buyer, Seller, Admin)
  const buyerLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@haven.ai', password: 'User@1234' })
  }).then(r => r.json());
  assert.ok(buyerLogin.success, 'Buyer login failed');
  assert.ok(buyerLogin.token, 'No token returned for buyer');
  console.log(`✅ 2a. Buyer Login OK: ${buyerLogin.user.name} (${buyerLogin.user.role})`);

  const sellerLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@haven.ai', password: 'Seller@1234' })
  }).then(r => r.json());
  assert.ok(sellerLogin.success, 'Seller login failed');
  assert.equal(sellerLogin.user.role, 'seller', 'Seller role mismatch');
  console.log(`✅ 2b. Seller Login OK: ${sellerLogin.user.name} (${sellerLogin.user.role})`);

  const adminLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@haven.ai', password: 'Admin@1234' })
  }).then(r => r.json());
  assert.ok(adminLogin.success, 'Admin login failed');
  assert.equal(adminLogin.user.role, 'admin', 'Admin role mismatch');
  console.log(`✅ 2c. Admin Login OK: ${adminLogin.user.name} (${adminLogin.user.role})`);

  // 3. New User Registration Test (Role: seller)
  const testEmail = `newseller_${Date.now()}@haven.ai`;
  const registerRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Real Estate',
      email: testEmail,
      password: 'Password@123',
      role: 'seller'
    })
  }).then(r => r.json());
  assert.ok(registerRes.success, 'Registration failed');
  assert.equal(registerRes.user.role, 'seller', 'Registered role should be seller');
  console.log(`✅ 3. Dynamic Registration OK: ${registerRes.user.email} (${registerRes.user.role})`);

  // 4. Properties Catalog & Filter Search
  const propsRes = await fetch(`${baseUrl}/properties?locality=Gachibowli&minPrice=4000000&maxPrice=15000000`).then(r => r.json());
  assert.ok(propsRes.success, 'Properties fetch failed');
  assert.ok(propsRes.data.length > 0, 'No properties found for filter');
  const sampleProp = propsRes.data[0];
  console.log(`✅ 4. Catalog Filter Query OK: Found ${propsRes.data.length} listings in Gachibowli (Sample: ${sampleProp.title})`);

  // 5. AI Conversational Search
  const aiSearchRes = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: `test_session_${Date.now()}`,
      message: 'Looking for a 3BHK flat near HITEC City with a gym under 90 lakhs'
    })
  }).then(r => r.json());
  assert.ok(aiSearchRes.success, 'AI search failed');
  assert.ok(aiSearchRes.reply, 'No AI reply returned');
  assert.ok(aiSearchRes.recommendations.length > 0, 'No AI recommendations returned');
  assert.equal(aiSearchRes.extractedPreferences.locality, 'HITEC City');
  console.log(`✅ 5. AI Conversational Engine OK: Extracted locality "${aiSearchRes.extractedPreferences.locality}", matched ${aiSearchRes.recommendations.length} properties.`);

  // 6. Seller CRUD Operations
  const newListingRes = await fetch(`${baseUrl}/seller/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerLogin.token}`
    },
    body: JSON.stringify({
      title: 'Aarav Emerald Heights - 3BHK Luxury Suite',
      description: 'Exclusive 3BHK high-rise apartment with panoramic skyline views and modern clubhouse amenities.',
      location: {
        locality: 'Financial District',
        address: 'Nanakramguda, Financial District, Hyderabad'
      },
      price: 11500000,
      bhk: 3,
      area: 1850,
      propertyType: 'Apartment',
      furnishing: 'Furnished',
      amenities: ['Gym', 'Swimming Pool', 'Clubhouse', '24/7 Security', 'EV Charging']
    })
  }).then(r => r.json());
  assert.ok(newListingRes.success, 'Seller create listing failed');
  const createdPropId = newListingRes.data._id;
  console.log(`✅ 6a. Seller Create Listing OK: ID ${createdPropId} ("${newListingRes.data.title}")`);

  // Seller Update Listing
  const updateListingRes = await fetch(`${baseUrl}/seller/properties/${createdPropId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerLogin.token}`
    },
    body: JSON.stringify({
      price: 11000000,
      description: 'Updated price: Exclusive 3BHK high-rise apartment.'
    })
  }).then(r => r.json());
  assert.ok(updateListingRes.success, 'Seller update listing failed');
  assert.equal(updateListingRes.data.price, 11000000);
  console.log(`✅ 6b. Seller Update Listing OK: Updated price to ₹1.10 Cr`);

  // Seller Get Listings
  const sellerListings = await fetch(`${baseUrl}/seller/properties`, {
    headers: { 'Authorization': `Bearer ${sellerLogin.token}` }
  }).then(r => r.json());
  assert.ok(sellerListings.success, 'Get seller listings failed');
  assert.ok(sellerListings.data.some(p => p._id === createdPropId), 'Created listing not in seller listings');
  console.log(`✅ 6c. Seller Retrieve Listings OK: Total ${sellerListings.data.length} listings`);

  // 7. Buyer Site Visit Inquiry Workflow
  const inquiryRes = await fetch(`${baseUrl}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerLogin.token}`
    },
    body: JSON.stringify({
      propertyId: createdPropId,
      name: 'Vikram Sharma',
      email: 'user@haven.ai',
      phone: '+91 98765 43210',
      preferredDate: '2026-10-25',
      message: 'Looking forward to inspecting the 3BHK flat this weekend.'
    })
  }).then(r => r.json());
  assert.ok(inquiryRes.success, 'Create inquiry failed');
  const inquiryId = inquiryRes.data._id;
  console.log(`✅ 7a. Buyer Create Site Tour Inquiry OK: Inquiry ID ${inquiryId}`);

  // Buyer View Submitted Inquiries
  const myInquiries = await fetch(`${baseUrl}/inquiries/my`, {
    headers: { 'Authorization': `Bearer ${buyerLogin.token}` }
  }).then(r => r.json());
  assert.ok(myInquiries.success, 'Get buyer inquiries failed');
  assert.ok(myInquiries.data.some(i => i._id === inquiryId), 'Inquiry not found in buyer list');
  console.log(`✅ 7b. Buyer View Inquiries OK: Found ${myInquiries.data.length} submitted tours`);

  // Seller View Incoming Inquiries & Update Status
  const sellerInquiries = await fetch(`${baseUrl}/seller/inquiries`, {
    headers: { 'Authorization': `Bearer ${sellerLogin.token}` }
  }).then(r => r.json());
  assert.ok(sellerInquiries.success, 'Get seller inquiries failed');
  assert.ok(sellerInquiries.data.some(i => i._id === inquiryId), 'Inquiry not received by seller');
  console.log(`✅ 7c. Seller Receive Inquiry OK: Seller received lead from ${inquiryRes.data.name}`);

  const updateInqStatus = await fetch(`${baseUrl}/seller/inquiries/${inquiryId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerLogin.token}`
    },
    body: JSON.stringify({ status: 'Confirmed' })
  }).then(r => r.json());
  assert.ok(updateInqStatus.success, 'Update inquiry status failed');
  assert.equal(updateInqStatus.data.status, 'Confirmed');
  console.log(`✅ 7d. Seller Update Lead Status OK: Status updated to "Confirmed"`);

  // 8. Admin User & Listing Management
  const adminStats = await fetch(`${baseUrl}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminLogin.token}` }
  }).then(r => r.json());
  assert.ok(adminStats.success, 'Admin stats failed');
  console.log(`✅ 8a. Admin Stats OK: ${adminStats.stats.totalProperties} properties, ${adminStats.stats.totalUsers} users`);

  // Admin Change User Role
  const roleChangeRes = await fetch(`${baseUrl}/admin/users/${registerRes.user._id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminLogin.token}`
    },
    body: JSON.stringify({ role: 'buyer' })
  }).then(r => r.json());
  assert.ok(roleChangeRes.success, 'Admin role change failed');
  assert.equal(roleChangeRes.data.role, 'buyer');
  console.log(`✅ 8b. Admin Change User Role OK: Changed role of ${registerRes.user.name} to "buyer"`);

  // Admin Delete User
  const deleteUserRes = await fetch(`${baseUrl}/admin/users/${registerRes.user._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminLogin.token}` }
  }).then(r => r.json());
  assert.ok(deleteUserRes.success, 'Admin delete user failed');
  console.log(`✅ 8c. Admin Delete User OK: User successfully deleted`);

  // Seller Delete Test Listing
  const deleteListingRes = await fetch(`${baseUrl}/seller/properties/${createdPropId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sellerLogin.token}` }
  }).then(r => r.json());
  assert.ok(deleteListingRes.success, 'Seller delete listing failed');
  console.log(`✅ 6d. Seller Delete Listing OK: Successfully deleted test listing`);

  console.log('\n🎉 ALL 18 END-TO-END WORKFLOW TESTS COMPLETED SUCCESSFULLY!\n');
}

runEndToEndVerification().catch(err => {
  console.error('❌ E2E Verification Failed:', err);
  process.exit(1);
});
