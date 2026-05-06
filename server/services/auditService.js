const AuditLog = require('../models/AuditLog');

/**
 * AuditService — records an immutable audit trail for every significant
 * action in the Aarogyam system, supporting compliance with HIPAA,
 * Indian healthcare regulations, and NOTTO requirements.
 */
class AuditService {
  /**
   * Log a system action.
   * @param {Object} params
   * @param {string} params.action         — action enum value
   * @param {Object} params.actor          — { userId, userType, userName, hospitalId, ipAddress }
   * @param {Object} params.entity         — { entityType, entityId, entityName }
   * @param {Object} params.details        — { description, previousState, newState, reason, ... }
   * @param {string[]} params.complianceFlags — e.g. ['hipaa', 'notto']
   * @param {string} params.severity       — 'info' | 'warning' | 'critical'
   * @param {string} params.outcome        — 'success' | 'failure' | 'partial' | 'pending'
   */
  async logAction({
    action,
    actor,
    entity,
    details,
    complianceFlags = [],
    severity = 'info',
    outcome = 'success',
  }) {
    try {
      const log = new AuditLog({
        action,
        actor,
        entity,
        details,
        complianceFlags,
        severity,
        outcome,
      });
      await log.save();
      return { success: true, logId: log._id };
    } catch (error) {
      console.error('❌ Audit log failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Convenience: log an allocation decision.
   */
  async logAllocationDecision({ actor, patientId, patientName, organId, organType, score, decision, biasCheck, reason }) {
    return this.logAction({
      action: 'allocation_decision',
      actor,
      entity: { entityType: 'allocation', entityId: organId, entityName: `${organType} → ${patientName}` },
      details: {
        description: `Allocation decision: ${organType} for patient ${patientName} — ${decision}`,
        newState: { patientId, organId, score, decision },
        reason,
        allocationScore: score,
        biasCheckResult: biasCheck,
      },
      complianceFlags: ['notto', 'indian_healthcare'],
      severity: 'info',
      outcome: decision === 'approved' ? 'success' : 'failure',
    });
  }

  /**
   * Get audit trail with filtering and pagination.
   */
  async getAuditTrail({ action, actorId, entityType, entityId, severity, startDate, endDate, page = 1, limit = 50 } = {}) {
    const query = {};
    if (action) query.action = action;
    if (actorId) query['actor.userId'] = actorId;
    if (entityType) query['entity.entityType'] = entityType;
    if (entityId) query['entity.entityId'] = entityId;
    if (severity) query.severity = severity;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Get all actions by a specific user.
   */
  async getActionsByUser(userId, { page = 1, limit = 50 } = {}) {
    return this.getAuditTrail({ actorId: userId, page, limit });
  }

  /**
   * Generate a compliance report for a date range.
   */
  async generateComplianceReport(startDate, endDate) {
    const dateQuery = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const [totalActions, allocationDecisions, criticalActions, biasFlags] = await Promise.all([
      AuditLog.countDocuments(dateQuery),
      AuditLog.countDocuments({ ...dateQuery, action: 'allocation_decision' }),
      AuditLog.countDocuments({ ...dateQuery, severity: 'critical' }),
      AuditLog.find({
        ...dateQuery,
        action: 'allocation_decision',
        'details.biasCheckResult.passed': false,
      }).lean(),
    ]);

    const actionBreakdown = await AuditLog.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const outcomeBreakdown = await AuditLog.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$outcome', count: { $sum: 1 } } },
    ]);

    return {
      reportPeriod: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      summary: {
        totalActions,
        allocationDecisions,
        criticalActions,
        biasFlags: biasFlags.length,
      },
      actionBreakdown: actionBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      outcomeBreakdown: outcomeBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      biasAlerts: biasFlags.map((f) => ({
        logId: f._id,
        action: f.action,
        entity: f.entity,
        flags: f.details?.biasCheckResult?.flags || [],
        timestamp: f.createdAt,
      })),
      complianceStatus: biasFlags.length === 0 ? 'compliant' : 'review_required',
    };
  }
}

module.exports = new AuditService();
