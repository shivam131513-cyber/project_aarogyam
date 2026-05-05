const axios = require('axios');

class OrganAllocationEngine {
  constructor() {
    this.weights = {
      medicalUrgency: 0.40,
      organCompatibility: 0.30,
      geographicProximity: 0.20,
      waitTime: 0.10
    };
    
    this.organViabilityWindows = {
      heart: 6, // hours
      liver: 12,
      kidney: 36,
      lung: 8,
      pancreas: 24,
      cornea: 168 // 7 days
    };
  }

  /**
   * Main allocation algorithm - finds best patient for available organ
   * @param {Object} organ - Available organ details
   * @param {Array} eligiblePatients - List of compatible patients
   * @returns {Object} Best matched patient with allocation score
   */
  async allocateOrgan(organ, eligiblePatients) {
    try {
      const scoredPatients = await Promise.all(
        eligiblePatients.map(patient => this.calculateAllocationScore(organ, patient))
      );

      // Sort by allocation score (highest first)
      scoredPatients.sort((a, b) => b.allocationScore - a.allocationScore);

      // Apply bias prevention filters
      const fairAllocations = this.applyBiasPrevention(scoredPatients);

      return {
        selectedPatient: fairAllocations[0],
        allScores: fairAllocations,
        allocationReason: this.generateAllocationReason(fairAllocations[0]),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Allocation engine error:', error);
      throw new Error('Failed to allocate organ');
    }
  }

  /**
   * Calculate comprehensive allocation score for patient-organ pair
   */
  async calculateAllocationScore(organ, patient) {
    const medicalScore = await this.calculateMedicalUrgency(patient);
    const compatibilityScore = await this.calculateOrganCompatibility(organ, patient);
    const proximityScore = await this.calculateGeographicProximity(organ, patient);
    const waitTimeScore = this.calculateWaitTimeScore(patient);

    const allocationScore = 
      (medicalScore * this.weights.medicalUrgency) +
      (compatibilityScore * this.weights.organCompatibility) +
      (proximityScore * this.weights.geographicProximity) +
      (waitTimeScore * this.weights.waitTime);

    return {
      patient,
      allocationScore: Math.round(allocationScore * 100) / 100,
      breakdown: {
        medicalUrgency: medicalScore,
        organCompatibility: compatibilityScore,
        geographicProximity: proximityScore,
        waitTime: waitTimeScore
      }
    };
  }

  /**
   * Calculate medical urgency score (0-100)
   */
  async calculateMedicalUrgency(patient) {
    const urgencyFactors = {
      criticalCondition: patient.medicalStatus === 'critical' ? 40 : 
                        patient.medicalStatus === 'urgent' ? 25 : 10,
      
      organFailureStage: patient.organFailureStage === 'end-stage' ? 30 :
                        patient.organFailureStage === 'severe' ? 20 : 10,
      
      comorbidities: Math.max(0, 20 - (patient.comorbidities?.length || 0) * 3),
      
      survivalProbability: patient.survivalProbability || 50,
      
      ageAdjustment: patient.age < 18 ? 10 : // Pediatric priority
                    patient.age > 65 ? -5 : 0
    };

    const baseScore = Object.values(urgencyFactors).reduce((sum, score) => sum + score, 0);
    return Math.min(100, Math.max(0, baseScore));
  }

  /**
   * Calculate organ compatibility score (0-100)
   */
  async calculateOrganCompatibility(organ, patient) {
    const compatibilityFactors = {
      bloodType: this.checkBloodTypeCompatibility(organ.bloodType, patient.bloodType),
      hlaMatching: await this.calculateHLACompatibility(organ.hlaType, patient.hlaType),
      organSize: this.calculateSizeCompatibility(organ.size, patient.bodySize),
      crossMatch: patient.crossMatchResult === 'negative' ? 25 : 0
    };

    return Object.values(compatibilityFactors).reduce((sum, score) => sum + score, 0);
  }

  /**
   * Blood type compatibility matrix
   */
  checkBloodTypeCompatibility(donorType, recipientType) {
    const compatibility = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };

    return compatibility[donorType]?.includes(recipientType) ? 25 : 0;
  }

  /**
   * Calculate HLA compatibility (simplified)
   */
  async calculateHLACompatibility(donorHLA, recipientHLA) {
    if (!donorHLA || !recipientHLA) return 15; // Default score if HLA not available
    
    const matches = ['A', 'B', 'DR'].reduce((count, locus) => {
      return count + (donorHLA[locus] === recipientHLA[locus] ? 1 : 0);
    }, 0);

    return matches * 8.33; // Max 25 points for perfect match
  }

  /**
   * Calculate size compatibility
   */
  calculateSizeCompatibility(organSize, patientSize) {
    const sizeDifference = Math.abs(organSize - patientSize) / patientSize;
    if (sizeDifference <= 0.1) return 25; // Perfect size match
    if (sizeDifference <= 0.2) return 20;
    if (sizeDifference <= 0.3) return 15;
    return 10;
  }

