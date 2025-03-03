const mongoose = require('mongoose');
const { 
  createReport, 
  getReportById, 
  getAllReports, 
  updateReport, 
  deleteReport 
} = require('./crudReport.js');

async function seedReportData() {
    try {
      console.log('Starting to seed report data...');
  
      // Using the provided specific IDs
      const user1Id = "67b6c0b1d6d111113a31c4ea";
      const user2Id = "67b9e94c62331fd6ff41f73a";
      const user3Id = "67b9e9bf62331fd6ff41f73f";
      
      const post1Id = "67c13b981dd7fd97f0bee548";
      const post2Id = "67c13fa83757fbbd168da976";
      const commentId = "67c4125dd5ed05e2affb5211";
      
      // Create reports using the createReport function
      console.log('Creating report 1...');
      const report1Result = await createReport(
        post1Id,            // reportedItemId
        'Post',             // reportedItemType
        user1Id,            // authorId (of the reported content)
        'Spam',             // reason
        'This post contains unsolicited advertisements'  // details
      );
      console.log(report1Result);
      
      console.log('Creating report 2...');
      const report2Result = await createReport(
        post2Id,
        'Post',
        user2Id,
        'Bug',
        'Post contains broken links and images'
      );
      console.log(report2Result);
      
      console.log('Creating report 3...');
      const report3Result = await createReport(
        commentId,
        'Comment',
        user3Id,
        'Inappropriate Content',
        'This comment contains inappropriate content'
      );
      console.log(report3Result);
      
      // Get all reports to verify they were created
      console.log('Fetching all reports...');
      const allReports = await getAllReports();
      console.log('All reports:', allReports);
      
      console.log('Report seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding report data:', error);
    } finally {
      // Close the connection after all operations
      setTimeout(() => {
        mongoose.connection.close();
        console.log('MongoDB connection closed');
      }, 2000);
    }
  }
  
// Call the function to run the example
seedReportData();