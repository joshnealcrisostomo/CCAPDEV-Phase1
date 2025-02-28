const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const Report = require('./reportSchema.js'); // Adjust path as needed
const User = require('./UserSchema'); // Adjust path as needed
const Post = require('./postSchema'); // Adjust path as needed
const Comment = require('./commentSchema'); // Adjust path as needed

const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";

mongoose.connect(uri);

async function createReport(reportedItemId, reportedItemType, authorId, reporterId, reason, details) {
  try {
    // Validate IDs
    if (!ObjectId.isValid(reportedItemId) || !ObjectId.isValid(authorId) || !ObjectId.isValid(reporterId)) {
      console.log("Invalid ObjectId format");
      throw new Error('Invalid ID format');
    }

    // Validate reportedItemType
    if (!['Post', 'Comment'].includes(reportedItemType)) {
      throw new Error('Invalid reportedItemType. Must be either Post or Comment');
    }

    // Check if the reported item exists
    let reportedItem;
    if (reportedItemType === 'Post') {
      reportedItem = await Post.findById(reportedItemId);
    } else {
      reportedItem = await Comment.findById(reportedItemId);
    }

    if (!reportedItem) {
      throw new Error(`${reportedItemType} not found`);
    }

    // Check if author exists
    const author = await User.findById(authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    // Check if reporter exists
    const reporter = await User.findById(reporterId);
    if (!reporter) {
      throw new Error('Reporter not found');
    }

    // Create
    const newReport = new Report({
      reportedItemId,
      reportedItemType,
      author: authorId,
      reporter: reporterId,
      reason,
      details: details || '',
      status: 'Pending'
    });

    // Save the report
    await newReport.save();

    console.log('✅ Report created successfully!');
    return { success: true, message: 'Report created successfully', report: newReport };
  } catch (error) {
    //  duplicate report 
    if (error.code === 11000) {
      console.error('❌ Duplicate report:', error);
      return { success: false, message: 'This item has already been reported by this user' };
    }
    
    console.error('❌ Error in createReport:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
}

async function getReportById(reportId) {
  try {
    if (!ObjectId.isValid(reportId)) {
      return { success: false, message: "Invalid Report ID format" };
    }

    const report = await Report.findById(reportId)
      .populate('author', 'username email')
      .populate('reporter', 'username email');
    
    if (!report) {
      return { success: false, message: "Report not found" };
    }

    return { success: true, report };
  } catch (error) {
    console.error("❌ Error retrieving report:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function getAllReports(filters = {}) {
  try {
    // Apply any filters (status, reportedItemType, etc.)
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.reportedItemType) {
      query.reportedItemType = filters.reportedItemType;
    }
    
    if (filters.authorId && ObjectId.isValid(filters.authorId)) {
      query.author = filters.authorId;
    }

    const reports = await Report.find(query)
      .populate('author', 'username email')
      .populate('reporter', 'username email')
      .sort({ createdAt: -1 }); // Most recent first
    
    return { success: true, reports };
  } catch (error) {
    console.error("❌ Error retrieving reports:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function updateReport(reportId, updateData) {
  try {
    if (!ObjectId.isValid(reportId)) {
      return { success: false, message: "Invalid Report ID format" };
    }

    // Check if the report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return { success: false, message: "Report not found" };
    }

    // Prevent updating critical fields
    delete updateData.reportedItemId;
    delete updateData.reportedItemType;
    delete updateData.author;
    delete updateData.reporter;
    delete updateData.createdAt;

    // Update only the allowed fields
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    console.log("✅ Report updated successfully:", updatedReport);
    return { 
      success: true, 
      message: "Report updated successfully",
      report: updatedReport
    };
  } catch (error) {
    console.error("❌ Error updating report:", error);
    return { success: false, message: error.message || "Server error" };
  }
}

async function deleteReport(reportId) {
  try {
    if (!ObjectId.isValid(reportId)) {
      return { success: false, message: "Invalid Report ID format" };
    }

    // Check if the report exists
    const reportExists = await Report.findById(reportId);
    if (!reportExists) {
      console.error("❌ Report not found.");
      return { success: false, message: "Report not found in database" };
    }

    console.log("🔍 Found report, proceeding with deletion:", reportExists);

    // Delete the report
    const deleteResult = await Report.deleteOne({ _id: reportId });

    if (deleteResult.deletedCount === 0) {
      console.error("❌ Report deletion failed:", reportId);
      return { success: false, message: "Report could not be deleted" };
    }

    console.log("✅ Report deleted successfully:", reportId);
    return { success: true, message: "Report deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting report:", error);
    return { success: false, message: "Server error" };
  }
}

module.exports = { createReport, getReportById, getAllReports, updateReport, deleteReport };