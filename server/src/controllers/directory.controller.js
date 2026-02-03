import Directory from '../models/directory.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Get directories by type (grouped by state)
// @route   GET /api/directories
// @access  Public
export const getDirectories = asyncHandler(async (req, res) => {
  const { type, state } = req.query;
  
  // Build query
  const query = { isActive: true };
  if (type && ['FOMT', 'FNMT'].includes(type)) {
    query.type = type;
  }
  if (state && state !== 'all') {
    query.state = state;
  }
  
  const directories = await Directory.find(query)
    .select('-isActive -__v')
    .sort({ state: 1, name: 1 })
    .lean();
  
  // Group by state
  const groupedByState = directories.reduce((acc, item) => {
    if (!acc[item.state]) {
      acc[item.state] = [];
    }
    acc[item.state].push(item);
    return acc;
  }, {});
  
  // Convert to array of objects
  const result = Object.keys(groupedByState).map(state => ({
    state,
    entries: groupedByState[state]
  }));
  
  res.status(200).json({
    success: true,
    count: directories.length,
    data: result
  });
});

// @desc    Get directory by ID
// @route   GET /api/directories/:id
// @access  Private/Admin
export const getDirectoryById = asyncHandler(async (req, res) => {
  const directory = await Directory.findById(req.params.id);
  
  if (!directory) {
    res.status(404);
    throw new Error('Directory entry not found');
  }
  
  res.status(200).json({
    success: true,
    data: directory
  });
});

// @desc    Create directory entry
// @route   POST /api/directories
// @access  Private/Admin
export const createDirectory = asyncHandler(async (req, res) => {
  const { type, state, name, mobile, address } = req.body;
  
  // Validate required fields
  if (!type || !state || !name || !mobile || !address) {
    res.status(400);
    throw new Error('All fields are required');
  }
  
  // Create directory
  const directory = await Directory.create({
    type,
    state,
    name,
    mobile,
    address,
    createdBy: req.user._id
  });
  
  res.status(201).json({
    success: true,
    message: 'Directory entry created successfully',
    data: directory
  });
});

// @desc    Update directory entry
// @route   PUT /api/directories/:id
// @access  Private/Admin
export const updateDirectory = asyncHandler(async (req, res) => {
  const { state, name, mobile, address } = req.body;
  
  const directory = await Directory.findById(req.params.id);
  
  if (!directory) {
    res.status(404);
    throw new Error('Directory entry not found');
  }
  
  // Update fields
  directory.state = state || directory.state;
  directory.name = name || directory.name;
  directory.mobile = mobile || directory.mobile;
  directory.address = address || directory.address;
  
  await directory.save();
  
  res.status(200).json({
    success: true,
    message: 'Directory entry updated successfully',
    data: directory
  });
});

// @desc    Delete directory entry
// @route   DELETE /api/directories/:id
// @access  Private/Admin
export const deleteDirectory = asyncHandler(async (req, res) => {
  const directory = await Directory.findById(req.params.id);
  
  if (!directory) {
    res.status(404);
    throw new Error('Directory entry not found');
  }
  
  // Soft delete
  directory.isActive = false;
  await directory.save();
  
  res.status(200).json({
    success: true,
    message: 'Directory entry deleted successfully'
  });
});

// @desc    Get all states (for admin dropdown)
// @route   GET /api/directories/states
// @access  Private/Admin
export const getAllStates = asyncHandler(async (req, res) => {
  const states = await Directory.distinct('state', { isActive: true });
  
  res.status(200).json({
    success: true,
    data: states.sort()
  });
});

// @desc    Get directory stats
// @route   GET /api/directories/stats
// @access  Private/Admin
export const getDirectoryStats = asyncHandler(async (req, res) => {
  const [fomtCount, fnmtCount, stateCount] = await Promise.all([
    Directory.countDocuments({ type: 'FOMT', isActive: true }),
    Directory.countDocuments({ type: 'FNMT', isActive: true }),
    Directory.distinct('state', { isActive: true }).then(states => states.length)
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      fomtCount,
      fnmtCount,
      stateCount,
      total: fomtCount + fnmtCount
    }
  });
});