  /**
   * Calculate geographic proximity score considering organ viability
   */
  async calculateGeographicProximity(organ, patient) {
    try {
      const distance = await this.calculateDistance(
        organ.location,
        patient.hospitalLocation
      );

      const travelTime = distance / 60; // Assuming 60 km/h average speed
      const viabilityWindow = this.organViabilityWindows[organ.type.toLowerCase()];
      
      if (travelTime > viabilityWindow) return 0; // Beyond viability window
      
      const proximityScore = Math.max(0, 100 - (travelTime / viabilityWindow) * 100);
      return proximityScore;
    } catch (error) {
      console.error('Geographic calculation error:', error);
      return 50; // Default score if calculation fails
    }
  }

  /**
   * Calculate wait time score - longer wait gets higher priority
   */
  calculateWaitTimeScore(patient) {
    const waitDays = Math.floor(
      (new Date() - new Date(patient.registrationDate)) / (1000 * 60 * 60 * 24)
    );
    
    // Logarithmic scale to prevent extreme wait time bias
    return Math.min(100, Math.log(waitDays + 1) * 20);
  }

  /**
   * Apply bias prevention algorithms
   */
  applyBiasPrevention(scoredPatients) {
    // Gender bias prevention
    const genderBalanced = this.preventGenderBias(scoredPatients);
    
    // Socioeconomic bias prevention
    const economicallyFair = this.preventSocioeconomicBias(genderBalanced);
    
    // Geographic bias prevention
    const geographicallyFair = this.preventGeographicBias(economicallyFair);
    
    return geographicallyFair;
  }

  /**
   * Prevent gender bias in allocation
   */
  preventGenderBias(scoredPatients) {
    // If top candidates have similar scores (within 5 points), prioritize underrepresented gender
    const topScore = scoredPatients[0]?.allocationScore || 0;
    const similarScoreCandidates = scoredPatients.filter(
      p => Math.abs(p.allocationScore - topScore) <= 5
    );

    if (similarScoreCandidates.length > 1) {
      // Check recent allocation history to balance gender representation
      const femaleCandidate = similarScoreCandidates.find(p => p.patient.gender === 'female');
      if (femaleCandidate && this.shouldPrioritizeFemale()) {
        // Move female candidate to top if gender balancing is needed
        const reordered = [femaleCandidate, ...scoredPatients.filter(p => p !== femaleCandidate)];
        return reordered;
      }
    }

    return scoredPatients;
  }

  /**
   * Prevent socioeconomic bias
   */
  preventSocioeconomicBias(scoredPatients) {
    // Economic status should not affect allocation - this is already handled
    // by excluding financial factors from the algorithm
    return scoredPatients.map(p => ({
      ...p,
      // Ensure no economic factors are considered
      economicStatus: 'redacted'
    }));
  }

  /**
   * Prevent geographic bias
   */
  preventGeographicBias(scoredPatients) {
    // Ensure rural patients aren't disadvantaged beyond medical necessity
    return scoredPatients.map(p => {
      if (p.patient.location?.type === 'rural' && p.breakdown.geographicProximity < 30) {
        // Apply rural adjustment factor
        p.allocationScore += 2;
        p.ruralAdjustment = true;
      }
      return p;
    });
  }

  /**
   * Check if female candidates should be prioritized for gender balance
   */
  shouldPrioritizeFemale() {
    // This would check recent allocation statistics
    // For now, return true to address the 80% male recipient bias
    return Math.random() > 0.2; // 80% chance to prioritize female
  }

  /**
   * Calculate distance between two locations
   */
  async calculateDistance(location1, location2) {
    try {
      // In production, use Google Maps Distance Matrix API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`, {
          params: {
            origins: `${location1.lat},${location1.lng}`,
            destinations: `${location2.lat},${location2.lng}`,
            key: process.env.GOOGLE_MAPS_API_KEY,
            units: 'metric'
          }
        }
      );

      const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert to km
      return distance;
    } catch (error) {
      // Fallback: Haversine formula for distance calculation
      return this.calculateHaversineDistance(location1, location2);
    }
  }

  /**
   * Haversine distance calculation fallback
   */
  calculateHaversineDistance(pos1, pos2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(pos2.lat - pos1.lat);
    const dLon = this.toRad(pos2.lng - pos1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(pos1.lat)) * Math.cos(this.toRad(pos2.lat)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI/180);
  }

  /**
   * Generate human-readable allocation reason
   */
  generateAllocationReason(allocation) {
    const { breakdown } = allocation;
    const reasons = [];

    if (breakdown.medicalUrgency > 80) {
      reasons.push("Critical medical condition requiring immediate intervention");
    }
    if (breakdown.organCompatibility > 80) {
      reasons.push("Excellent organ compatibility match");
    }
    if (breakdown.geographicProximity > 70) {
      reasons.push("Optimal geographic proximity for organ viability");
    }
    if (breakdown.waitTime > 60) {
      reasons.push("Extended wait time on transplant list");
    }

    return reasons.join("; ");
  }
}

module.exports = OrganAllocationEngine;
