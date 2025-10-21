'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Insert domains
    const domains = await queryInterface.bulkInsert('Domains', [
      {
        domain_name: 'Data Structures & Algorithms',
        description: 'Competitive programming, problem solving, and algorithmic thinking',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        domain_name: 'Web Development',
        description: 'Frontend and backend web development technologies',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        domain_name: 'Database Management',
        description: 'SQL, database design, and data management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        domain_name: 'Machine Learning',
        description: 'AI/ML algorithms, data science, and model development',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        domain_name: 'DevOps & Cloud',
        description: 'Infrastructure, deployment, and cloud technologies',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Get domain IDs
    const domainIds = await queryInterface.sequelize.query(
      'SELECT domain_id FROM "Domains" ORDER BY domain_id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert tiers for each domain
    const tiers = [];
    const domainTierConfigs = [
      {
        name: 'DSA',
        tiers: [
          { level: 5, name: 'Legend', max_slots: 50, yearly_cost: 5000 },
          { level: 4, name: 'Master', max_slots: 100, yearly_cost: 3000 },
          { level: 3, name: 'Expert', max_slots: 200, yearly_cost: 1500 },
          { level: 2, name: 'Advanced', max_slots: 500, yearly_cost: 500 },
          { level: 1, name: 'Beginner', max_slots: null, yearly_cost: 0 }
        ]
      },
      {
        name: 'Web Development',
        tiers: [
          { level: 5, name: 'Full Stack Architect', max_slots: 40, yearly_cost: 4500 },
          { level: 4, name: 'Senior Developer', max_slots: 80, yearly_cost: 2500 },
          { level: 3, name: 'Mid-Level Developer', max_slots: 150, yearly_cost: 1200 },
          { level: 2, name: 'Junior Developer', max_slots: 300, yearly_cost: 400 },
          { level: 1, name: 'Entry Level', max_slots: null, yearly_cost: 0 }
        ]
      },
      {
        name: 'Database Management',
        tiers: [
          { level: 5, name: 'Database Architect', max_slots: 30, yearly_cost: 4000 },
          { level: 4, name: 'Senior DBA', max_slots: 60, yearly_cost: 2000 },
          { level: 3, name: 'Database Specialist', max_slots: 120, yearly_cost: 1000 },
          { level: 2, name: 'Database Developer', max_slots: 250, yearly_cost: 350 },
          { level: 1, name: 'SQL Developer', max_slots: null, yearly_cost: 0 }
        ]
      },
      {
        name: 'Machine Learning',
        tiers: [
          { level: 5, name: 'ML Research Scientist', max_slots: 25, yearly_cost: 6000 },
          { level: 4, name: 'Senior ML Engineer', max_slots: 50, yearly_cost: 3500 },
          { level: 3, name: 'ML Engineer', max_slots: 100, yearly_cost: 1800 },
          { level: 2, name: 'Data Scientist', max_slots: 200, yearly_cost: 800 },
          { level: 1, name: 'Data Analyst', max_slots: null, yearly_cost: 0 }
        ]
      },
      {
        name: 'DevOps & Cloud',
        tiers: [
          { level: 5, name: 'Cloud Solutions Architect', max_slots: 35, yearly_cost: 5500 },
          { level: 4, name: 'Senior DevOps Engineer', max_slots: 70, yearly_cost: 3000 },
          { level: 3, name: 'DevOps Engineer', max_slots: 140, yearly_cost: 1500 },
          { level: 2, name: 'Cloud Engineer', max_slots: 280, yearly_cost: 600 },
          { level: 1, name: 'System Administrator', max_slots: null, yearly_cost: 0 }
        ]
      }
    ];

    for (let i = 0; i < domainIds.length; i++) {
      const domainId = domainIds[i].domain_id;
      const config = domainTierConfigs[i];
      
      for (const tierConfig of config.tiers) {
        tiers.push({
          domain_id: domainId,
          tier_level: tierConfig.level,
          tier_name: tierConfig.name,
          max_slots: tierConfig.max_slots,
          yearly_cost: tierConfig.yearly_cost,
          features: JSON.stringify({
            analytics: tierConfig.level >= 3,
            priority_support: tierConfig.level >= 4,
            custom_assessments: tierConfig.level >= 2,
            bulk_operations: tierConfig.level >= 3,
            api_access: tierConfig.level >= 4
          }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('Tiers', tiers);

    // Insert sample tier thresholds
    const thresholds = [];
    for (let i = 0; i < domainIds.length; i++) {
      const domainId = domainIds[i].domain_id;
      
      // Get tier IDs for this domain
      const domainTiers = await queryInterface.sequelize.query(
        `SELECT tier_id, tier_level FROM "Tiers" WHERE domain_id = ${domainId} ORDER BY tier_level DESC`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Set score thresholds
      const scoreRanges = [
        { level: 5, min: 90, max: 100 },
        { level: 4, min: 75, max: 89 },
        { level: 3, min: 60, max: 74 },
        { level: 2, min: 40, max: 59 },
        { level: 1, min: 0, max: 39 }
      ];

      for (const tier of domainTiers) {
        const range = scoreRanges.find(r => r.level === tier.tier_level);
        if (range) {
          thresholds.push({
            domain_id: domainId,
            tier_id: tier.tier_id,
            min_score: range.min,
            max_score: range.max,
            is_active: true,
            effective_date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    await queryInterface.bulkInsert('Tier_Thresholds', thresholds);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tier_Thresholds', null, {});
    await queryInterface.bulkDelete('Tiers', null, {});
    await queryInterface.bulkDelete('Domains', null, {});
  }
};
