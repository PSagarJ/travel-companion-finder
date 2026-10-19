import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Trip from './src/models/TripModel.js';
import Expense from './src/models/Expense.js';
import Post from './src/models/Post.js';
import Review from './src/models/Review.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in environment variables.');
      process.exit(1);
    }

    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB!');

    // 1. Clear existing collections
    console.log('🧹 Clearing old demo data...');
    await Promise.all([
      User.deleteMany({}),
      Trip.deleteMany({}),
      Expense.deleteMany({}),
      Post.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // 2. Hash shared password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 3. Seed Users
    console.log('👤 Seeding travelers...');
    const usersData = [
      {
        name: 'Sagar J P',
        email: 'sagar123@gmail.com',
        password: hashedPassword,
        travelStyle: 'Chill',
        vibeBadges: ['Historical monuments', 'Food Trails', 'Photography', 'Temples'],
        preferredDestinations: ['Bali', 'Kyoto', 'Santorini', 'Manali'],
        isGovIdVerified: true,
      },
      {
        name: 'SJP Explorer',
        email: 'sjp123@gmail.com',
        password: hashedPassword,
        travelStyle: 'Adventure',
        vibeBadges: ['Mountains', 'Road Trips', 'Camping', 'Motorcycling'],
        preferredDestinations: ['Manali', 'Ladakh', 'Swiss Alps', 'Interlaken'],
        isGovIdVerified: true,
      },
      {
        name: 'Maya Lin',
        email: 'maya.lin@gmail.com',
        password: hashedPassword,
        travelStyle: 'Backpacker',
        vibeBadges: ['Backpacking', 'Photography', 'Mountains', 'Hostels'],
        preferredDestinations: ['Bali', 'Kyoto', 'Patagonia', 'Ladakh'],
        isGovIdVerified: true,
      },
      {
        name: 'Liam O\'Connor',
        email: 'liam.oc@gmail.com',
        password: hashedPassword,
        travelStyle: 'Adventure',
        vibeBadges: ['Road Trips', 'Hiking', 'Camping', 'Alpine Climbing'],
        preferredDestinations: ['Ladakh', 'Swiss Alps', 'Patagonia', 'Interlaken'],
        isGovIdVerified: true,
      },
      {
        name: 'Sofia Rossi',
        email: 'sofia.rossi@gmail.com',
        password: hashedPassword,
        travelStyle: 'Luxury',
        vibeBadges: ['Beaches', 'Food Trails', 'Culture', 'Sailing'],
        preferredDestinations: ['Amalfi Coast', 'Santorini', 'Bali', 'Positano'],
        isGovIdVerified: true,
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@gmail.com',
        password: hashedPassword,
        travelStyle: 'Chill',
        vibeBadges: ['Photography', 'Culture', 'Food Trails', 'Art Museums'],
        preferredDestinations: ['Kyoto', 'Swiss Alps', 'Santorini', 'Tokyo'],
        isGovIdVerified: true,
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@gmail.com',
        password: hashedPassword,
        travelStyle: 'Backpacker',
        vibeBadges: ['Backpacking', 'Road Trips', 'Camping', 'Street Food'],
        preferredDestinations: ['Ladakh', 'Manali', 'Serengeti', 'Nepal'],
        isGovIdVerified: false,
      },
      {
        name: 'Amara Diallo',
        email: 'amara.safari@gmail.com',
        password: hashedPassword,
        travelStyle: 'Adventure',
        vibeBadges: ['Wildlife', 'Photography', 'Hiking', 'Scuba Diving'],
        preferredDestinations: ['Serengeti', 'Zanzibar', 'Ladakh', 'Swiss Alps'],
        isGovIdVerified: true,
      },
    ];

    const seededUsers = await User.insertMany(usersData);
    const userMap = {};
    seededUsers.forEach((u) => {
      userMap[u.email] = u;
    });

    // 4. Seed Trips
    console.log('🗺️ Seeding community trips...');
    const tripsData = [
      {
        title: 'Hit the roads of Manali & Spiti Valley',
        destination: 'Manali, India',
        startDate: '2026-09-01',
        endDate: '2026-09-15',
        estimatedBudget: 650,
        travelStyle: 'Adventure',
        targetVibe: 'Bike ride, chill, party, camping',
        creatorId: String(userMap['sagar123@gmail.com']._id),
        status: 'Planning',
        applicants: [
          {
            userId: String(userMap['liam.oc@gmail.com']._id),
            name: userMap['liam.oc@gmail.com'].name,
            travelStyle: userMap['liam.oc@gmail.com'].travelStyle,
            status: 'pending',
          },
        ],
        approvedMembers: [
          {
            userId: String(userMap['sjp123@gmail.com']._id),
            name: userMap['sjp123@gmail.com'].name,
          },
          {
            userId: String(userMap['marcus.vance@gmail.com']._id),
            name: userMap['marcus.vance@gmail.com'].name,
          },
        ],
      },
      {
        title: 'The Ultimate Bali Beach & Temple Escape',
        destination: 'Bali, Indonesia',
        startDate: '2026-11-10',
        endDate: '2026-11-20',
        estimatedBudget: 850,
        travelStyle: 'Chill',
        targetVibe: 'Surfing, temple sunrises, cliffside dining',
        creatorId: String(userMap['maya.lin@gmail.com']._id),
        status: 'Upcoming',
        applicants: [
          {
            userId: String(userMap['elena.rostova@gmail.com']._id),
            name: userMap['elena.rostova@gmail.com'].name,
            travelStyle: userMap['elena.rostova@gmail.com'].travelStyle,
            status: 'pending',
          },
        ],
        approvedMembers: [
          {
            userId: String(userMap['sagar123@gmail.com']._id),
            name: userMap['sagar123@gmail.com'].name,
          },
          {
            userId: String(userMap['sofia.rossi@gmail.com']._id),
            name: userMap['sofia.rossi@gmail.com'].name,
          },
        ],
      },
      {
        title: 'Tokyo to Kyoto Cultural & Food Odyssey',
        destination: 'Kyoto, Japan',
        startDate: '2026-11-25',
        endDate: '2026-12-08',
        estimatedBudget: 1200,
        travelStyle: 'Chill',
        targetVibe: 'Tea ceremonies, bamboo groves, food trails',
        creatorId: String(userMap['elena.rostova@gmail.com']._id),
        status: 'Upcoming',
        applicants: [],
        approvedMembers: [
          {
            userId: String(userMap['maya.lin@gmail.com']._id),
            name: userMap['maya.lin@gmail.com'].name,
          },
          {
            userId: String(userMap['sagar123@gmail.com']._id),
            name: userMap['sagar123@gmail.com'].name,
          },
        ],
      },
      {
        title: 'Swiss Alps & Interlaken Summit Trek',
        destination: 'Interlaken, Switzerland',
        startDate: '2026-12-10',
        endDate: '2026-12-22',
        estimatedBudget: 1400,
        travelStyle: 'Adventure',
        targetVibe: 'Alpine hiking, paragliding, lake kayaking',
        creatorId: String(userMap['liam.oc@gmail.com']._id),
        status: 'Ongoing',
        applicants: [
          {
            userId: String(userMap['amara.safari@gmail.com']._id),
            name: userMap['amara.safari@gmail.com'].name,
            travelStyle: userMap['amara.safari@gmail.com'].travelStyle,
            status: 'pending',
          },
        ],
        approvedMembers: [
          {
            userId: String(userMap['marcus.vance@gmail.com']._id),
            name: userMap['marcus.vance@gmail.com'].name,
          },
          {
            userId: String(userMap['sjp123@gmail.com']._id),
            name: userMap['sjp123@gmail.com'].name,
          },
        ],
      },
      {
        title: 'Amalfi Coastline & Capri Island Sailing',
        destination: 'Positano, Italy',
        startDate: '2027-01-15',
        endDate: '2027-01-25',
        estimatedBudget: 1350,
        travelStyle: 'Luxury',
        targetVibe: 'Boat charters, limoncello tasting, cliffside dining',
        creatorId: String(userMap['sofia.rossi@gmail.com']._id),
        status: 'Upcoming',
        applicants: [
          {
            userId: String(userMap['maya.lin@gmail.com']._id),
            name: userMap['maya.lin@gmail.com'].name,
            travelStyle: userMap['maya.lin@gmail.com'].travelStyle,
            status: 'pending',
          },
        ],
        approvedMembers: [
          {
            userId: String(userMap['elena.rostova@gmail.com']._id),
            name: userMap['elena.rostova@gmail.com'].name,
          },
        ],
      },
      {
        title: 'Serengeti Migration & Zanzibar Coral Odyssey',
        destination: 'Serengeti, Tanzania',
        startDate: '2026-06-01',
        endDate: '2026-06-14',
        estimatedBudget: 1800,
        travelStyle: 'Adventure',
        targetVibe: 'Big five safari, hot air balloon, coral reef diving',
        creatorId: String(userMap['amara.safari@gmail.com']._id),
        status: 'Completed', // Allows reviews
        applicants: [],
        approvedMembers: [
          {
            userId: String(userMap['liam.oc@gmail.com']._id),
            name: userMap['liam.oc@gmail.com'].name,
          },
        ],
      },
    ];

    const seededTrips = await Trip.insertMany(tripsData);

    // 5. Seed Expenses
    console.log('💳 Seeding shared trip expenses...');
    const trip1 = seededTrips[0];
    const trip2 = seededTrips[1];
    const trip4 = seededTrips[3];

    const expensesData = [
      {
        tripId: trip1._id,
        description: 'Royal Enfield 350cc Rentals',
        amount: 220,
        paidBy: String(userMap['sagar123@gmail.com']._id),
        payerName: userMap['sagar123@gmail.com'].name,
      },
      {
        tripId: trip1._id,
        description: 'High-Altitude Camping Tents & Sleeping Bags',
        amount: 140,
        paidBy: String(userMap['sjp123@gmail.com']._id),
        payerName: userMap['sjp123@gmail.com'].name,
      },
      {
        tripId: trip1._id,
        description: 'Mountain Dhaba Feast & Chai',
        amount: 80,
        paidBy: String(userMap['marcus.vance@gmail.com']._id),
        payerName: userMap['marcus.vance@gmail.com'].name,
      },
      {
        tripId: trip2._id,
        description: 'Canggu Private Villa (3 Nights)',
        amount: 450,
        paidBy: String(userMap['maya.lin@gmail.com']._id),
        payerName: userMap['maya.lin@gmail.com'].name,
      },
      {
        tripId: trip2._id,
        description: 'Jimbaran Sunset Seafood Dinner',
        amount: 160,
        paidBy: String(userMap['sagar123@gmail.com']._id),
        payerName: userMap['sagar123@gmail.com'].name,
      },
      {
        tripId: trip4._id,
        description: 'Jungfrau Cogwheel Railway Passes',
        amount: 320,
        paidBy: String(userMap['liam.oc@gmail.com']._id),
        payerName: userMap['liam.oc@gmail.com'].name,
      },
      {
        tripId: trip4._id,
        description: 'Traditional Swiss Fondue Feast',
        amount: 140,
        paidBy: String(userMap['sjp123@gmail.com']._id),
        payerName: userMap['sjp123@gmail.com'].name,
      },
    ];

    await Expense.insertMany(expensesData);

    // 6. Seed Reviews (for the completed Serengeti trip)
    console.log('⭐ Seeding traveler reviews...');
    const completedTrip = seededTrips[5]; // Serengeti trip
    const reviewsData = [
      {
        tripId: String(completedTrip._id),
        reviewerId: String(userMap['liam.oc@gmail.com']._id),
        reviewerName: userMap['liam.oc@gmail.com'].name,
        revieweeId: String(userMap['amara.safari@gmail.com']._id),
        revieweeName: userMap['amara.safari@gmail.com'].name,
        rating: 5,
        comment:
          'Incredible expedition leader! Amara navigated the Serengeti with deep wildlife expertise and infectious enthusiasm.',
      },
      {
        tripId: String(completedTrip._id),
        reviewerId: String(userMap['amara.safari@gmail.com']._id),
        reviewerName: userMap['amara.safari@gmail.com'].name,
        revieweeId: String(userMap['liam.oc@gmail.com']._id),
        revieweeName: userMap['liam.oc@gmail.com'].name,
        rating: 5,
        comment:
          'Liam was the ultimate companion. Reliable, punctual, calm during wild encounters, and great company by the campfire.',
      },
    ];

    await Review.insertMany(reviewsData);

    // 7. Seed Feed Posts
    console.log('📸 Seeding travel memory feed...');
    const postsData = [
      {
        userId: String(userMap['sagar123@gmail.com']._id),
        userName: userMap['sagar123@gmail.com'].name,
        imageUrl:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=85&w=1200&auto=format&fit=crop',
        caption:
          'Sunrise at Uluwatu Temple. Waves crashing hundreds of feet below with coastal monkeys along the cliffs.',
        destination: 'Uluwatu, Bali',
      },
      {
        userId: String(userMap['elena.rostova@gmail.com']._id),
        userName: userMap['elena.rostova@gmail.com'].name,
        imageUrl:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=85&w=1200&auto=format&fit=crop',
        caption:
          'Early morning in Arashiyama Bamboo Grove before the crowds arrive. Whispering wind through towering stalks.',
        destination: 'Kyoto, Japan',
      },
      {
        userId: String(userMap['marcus.vance@gmail.com']._id),
        userName: userMap['marcus.vance@gmail.com'].name,
        imageUrl:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=85&w=1200&auto=format&fit=crop',
        caption:
          'Highest motorable pass at 18,380 ft. Thin cold air, warm butter tea, and lifelong riding crew.',
        destination: 'Khardung La, Ladakh',
      },
      {
        userId: String(userMap['liam.oc@gmail.com']._id),
        userName: userMap['liam.oc@gmail.com'].name,
        imageUrl:
          'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=85&w=1200&auto=format&fit=crop',
        caption:
          'Lake Brienz reflecting the snow-dusted Bernese Oberland peaks like an emerald mirror.',
        destination: 'Interlaken, Switzerland',
      },
      {
        userId: String(userMap['sofia.rossi@gmail.com']._id),
        userName: userMap['sofia.rossi@gmail.com'].name,
        imageUrl:
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=85&w=1200&auto=format&fit=crop',
        caption:
          'Golden hour sailing past the iconic Faraglioni rock formations off the cliffs of Capri.',
        destination: 'Amalfi Coast, Italy',
      },
      {
        userId: String(userMap['maya.lin@gmail.com']._id),
        userName: userMap['maya.lin@gmail.com'].name,
        imageUrl:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=85&w=1200&auto=format&fit=crop',
        caption:
          'Iconic whitewashed blue domes of Oia glowing gold as the Aegean sun dips below the horizon.',
        destination: 'Santorini, Greece',
      },
    ];

    await Post.insertMany(postsData);

    console.log('\n=========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    console.log(`👤 Users: ${seededUsers.length}`);
    console.log(`🗺️ Trips: ${seededTrips.length}`);
    console.log(`💳 Expenses: ${expensesData.length}`);
    console.log(`⭐ Reviews: ${reviewsData.length}`);
    console.log(`📸 Posts: ${postsData.length}`);
    console.log('-----------------------------------------');
    console.log('🔑 All seeded users have password: password123');
    console.log('Example logins:');
    console.log(' - sagar123@gmail.com / password123 (Sagar J P)');
    console.log(' - sjp123@gmail.com / password123 (SJP Explorer)');
    console.log(' - maya.lin@gmail.com / password123 (Maya Lin)');
    console.log(' - liam.oc@gmail.com / password123 (Liam O\'Connor)');
    console.log(' - sofia.rossi@gmail.com / password123 (Sofia Rossi)');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
