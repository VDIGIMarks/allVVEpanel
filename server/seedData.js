const velzanoPartners = [
  { _id: "vel_part_1", name: "Vikram Malhotra", email: "vikram@apexbuilders.in", phone: "+91 98765 12345", company: "Apex Builders Group", proposal: "Joint Venture Real Estate Development in Gurgaon", status: "New", createdAt: "2026-08-20T10:00:00Z" },
  { _id: "vel_part_2", name: "Ananya Sharma", email: "ananya@skylinearch.com", phone: "+91 99880 11223", company: "Skyline Architecture Studio", proposal: "Architecture & Interior Design Consultancy", status: "Under Review", createdAt: "2026-08-22T14:30:00Z" }
];

const velzanoEnquiries = [
  { _id: "vel_enq_1", name: "Rajesh Singhania", email: "singhania@investments.org", phone: "+91 98200 77112", propertyType: "Luxury Penthouse", budget: "₹10 Cr - ₹15 Cr", message: "Interested in prime sea-facing penthouses.", status: "In Progress", createdAt: "2026-08-22T13:40:00Z" },
  { _id: "vel_enq_2", name: "Sunil Kapoor", email: "sunil.k@gmail.com", phone: "+91 98111 22334", propertyType: "Commercial Office Space", budget: "₹5 Cr - ₹8 Cr", message: "Looking for 10,000 sq ft office space on lease.", status: "New", createdAt: "2026-08-24T09:15:00Z" }
];

const velzanoContacts = [
  { _id: "vel_con_1", name: "Amit Kumar", email: "amit.k@techcorp.in", phone: "+91 99100 88223", subject: "Commercial Lease Request", message: "Require 15,000 sq ft office space in Cyber City.", status: "Pending", createdAt: "2026-08-24T16:10:00Z" },
  { _id: "vel_con_2", name: "Kavita Reddy", email: "kavita@designstudio.com", phone: "+91 98490 12345", subject: "General Inquiry", message: "Requesting brochure for luxury villa projects.", status: "Resolved", createdAt: "2026-08-21T11:25:00Z" }
];

const velzanoSubscribers = [
  { _id: "vel_sub_1", email: "investor.newsletter@gmail.com", status: "Active", subscribedAt: "2026-08-01T08:00:00Z" },
  { _id: "vel_sub_2", email: "property.insider@yahoo.in", status: "Active", subscribedAt: "2026-08-12T14:20:00Z" }
];

