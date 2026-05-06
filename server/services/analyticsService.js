const Patient = require('../models/Patient');
const Organ = require('../models/Organ');
const Hospital = require('../models/Hospital');
const AuditLog = require('../models/AuditLog');

class AnalyticsService {
  async getAllocationStats() {
    try {
      const [totalPatients, waitingPatients, matchedPatients, transplantedPatients,
             totalOrgans, availableOrgans, totalHospitals, activeHospitals] = await Promise.all([
        Patient.countDocuments(), Patient.countDocuments({ status: 'waiting' }),
        Patient.countDocuments({ status: 'matched' }), Patient.countDocuments({ status: 'transplanted' }),
        Organ.countDocuments(), Organ.countDocuments({ status: 'available' }),
        Hospital.countDocuments(), Hospital.countDocuments({ status: 'active' }),
      ]);
      const organDist = await Organ.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
      const urgencyDist = await Patient.aggregate([{ $match: { status: 'waiting' } }, { $group: { _id: '$urgencyLevel', count: { $sum: 1 } } }]);
      return {
        patients: { total: totalPatients, waiting: waitingPatients, matched: matchedPatients, transplanted: transplantedPatients },
        organs: { total: totalOrgans, available: availableOrgans },
        hospitals: { total: totalHospitals, active: activeHospitals },
        organDistribution: organDist.reduce((a, i) => { a[i._id] = i.count; return a; }, {}),
        urgencyDistribution: urgencyDist.reduce((a, i) => { a[i._id] = i.count; return a; }, {}),
        lastUpdated: new Date().toISOString(),
      };
    } catch { return this._demoStats(); }
  }

  async getGenderParityMetrics() {
    try {
      const stats = await Patient.aggregate([{ $group: { _id: '$gender', total: { $sum: 1 },
        waiting: { $sum: { $cond: [{ $eq: ['$status', 'waiting'] }, 1, 0] } },
        transplanted: { $sum: { $cond: [{ $eq: ['$status', 'transplanted'] }, 1, 0] } },
        avgUrgency: { $avg: '$urgencyScore' } } }]);
      const total = stats.reduce((s, g) => s + g.total, 0);
      const parity = stats.map(g => ({ gender: g._id, count: g.total, percentage: total > 0 ? ((g.total / total) * 100).toFixed(1) : 0,
        waiting: g.waiting, transplanted: g.transplanted, avgUrgency: Math.round(g.avgUrgency || 0) }));
      const maleP = parity.find(p => p.gender === 'male')?.percentage || 50;
      return { genderBreakdown: parity, parityScore: Math.round(100 - Math.abs(maleP - 50) * 2), totalPatients: total, lastUpdated: new Date().toISOString() };
    } catch { return this._demoParity(); }
  }

  async getRegionalAnalytics() {
    try {
      const regionStats = await Patient.aggregate([{ $group: { _id: '$region', totalPatients: { $sum: 1 },
        waiting: { $sum: { $cond: [{ $eq: ['$status', 'waiting'] }, 1, 0] } },
        transplanted: { $sum: { $cond: [{ $eq: ['$status', 'transplanted'] }, 1, 0] } },
        avgUrgency: { $avg: '$urgencyScore' } } }, { $sort: { totalPatients: -1 } }]);
      const hospByRegion = await Hospital.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$region', count: { $sum: 1 } } }]);
      const hMap = hospByRegion.reduce((a, h) => { a[h._id] = h.count; return a; }, {});
      return { regions: regionStats.map(r => ({ region: r._id || 'Unknown', totalPatients: r.totalPatients, waiting: r.waiting,
        transplanted: r.transplanted, avgUrgency: Math.round(r.avgUrgency || 0), hospitals: hMap[r._id] || 0,
        successRate: r.totalPatients > 0 ? ((r.transplanted / r.totalPatients) * 100).toFixed(1) : 0 })), lastUpdated: new Date().toISOString() };
    } catch { return this._demoRegional(); }
  }

  async getSystemHealth() {
    const up = process.uptime(), mem = process.memoryUsage();
    return { status: 'healthy', uptime: { seconds: Math.round(up), formatted: `${Math.floor(up / 3600)}h ${Math.floor((up % 3600) / 60)}m` },
      memory: { heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`, rss: `${(mem.rss / 1024 / 1024).toFixed(1)} MB` },
      nodeVersion: process.version, timestamp: new Date().toISOString() };
  }

  async getTrends(days = 30) {
    try {
      const start = new Date(); start.setDate(start.getDate() - days);
      const trends = await AuditLog.aggregate([{ $match: { action: 'allocation_decision', createdAt: { $gte: start } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, allocations: { $sum: 1 },
          successful: { $sum: { $cond: [{ $eq: ['$outcome', 'success'] }, 1, 0] } } } }, { $sort: { _id: 1 } }]);
      return { trends, period: `${days} days`, lastUpdated: new Date().toISOString() };
    } catch { return this._demoTrends(days); }
  }

  // Demo / fallback data
  _demoStats() {
    return { patients: { total: 2847, waiting: 1923, matched: 412, transplanted: 512 }, organs: { total: 1245, available: 87 },
      hospitals: { total: 1200, active: 1156 }, organDistribution: { kidney: 520, liver: 340, heart: 180, lung: 120 },
      urgencyDistribution: { critical: 234, high: 567, medium: 789, low: 333 }, lastUpdated: new Date().toISOString(), _demo: true };
  }
  _demoParity() {
    return { genderBreakdown: [{ gender: 'male', count: 1424, percentage: '50.0', waiting: 962, transplanted: 256, avgUrgency: 62 },
      { gender: 'female', count: 1423, percentage: '50.0', waiting: 961, transplanted: 256, avgUrgency: 63 }],
      parityScore: 100, totalPatients: 2847, lastUpdated: new Date().toISOString(), _demo: true };
  }
  _demoRegional() {
    return { regions: [{ region: 'Delhi NCR', totalPatients: 456, waiting: 312, transplanted: 89, avgUrgency: 65, hospitals: 45, successRate: '19.5' },
      { region: 'Mumbai', totalPatients: 389, waiting: 267, transplanted: 76, avgUrgency: 61, hospitals: 38, successRate: '19.5' },
      { region: 'Chennai', totalPatients: 298, waiting: 204, transplanted: 58, avgUrgency: 58, hospitals: 28, successRate: '19.5' }],
      lastUpdated: new Date().toISOString(), _demo: true };
  }
  _demoTrends(days) {
    const trends = [];
    for (let i = days; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i);
      trends.push({ _id: d.toISOString().split('T')[0], allocations: Math.floor(Math.random() * 20) + 5, successful: Math.floor(Math.random() * 15) + 3 }); }
    return { trends, period: `${days} days`, lastUpdated: new Date().toISOString(), _demo: true };
  }
}

module.exports = new AnalyticsService();
