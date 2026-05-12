#!/usr/bin/env node
/**
 * BGI Hackathon — Generate Sample Excel File
 * Run: node generate-sample.js
 */

const XLSX = require('xlsx');
const path = require('path');

const sampleData = [
  { 'Reg.Id': 'BGI001', 'Team Name': 'Code Warriors', 'Team Leader Name': 'Rahul Sharma', 'Theme Name': 'Smart City', 'Problem Statement Name': 'Traffic Management', 'Result': 'Selected' },
  { 'Reg.Id': 'BGI002', 'Team Name': 'Tech Titans', 'Team Leader Name': 'Priya Singh', 'Theme Name': 'Healthcare', 'Problem Statement Name': 'Disease Prediction', 'Result': 'Rejected' },
  { 'Reg.Id': 'BGI003', 'Team Name': 'Digital Dreamers', 'Team Leader Name': 'Amit Kumar', 'Theme Name': 'Education', 'Problem Statement Name': 'Virtual Classroom', 'Result': 'Pending' },
  { 'Reg.Id': 'BGI004', 'Team Name': 'InnoVators', 'Team Leader Name': 'Sneha Patel', 'Theme Name': 'Agriculture', 'Problem Statement Name': 'Crop Yield Prediction', 'Result': 'Selected' },
  { 'Reg.Id': 'BGI005', 'Team Name': 'AI Alchemists', 'Team Leader Name': 'Vikram Rao', 'Theme Name': 'Cybersecurity', 'Problem Statement Name': 'Phishing Detection', 'Result': 'Shortlisted' },
  { 'Reg.Id': 'BGI006', 'Team Name': 'ByteBusters', 'Team Leader Name': 'Ananya Gupta', 'Theme Name': 'FinTech', 'Problem Statement Name': 'Fraud Detection', 'Result': 'Rejected' },
  { 'Reg.Id': 'BGI007', 'Team Name': 'Smart Coders', 'Team Leader Name': 'Arjun Mehta', 'Theme Name': 'Smart City', 'Problem Statement Name': 'Waste Management', 'Result': 'Pending' },
  { 'Reg.Id': 'BGI008', 'Team Name': 'Future Builders', 'Team Leader Name': 'Divya Nair', 'Theme Name': 'Healthcare', 'Problem Statement Name': 'Telemedicine', 'Result': 'Selected' },
  { 'Reg.Id': 'BGI009', 'Team Name': 'HackMasters', 'Team Leader Name': 'Rohan Verma', 'Theme Name': 'SpaceTech', 'Problem Statement Name': 'Satellite Imaging', 'Result': 'Rejected' },
  { 'Reg.Id': 'BGI010', 'Team Name': 'Tech Pioneers', 'Team Leader Name': 'Kavita Joshi', 'Theme Name': 'Education', 'Problem Statement Name': 'Personalized Learning', 'Result': 'Shortlisted' },
];

const ws = XLSX.utils.json_to_sheet(sampleData);
const wb = XLSX.utils.book_new();

// Set column widths
ws['!cols'] = [
  { wch: 12 }, // Reg.Id
  { wch: 22 }, // Team Name
  { wch: 22 }, // Team Leader Name
  { wch: 18 }, // Theme Name
  { wch: 30 }, // Problem Statement Name
  { wch: 16 }, // Result
];

XLSX.utils.book_append_sheet(wb, ws, 'Results');
const outputPath = path.join(__dirname, 'BGI_Hackathon_Sample_Results.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Sample Excel generated:', outputPath);
console.log(`   ${sampleData.length} teams written`);