const seedDatabase = {
  Echo: {
    sitevisits: [
      { _id: "echo_sv_101", name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 98765 43210", property: "Luxury Jungle Villa 4BHK", preferredDate: "2026-09-01", preferredTime: "11:00 AM", status: "confirmed", createdAt: "2026-08-20T10:30:00Z" },
      { _id: "echo_sv_102", name: "Ananya Roy", email: "ananya.r@example.com", phone: "+91 91234 56789", property: "Eco Cottage Deluxe", preferredDate: "2026-09-03", preferredTime: "03:00 PM", status: "pending", createdAt: "2026-08-22T14:15:00Z" },
      { _id: "echo_sv_103", name: "Vikram Malhotra", email: "vikram.m@example.com", phone: "+91 99887 76655", property: "Riverfront Suite", preferredDate: "2026-08-28", preferredTime: "04:30 PM", status: "completed", createdAt: "2026-08-15T09:00:00Z" }
    ],
    properties: [
      { _id: "echo_prop_1", title: "Luxury Jungle Villa 4BHK", type: "Villa", price: "₹2,50,00,000", location: "Jim Corbett National Park", bedrooms: 4, bathrooms: 4, area: "3800 sq ft", featured: true, status: "Available", createdAt: "2026-07-10T08:00:00Z" },
      { _id: "echo_prop_2", title: "Eco Cottage Deluxe", type: "Cottage", price: "₹1,20,00,000", location: "Kumaon Hills, Uttarakhand", bedrooms: 2, bathrooms: 2, area: "1950 sq ft", featured: true, status: "Available", createdAt: "2026-07-12T11:20:00Z" },
      { _id: "echo_prop_3", title: "Riverfront Suite & Lawn", type: "Resort Suite", price: "₹1,85,00,000", location: "Ramnagar River Bank", bedrooms: 3, bathrooms: 3, area: "2600 sq ft", featured: false, status: "Sold Out", createdAt: "2026-07-18T16:40:00Z" }
    ],
    enquiries: [
      { _id: "echo_enq_1", name: "Suresh Gupta", email: "suresh.g@gmail.com", phone: "+91 98112 23344", message: "Interested in purchasing the 4BHK Jungle Villa. Please send brochure and price breakdown.", property: "Luxury Jungle Villa 4BHK", status: "New", createdAt: "2026-08-24T12:00:00Z" },
      { _id: "echo_enq_2", name: "Pooja Verma", email: "pooja.verma@yahoo.com", phone: "+91 97654 32109", message: "Looking for weekend family stay booking package.", property: "Eco Cottage Deluxe", status: "Contacted", createdAt: "2026-08-23T09:45:00Z" }
    ],
    resorts: [
      { _id: "echo_res_1", name: "Echo Jungle Resort & Spa", location: "Jim Corbett, Uttarakhand", totalRooms: 45, luxuryVillas: 12, rating: 4.8, status: "Active", createdAt: "2026-06-01T00:00:00Z" }
    ],
    villas: [
      { _id: "echo_vil_1", villaName: "Forest Canopy Villa 1", capacity: 8, poolType: "Private Heated Pool", ratePerNight: "₹28,000", status: "Available", createdAt: "2026-06-05T00:00:00Z" },
      { _id: "echo_vil_2", villaName: "Mountain Edge Villa 2", capacity: 6, poolType: "Infinity Pool", ratePerNight: "₹24,000", status: "Booked", createdAt: "2026-06-05T00:00:00Z" }
    ],
    users: [
      { _id: "echo_usr_1", name: "Echo Administrator", email: "admin@echothejungle.com", role: "SuperAdmin", status: "Active", createdAt: "2026-01-01T00:00:00Z" }
    ]
  },
  Velzano: {
    partnerships: velzanoPartners,
    partnerwithus: velzanoPartners,
    partners: velzanoPartners,
    enquiries: velzanoEnquiries,
    submitenquiry: velzanoEnquiries,
    inquiries: velzanoEnquiries,
    contacts: velzanoContacts,
    letsconnect: velzanoContacts,
    subscribers: velzanoSubscribers,
    subscribe: velzanoSubscribers
  },
  VDM: {
    contacts: [
      { _id: "vdm_con_1", name: "Deepak Joshi", email: "deepak.j@growthbrand.com", phone: "+91 98334 55667", services: ["SEO Optimization", "Performance Marketing"], budget: "₹1,50,000 / month", message: "Want to scale lead generation and organic traffic for e-commerce store.", status: "New", createdAt: "2026-08-24T18:00:00Z" },
      { _id: "vdm_con_2", name: "Meera Sen", email: "meera@healthplus.org", phone: "+91 97112 88334", services: ["Social Media Marketing", "Brand Strategy"], budget: "₹2,00,000 / month", message: "Needs full brand revamp and Instagram ad campaign management.", status: "In Discussion", createdAt: "2026-08-23T12:15:00Z" }
    ],
    services: [
      { _id: "vdm_srv_1", title: "SEO & Content Marketing Strategy", category: "Organic Growth", price: "Starting ₹45,000/mo", description: "Technical SEO audit, keyword targeting, content plan & backlink building.", status: "Active", createdAt: "2026-05-10T00:00:00Z" },
      { _id: "vdm_srv_2", title: "Pay-Per-Click (PPC) Ad Campaigns", category: "Paid Ads", price: "Starting ₹60,000/mo", description: "Google Search, Shopping & Meta Ads execution with weekly ROI analytics.", status: "Active", createdAt: "2026-05-12T00:00:00Z" },
      { _id: "vdm_srv_3", title: "Full-Stack Web Development & UI/UX", category: "Web Development", price: "Custom Quote", description: "Modern responsive web applications with React, Next.js & Node.js backend.", status: "Active", createdAt: "2026-05-15T00:00:00Z" }
    ],
    auditrequests: [
      { _id: "vdm_aud_1", websiteUrl: "https://www.examplebrand.com", name: "Siddharth Mehta", email: "sid@examplebrand.com", phone: "+91 98990 11223", company: "Example Brand Retails", auditType: "Technical SEO & Speed Audit", status: "Audit Generated", notes: "Lighthouse score 42. High mobile bounce rate.", createdAt: "2026-08-24T09:30:00Z" },
      { _id: "vdm_aud_2", websiteUrl: "https://www.fintechstart.io", name: "Neha Saxena", email: "neha@fintechstart.io", phone: "+91 91678 44332", company: "FinTechStart", auditType: "CRO & Lead Funnel Audit", status: "Pending Analysis", notes: "Funnel drop-off on pricing page.", createdAt: "2026-08-25T08:10:00Z" }
    ],
    users: [
      { _id: "vdm_usr_1", name: "VDigimarks Team Lead", email: "contact@vdigimarks.com", role: "SuperAdmin", status: "Active", createdAt: "2026-01-01T00:00:00Z" }
    ]
  }
};

module.exports = seedDatabase;
