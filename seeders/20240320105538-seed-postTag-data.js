'use strict';
const fs = require("fs")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let dataPostTag = JSON.parse(fs.readFileSync("./postTags.json", "utf-8"))
    let refinedData = dataPostTag.map((el)=>{
     el.createdAt = el.updatedAt = new Date()
     return el
    })
    
    await queryInterface.bulkInsert('PostTags', refinedData, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('PostTags', null, {})
  }
};
